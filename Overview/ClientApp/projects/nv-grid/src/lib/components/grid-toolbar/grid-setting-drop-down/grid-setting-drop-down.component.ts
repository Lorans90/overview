import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NvColumnConfig, NvGridConfig, NvRowHeight } from '../../../models/grid-config';
import { ConfigurationService } from '../../../services/configuration.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropService } from '../../../services/drag-drop.service';

@Component({
  selector: 'nv-drop-down',
  templateUrl: './grid-setting-drop-down.component.html',
  styleUrls: ['./grid-setting-drop-down.component.css']
})
export class GridSettingDropDownComponent {
  public visible = false;
  @Input() public gridConfig: NvGridConfig;
  @Output() public gridConfigChangedOnSave = new EventEmitter<void>();
  @Output() public gridConfigChangedOnReset = new EventEmitter<void>();

  public NvRowHeight = NvRowHeight;

  constructor(
    private configurationService: ConfigurationService,
    private dragDropService: DragDropService
  ) {
  }
  get visibleColumns() {
    if (this.gridConfig) {
      return this.gridConfig.columns.filter(column => column.visible);
    }
  }
  toggle(column: NvColumnConfig): void {
    column.hidden = !column.hidden;
    this.configurationService.visibleColumns
      .next(this.configurationService.getVisibleAndNotHiddenColumns(this.gridConfig.columns));
  }

  save(): void {
    if (this.gridConfig) {
      this.configurationService.saveConfigToLocalStorage(
        this.gridConfig,
        this.configurationService.getLocalStorageChangedGridKey(this.gridConfig.gridName)
      );
      this.gridConfigChangedOnSave.emit();
      this.hideMenu();
    }
  }

  reset(): void {
    if (this.gridConfig) {
      this.configurationService.removeLocalStorageOfGrid(this.gridConfig.gridName);
      const originalConfig = this.configurationService.getOriginalConfig(this.gridConfig.gridName);
      if (originalConfig) {
        this.configurationService.applyChangesInGridConfigColumns(originalConfig, this.gridConfig);
      }
      this.gridConfigChangedOnReset.emit();
      this.hideMenu();
    }
  }

  disable(): boolean {
    if (this.gridConfig) {

      const actualConfig = this.configurationService.getActualConfig(this.gridConfig);
      const savedConfig = this.configurationService.getSavedLocalStorageConfig(this.gridConfig.gridName);
      const originalConfig = this.configurationService.getOriginalConfig(this.gridConfig.gridName);

      if (savedConfig) {
        return JSON.stringify(savedConfig) === JSON.stringify(actualConfig);
      }

      return JSON.stringify(originalConfig) === JSON.stringify(actualConfig);
    }
  }

  disableResetButton(): boolean {
    if (this.gridConfig) {
      const savedConfig = this.configurationService.getSavedLocalStorageConfig(this.gridConfig.gridName);
      const originalConfig = this.configurationService.getOriginalConfig(this.gridConfig.gridName);
      return !savedConfig ||
        JSON.stringify(originalConfig) === JSON.stringify(savedConfig);
    }
  }

  hideMenu(): boolean {
    return this.visible = false;
  }

  dragEndEvent(event: CdkDragDrop<string[]>) {
    if (this.gridConfig) {
      const newOrderColumns = this.dragDropService.dragEndEvent(
        event,
        this.gridConfig.columns,
        this.configurationService.visibleColumns.value
      );
      this.configurationService.visibleColumns
        .next(this.configurationService.getVisibleAndNotHiddenColumns(newOrderColumns));
    }
  }

  changeRowHeight(height?: NvRowHeight) {
    if (this.gridConfig) {
      if (this.gridConfig.rowHeight !== height) {
        this.gridConfig.rowHeight = height;
      }
    }
  }
}
