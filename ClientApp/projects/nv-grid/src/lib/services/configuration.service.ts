import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {
  NvColumnConfig,
  NvGridButtonsPosition,
  NvGridConfig,
  NvGridConstants,
  NvGridPin,
  NvGridRowSelectionType,
  NvLocalStorageConfig
} from '../models/grid-config';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConfigurationService {
  public visibleColumns: BehaviorSubject<NvColumnConfig[]> = new BehaviorSubject([]);
  public visibleColumns$ = this.visibleColumns.asObservable();

  constructor(private localStorageService: LocalStorageService) {
  }

  public getLocalStorageOriginGridKey(gridName: string): string {
    return NvGridConstants.GRID_LOCAL_STORAGE_PREFIX_NAME
      + gridName
      + '.org';
  }

  public getLocalStorageChangedGridKey(gridName: string): string {
    return NvGridConstants.GRID_LOCAL_STORAGE_PREFIX_NAME
      + gridName;
  }

  public saveConfigToLocalStorage(gridConfig: NvGridConfig, gridKey: string): void {
    const configToBeSaved = this.getActualConfig(gridConfig);
    this.localStorageService
      .setLocal(gridKey, configToBeSaved);
  }

  public getOriginalConfig(gridName: string): NvLocalStorageConfig {
    return this.localStorageService
      .getLocal(this.getLocalStorageOriginGridKey(gridName));
  }

  public getSavedLocalStorageConfig(gridName: string): NvLocalStorageConfig {
    return this.localStorageService
      .getLocal(this.getLocalStorageChangedGridKey(gridName));
  }

  public getActualConfig(gridConfig: NvGridConfig): NvLocalStorageConfig {
    const { gridName, pin, rowHeight } = gridConfig;
    const configToBeSaved: NvLocalStorageConfig = {
      gridName,
      rowHeight,
      pin,
      columns: this.getActualGridConfigColumns(gridConfig.columns),
      version: NvGridConstants.currenctLocalStorageVersion,
    };
    return configToBeSaved;
  }

  public removeLocalStorageOfGrid(gridName: string): void {
    this.localStorageService.removeLocal(this.getLocalStorageChangedGridKey(gridName));
  }

  public removeAllSavedGridConfig(): void {
    this.localStorageService.removeAllLocals();
  }

  public getVisibleAndNotHiddenColumns(gridConfigColumns: NvColumnConfig[]): NvColumnConfig[] {
    return gridConfigColumns.filter(
      (column: NvColumnConfig) => !column.hidden && column.visible
    );
  }

  public gridDisplaysToolbar(gridConfig: NvGridConfig): boolean {
    return gridConfig && !gridConfig.hideToolbar;
  }

  public isGridExpandable(gridConfig: NvGridConfig): boolean {
    return gridConfig && !!gridConfig.expandableComponentConfig;
  }

  public mergeLocalStorageConfigInGridConfig(gridConfig: NvGridConfig) {
    if (gridConfig) {
      this.saveConfigToLocalStorage(
        gridConfig,
        this.getLocalStorageOriginGridKey(gridConfig.gridName)
      );
      const detectChangesColumns = this.getSavedLocalStorageConfig(gridConfig.gridName);

      if (detectChangesColumns) {
        this.applyChangesInGridConfigColumns(detectChangesColumns, gridConfig);
      }
    }
  }

  public applyChangesInGridConfigColumns(localStorageConfig: NvLocalStorageConfig, gridConfig: NvGridConfig) {
    if (localStorageConfig.version === NvGridConstants.currenctLocalStorageVersion) {
      const columnsCorrectOrderArray = [];
      localStorageConfig.columns.forEach(column => {
        const foundColumn = gridConfig.columns.find(mainColumn => mainColumn.key === column.key);
        if (foundColumn) {
          foundColumn.width = column.width;
          foundColumn.hidden = column.hidden;
          columnsCorrectOrderArray.push(foundColumn);
        }
      });
      gridConfig.columns = columnsCorrectOrderArray;
      gridConfig.rowHeight = localStorageConfig.rowHeight;
      gridConfig.pin = localStorageConfig.pin;
      this.updateVisibleColumns(gridConfig.columns);
    } else {
      this.removeAllSavedGridConfig();
      if (gridConfig) {

        this.saveConfigToLocalStorage(
          gridConfig,
          this.getLocalStorageOriginGridKey(gridConfig.gridName)
        );
      }
    }
  }

  public isPinned(pin: NvGridPin, colIndex: number) {
    if (pin && pin.pinTill) {
      return colIndex < pin.pinTill;
    }
    return false;
  }

  public getCellLeftPosition(gridConfig: NvGridConfig, colIndex: number): number {
    if (this.isPinned(gridConfig.pin, colIndex)) {
      let left = 0;
      left +=
        gridConfig.rowButtonsPosition === NvGridButtonsPosition.CollapsedLeft ?
          NvGridConstants.MENU_BUTTON_COLUMN_WIDTH : 0;

      if (gridConfig.rowSelectionType in NvGridRowSelectionType) {
        left += gridConfig.rowSelectionType === NvGridRowSelectionType.Checkbox ?
          NvGridConstants.CHECKBOX_COLUMN_WIDTH :
          NvGridConstants.RADIO_BUTTON_COLUMN_WIDTH;
      }
      if (gridConfig.expandableComponentConfig) {
        left += NvGridConstants.EXPAND_BUTTON_COLUMN_WIDTH;
      }

      if (gridConfig.showRowIndex) {
        left += NvGridConstants.ROW_INDEX_COLUMN_WIDTH;
      }

      left += this.visibleColumns.value
        .filter((_, index: number) => index < colIndex)
        .map((column: NvColumnConfig) => column.width)
        .reduce((acc, curr) => acc + curr, 0);

      return left;
    }
    return 0;
  }

  isLastPinned(pin: NvGridPin, colIndex: number) {
    if (pin && pin.pinTill) {
      return pin.pinTill === colIndex + 1;
    }
    return false;
  }

  public getTopPosition(hideAllFilters: boolean) {
    let top = 0;
    top += NvGridConstants.HEADER_HEIGHT;
    if (!hideAllFilters) {
      top += NvGridConstants.FILTER_HEIGHT;
    }
    return top;
  }

  /**
   * Checks if there is more than one grid with the same gridName.
   * Throws an error to advises the developer to choose a unique gridname.
   * If the gridName is not unique there can be collisions with the gridConfig
   * that gets saved in the sessionStorage.
   */
  public checkForUniqueness(gridConfig: NvGridConfig): void {
    if (gridConfig) {

      const localStorageConfig: NvGridConfig = this.localStorageService.getLocal(
        this.getLocalStorageOriginGridKey(gridConfig.gridName)
      );

      if (!localStorageConfig) {
        return;
      }

      const diff1 = localStorageConfig.columns.filter(column => !gridConfig.columns.find(_column => _column.key === column.key));
      const diff2 = this.visibleColumns.value
        .filter(column => !localStorageConfig.columns.find(_column => _column.key === column.key));

      if (diff1.length || diff2.length) {
        console.error(
          `Columnkeys of the GridConfig in the localStorage doesnt match the columnkeys
        of the initializing nv-grid. This might happen when using multiple nv-grid components
        with the same gridName. Please make sure the gridName is unique.
        `
        );
      }
    }
  }

  private getActualGridConfigColumns(columns: NvColumnConfig[]): NvColumnConfig[] {
    return columns
      .map(
        (column: NvColumnConfig) => ({
          key: column.key,
          width: column.width,
          hidden: column.hidden
        })
      );
  }

  updateVisibleColumns(columns: NvColumnConfig[]) {
    this.visibleColumns.next(
      this.getVisibleAndNotHiddenColumns(columns)
    );
  }
}
