import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { GridDataService } from '../services/grid-data.service';
import {
  NvButton,
  NvCellCordinates,
  NvColumnConfig,
  NvColumnDataType,
  NvExpandedRowEvent,
  NvForm,
  NvGridConfig,
  NvGridConstants,
  NvGridRowSelectionType,
  NvLocalStorageConfig,
  NvRowSelection,
  PagingSize,
} from '../models/grid-config';
import { GridQueryResult } from '../models/grid-query-result';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { GridUtilsService } from '../services/grid-utils.service';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd';
import { DataSourceService } from '../services/data-source.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ColumnTemplateDirective } from '../directives/column-template.directive';
import { FormBuilder, FormControl } from '@angular/forms';
import { ColumnEditTemplateDirective } from '../directives/column-edit-template.directive';
import { takeUntil } from 'rxjs/operators';
import { OriginalRowsService } from '../services/original-rows.service';
import { NvGridI18nService } from '../services/nv-grid-i18n.service';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'nv-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  providers: [GridDataService, ConfigurationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public gridConfig: NvGridConfig;
  @Input() public dataSource$?: Observable<any[]>;
  @Input() public dataSource?: any[];

  @Output() rowSelectionChanged = new EventEmitter<NvRowSelection[]>();
  @Output() gridConfigChangedOnSave = new EventEmitter<NvLocalStorageConfig>();
  @Output() gridConfigChangedOnReset = new EventEmitter<void>();
  @Output() modifiedRowsOnSave = new EventEmitter<NvForm[]>();
  @Output() expandComponent = new EventEmitter<NvExpandedRowEvent>();
  @Output() filtered = new EventEmitter<void>();
  @Output() rowClicked = new EventEmitter<NvRowSelection>();
  @Output() rowDoubleClicked = new EventEmitter<NvRowSelection>();

  @ViewChild('gridWrapper', { static: true }) gridWrapper: ElementRef;
  @ContentChildren(ColumnTemplateDirective) columnTemplates: QueryList<ColumnTemplateDirective>;
  @ContentChildren(ColumnEditTemplateDirective) columnEditTemplates: QueryList<ColumnEditTemplateDirective>;

  public rows: any[];
  public totalItems: number;
  public dataRowSubscription: Subscription;
  public activeRow: any;
  public activeRowIndex = -1;
  public readonly Constants = NvGridConstants;
  public contextMenuButtons: NvButton[] = [];
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public modifiedRowsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public formsDataSubject: BehaviorSubject<NvForm[]> = new BehaviorSubject<NvForm[]>([]);
  public editingCellSubject: BehaviorSubject<NvCellCordinates> = new BehaviorSubject<NvCellCordinates>({
    rowIndex: -1,
    columnKey: null
  });
  public focusedCellSubject: BehaviorSubject<NvCellCordinates> = new BehaviorSubject<NvCellCordinates>({
    rowIndex: -1,
    columnKey: null
  });
  private dataRowSubject = new ReplaySubject<any[]>(1);
  public dataRow$ = this.dataRowSubject.asObservable();
  private selectRowStartingOfIndex: number;
  private selectRowEndingAtIndex: number;
  private subscribtionsFormsData = [];
  private componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public stillClickedInsideBodySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public footerChangesDetected: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public selectedRowsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    public gridDataService: GridDataService,
    private originalRowsService: OriginalRowsService,
    public configurationService: ConfigurationService,
    public gridUtilsService: GridUtilsService,
    private nzContextMenuService: NzContextMenuService,
    private dataSourceService: DataSourceService,
    public changeDetectorRef: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    public nvGridI18nService: NvGridI18nService,
    private excelService: ExcelService
  ) {
  }

  private getSelectedRows(): NvRowSelection[] {
    return this.rows.filter((row: any) => this.isRowSelected(row));
  }

  public get expandedRows(): any[] {
    return this.rows.filter((row: any) => this.isRowExpanded(row));
  }

  public get rawRows() {
    const clonedRows = Object.assign([], this.rows);
    return clonedRows;
  }

  public createNewForm(id: number | string) {
    if (id && !this.checkIfFormExistsByRowId(id)) {
      const childForm = this.formBuilder.group({});
      const columns = this.gridConfig.columns;
      const foundRow = this.findRowById(id);

      columns.forEach((column: NvColumnConfig) => {
        const newControl = new FormControl(
          foundRow[column.key],
          column.editControl.validation ? column.editControl.validation.validators : null,
          column.editControl.validation ? column.editControl.validation.asyncValidators : null
        );
        if (column.editControl.disabled) {
          newControl.disable();
        }
        childForm.addControl(column.key, newControl);

        this.subscribtionsFormsData.push(
          {
            id: id,
            subscribtion: childForm.get(column.key).valueChanges.pipe(
              takeUntil(this.componentDestroyed$)
            ).subscribe(value => {
              if (value && column.dataType === NvColumnDataType.Number) {
                value = Number(value);
              }
              if (column.key !== this.Constants.UNIQUE_ROW_KEY) {
                foundRow[column.key] = value;
                const foundForm = this.formsDataSubject.value.find(nvForm => nvForm.id === id);
                foundForm.changed.next(true);

                if (column.footer) {
                  this.footerChangesDetected.next(value);
                }
              }
            }),
          });

        this.subscribtionsFormsData.push(
          {
            id: id,
            subscribtion: childForm.get(column.key).valueChanges.pipe(
              takeUntil(this.componentDestroyed$)
            ).subscribe(() => {
              if (column.editControl.onValueChange) {
                column.editControl.onValueChange(childForm);
              }
            }),
          });
      });

      if (this.gridConfig.editForm.validators && this.gridConfig.editForm.validators.length > 0) {
        childForm.setValidators(this.gridConfig.editForm.validators);
      }
      if (this.gridConfig.editForm.asyncValidators && this.gridConfig.editForm.asyncValidators.length > 0) {
        childForm.setAsyncValidators(this.gridConfig.editForm.asyncValidators);
      }

      if (this.gridConfig.editForm.onFormValuesChange) {
        this.subscribtionsFormsData.push(
          {
            id: id,
            subscribtion: childForm.valueChanges.pipe(
              takeUntil(this.componentDestroyed$)
            ).subscribe(() => this.gridConfig.editForm.onFormValuesChange(childForm)),
          });
      }
      let forms = this.formsDataSubject.value;
      forms = [
        ...forms,
        {
          id: id, form: childForm,
          changed: new BehaviorSubject<boolean>(true)
        }
      ];

      this.formsDataSubject.next(forms);
    }
  }

  private displayRows() {
    if (!this.gridConfig) {
      this.createDefaultConfig();
    } else {
      this.changePage(1);
    }

    this.formsDataSubject.next([]);
    this.applyFiltering();
    this.applySorting();
    this.refreshGrid();
    this.originalRowsService.originalRows.next(JSON.parse(JSON.stringify(this.dataSource)));
    this.createNewRowOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gridConfig) {
      this.handleNormalizationAndConfiguration();
    }
    if (changes.dataSource) {
      this.displayRows();
    } else if (changes.dataSource$) {
      this.isLoading.next(true);
      this.dataSource$.pipe(
        takeUntil(this.componentDestroyed$)
      ).subscribe((dataSource: any[]) => {
        this.isLoading.next(false);
        this.dataSource = dataSource;
        this.displayRows();
      });
    }
  }


  private createNewRowOnInit() {
    if (
      this.gridConfig &&
      this.gridConfig.editForm.allowCreateNewRow &&
      !this.gridConfig.editForm.disableEditColumns &&
      this.rows.length === 0
    ) {
      this.createNewRow();
    }
  }

  public unsubscribeToFormValues(rowId: number | string) {
    this.rows = this.rows.filter(row => row.id !== rowId);
    this.totalItems = this.rows.length;
    this.subscribtionsFormsData
      .filter(subscribtionData => subscribtionData.id === rowId)
      .forEach(subscribtionData => subscribtionData.subscribtion.unsubscribe());

    this.subscribtionsFormsData = this.subscribtionsFormsData
      .filter((subscribtionData: { id: any, subscribtion: Subscription }) => {
        return !subscribtionData.subscribtion.closed;
      });
    this.deleteFormByRowId(rowId);
  }

  ngOnInit() {
    if (this.gridConfig && this.gridConfig.url) {
      this.subscribeConnector();
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  public filterGrid() {
    this.changePage(1);
    if (this.gridConfig.url) {
      this.configChanged();
    } else if (this.dataSource) {
      this.applyFiltering();
      this.filtered.emit();
    }
  }

  public changePage(pageNumber: number) {
    if (this.gridConfig && this.gridConfig.paging) {
      this.gridConfig.paging = {
        ...this.gridConfig.paging,
        pageNumber: pageNumber
      };

      if (this.gridConfig.url) {
        this.configChanged();
      }
    }
  }

  public changePageSize(pageSize: PagingSize) {
    if (this.gridConfig && this.gridConfig.paging) {
      this.gridConfig.paging = {
        ...this.gridConfig.paging,
        pageSize: pageSize
      };

      this.changePage(1);
      if (this.gridConfig.url) {
        this.configChanged();
      }
    }
  }

  public applyFiltering() {
    if (!this.gridConfig.hideAllFilters) {
      this.rows = this.dataSourceService.getFilteredDataSource(
        this.gridConfig.columns,
        this.dataSource,
        this.nvGridI18nService.getConfiguration
      );
    } else {
      this.rows = this.dataSource;
    }
    this.totalItems = this.rows.length;
  }

  public applySorting() {
    if (this.gridConfig.sortBy) {
      this.rows = [
        ...this.dataSourceService.applySortingToDataSource(
          this.gridConfig.sortBy,
          this.gridConfig.isSortAscending,
          this.rows
        )
      ];
    }
  }

  public refreshGrid() {
    if (this.gridConfig && this.gridConfig.url) {
      if (!this.dataRowSubscription) {
        this.subscribeConnector();
        delete this.dataSource;
      } else {
        this.changePage(1);
        this.configChanged();
      }
    } else if (this.dataSource) {
      this.dataRowSubject.next(this.rows);

      this.selectedRowsSubject.next(this.getSelectedRows());
      this.onRowSelectionChanged();
    }

    this.focusedCellSubject.next({ rowIndex: -1, columnKey: null });
    this.editingCellSubject.next({ rowIndex: -1, columnKey: null });
  }


  public handleCustomCellClickFn(row: any, column: NvColumnConfig): void {
    column.customCellClickFn(row);
  }

  public checkLocalStorageForChanges() {
    if (this.gridConfig.editForm.enableLocalStorageService) {
      const rows = this.localStorageService.getLocal(this.gridConfig.gridName + '.unsaved.changes');
      if (rows) {
        this.modifiedRowsSubject.next(rows);
      }
    }
  }

  public setModifiedRows() {
    this.modifiedRowsSubject.value.forEach((row: any) => {
      const toRefreshRow = this.findRowById(row.id);
      if (toRefreshRow) {
        Object.keys(toRefreshRow).forEach(key => {
          const column = this.gridConfig.columns.find(configColumn => configColumn.key === key);
          if (column && !column.customFormatFn) {
            if (toRefreshRow[key]) {
              toRefreshRow[key] = row[key];
            }
          }
        });
        this.createNewForm(row.id);
        toRefreshRow['_edited'] = true;
      } else if (toRefreshRow['_new']) {
        this.createNewRow(row);
      }
    });
  }

  public findRowById(id: number | string): any {
    return this.rows.find(row => row.id === id);
  }

  public findRowInDataSourceById(id: number | string): any {
    return this.dataSource.find(row => row.id === id);
  }

  public findRowIndexById(id: number | string): any {
    return this.rows.findIndex(row => row.id === id);
  }

  public sortBy(column: NvColumnConfig) {
    if (column.isSortable) {
      this.gridConfig.sortBy = column.key;
      this.gridConfig.isSortAscending = this.gridConfig.isSortAscending !== true;
      if (
        this.gridConfig &&
        this.gridConfig.sortBy
      ) {
        this.changePage(1);
        if (this.gridConfig.url) {
          this.configChanged();
        } else if (
          this.dataSource &&
          this.dataSource.length > 0
        ) {
          this.applySorting();
        }
      }
    }
  }

  public isAnyRowSelected(): boolean {
    return this.rows.findIndex(row => this.isRowSelected(row)) >= 0;
  }

  public isRowSelected(row: any): boolean {
    return !!row['_checked'];
  }

  public isRowExpanded(row: any): boolean {
    return !!row['_expanded'];
  }

  public toggleRowSelect(rowIndex: number, mouseEvent: MouseEvent) {
    if (this.gridConfig.rowSelectionType === NvGridRowSelectionType.Checkbox) {
      if (mouseEvent && mouseEvent.shiftKey) {
        this.selectRowEndingAtIndex = rowIndex;
        if (!this.selectRowStartingOfIndex) {
          this.selectRowStartingOfIndex = 0;
        }
        let StartAndEndValuesSwapped = false;
        if (this.selectRowStartingOfIndex > this.selectRowEndingAtIndex) {
          StartAndEndValuesSwapped = true;
          const temp = this.selectRowStartingOfIndex;
          this.selectRowStartingOfIndex = this.selectRowEndingAtIndex;
          this.selectRowEndingAtIndex = temp;
        }
        this.toggleSelectFromTill(this.selectRowStartingOfIndex, this.selectRowEndingAtIndex, true);
        if (this.rows[this.selectRowEndingAtIndex]['_checked'] && !StartAndEndValuesSwapped) {
          this.setRowSelection(this.selectRowEndingAtIndex, false);
        } else {
          this.setRowSelection(this.selectRowEndingAtIndex, true);
        }
        this.onRowSelectionChanged();
      } else {
        this.selectRowStartingOfIndex = rowIndex;
        const virtualRowIndex = (this.gridConfig.paging.pageNumber - 1) * this.gridConfig.paging.pageSize + rowIndex;
        this.setRowSelection(rowIndex, !this.isRowSelected(this.rows[virtualRowIndex]));
        this.onRowSelectionChanged();
      }
    } else if (this.gridConfig.rowSelectionType === NvGridRowSelectionType.RadioButton) {
      const oneSelectedRowIndex = this.rows.findIndex(row => row['_checked']);
      if (oneSelectedRowIndex > -1) {
        this.dataSource
          ? this.setRowSelection(null, false, oneSelectedRowIndex)
          : this.setRowSelection(oneSelectedRowIndex, false);

      }
      this.setRowSelection(rowIndex, true);
      this.onRowSelectionChanged();
    }
  }

  public toggleSelectAll(value: boolean): void {
    this.rows.forEach((r, rowIndex) => {
      this.setRowSelection(null, value, rowIndex);
    });
    this.onRowSelectionChanged();
  }

  public toggleSelectFromTill(from: number, till: number, value: boolean): void {
    for (let rowIndex = from; rowIndex < till; rowIndex++) {
      this.setRowSelection(rowIndex, value);
    }
  }

  public onRowSelectionChanged() {
    this.rowSelectionChanged.emit(this.selectedRowsSubject.value);
  }

  public toggleRowExpansion(rowIndex: number) {
    const row = this.rows[rowIndex];
    const isExpanded = this.isRowExpanded(row);
    this.showExpandedComponent(rowIndex, !isExpanded);
  }

  public collapseAllRows() {
    this.expandedRows.forEach((row: any) => this.setRowExpansion(row, false));
  }

  public setRowExpansion(row: any, value: boolean) {
    row['_expanded'] = value;
  }

  public updateRow(rowIndex: number, newRawRow: any): void {
    if (rowIndex < 0 || rowIndex >= this.rows.length) {
      return;
    }

    Object.assign(this.rows[rowIndex], newRawRow);
  }

  public collapseRow(rowIndex: number) {
    this.showExpandedComponent(rowIndex, false);
  }

  public expandRow(rowIndex: number) {
    this.showExpandedComponent(rowIndex, true);
  }

  public openContextMenu(
    row: any,
    rowIndex: number,
    mouseEvent: MouseEvent,
    buttons: NvButton[],
    template: NzDropdownMenuComponent,
    header?: boolean
  ) {
    if (header) {
      this.stillClickedInsideBodySubject.next(false);
    }

    if (!mouseEvent.shiftKey) {
      mouseEvent.preventDefault();
      this.activeRow = row;
      this.activeRowIndex = rowIndex;

      this.contextMenuButtons = header
        ? buttons
        : [
          ...this.gridConfig.contextMenuButtons || [],
          ...buttons
        ];
      if (this.contextMenuButtons.length > 0) {
        this.nzContextMenuService.create(mouseEvent, template);
      }
    }
  }

  public closeContextMenu(): void {
    return this.nzContextMenuService.close();
  }

  public contextMenuButtonClicked(contextmenuRow: any, button: NvButton, rowIndex: number) {
    this.closeContextMenu();
    this.gridUtilsService.runExternalButtonFunction(contextmenuRow, button, rowIndex);
  }

  public savedGridConfigChanges() {
    this.gridConfigChangedOnSave.emit(this.configurationService.getSavedLocalStorageConfig(this.gridConfig.gridName));
  }

  public resetedGridConfigChanges() {
    this.gridConfigChangedOnReset.emit();
  }

  public savedRowsChanges(forms?: NvForm[]) {
    const validformsData: NvForm[] = [];
    let modifiedRows: any[] = this.modifiedRowsSubject.value;
    const formsToSave = forms ? forms : this.formsDataSubject.value;
    formsToSave.forEach((formData) => {
      if (formData.form.valid) {
        validformsData.push(formData);
        this.unsubscribeToFormValues(formData.id);
        this.deleteFormByRowId(formData.id);
        modifiedRows = modifiedRows.filter(row => row.id !== formData.id);
      }
    });

    this.modifiedRowsOnSave.emit(validformsData);
    this.modifiedRowsSubject.next(modifiedRows);
  }

  public handleClickFn(rowIndex: number, row: any, mouseEvent: MouseEvent, column: NvColumnConfig): void {
    this.rowClicked.emit({
      rowIndex: rowIndex,
      row: row,
      mouseEvent: mouseEvent,
      column: column
    });
  }

  public handleDoubleClickFn(rowIndex: number, row: any, mouseEvent: MouseEvent, column: NvColumnConfig) {
    if (this.gridConfig.expandableComponentConfig && this.gridConfig.expandableComponentConfig.actOnDoubleClick) {
      this.toggleRowExpansion(rowIndex);
    } else {
      this.rowDoubleClicked.emit({
        rowIndex: rowIndex,
        row: row,
        mouseEvent: mouseEvent,
        column: column
      });
      this.gridUtilsService.handleRowDoubleClick(this.gridConfig, row, rowIndex);
    }
  }

  public handleEnterKeyDownkFn() {
    let rowIndex: number;
    if (this.focusedCellSubject.value && this.focusedCellSubject.value.rowIndex > -1) {
      rowIndex = this.focusedCellSubject.value.rowIndex;
    } else if (
      this.gridConfig.rowSelectionType === NvGridRowSelectionType.RadioButton
      && this.selectedRowsSubject.value.length === 1
    ) {
      rowIndex = this.selectedRowsSubject.value[0].rowIndex;
    }

    if (rowIndex > -1) {
      const virtualRowIndex = (this.gridConfig.paging.pageNumber - 1)
        * this.gridConfig.paging.pageSize
        + rowIndex;

      this.gridUtilsService.handleRowEnterKeyDown(
        this.gridConfig,
        this.rows[virtualRowIndex],
        virtualRowIndex
      );
    }
  }

  public createNewRowAndFocusFirstCell(row?: any) {
    this.createNewRow(row);

    this.focusFirstCellOfNewCreatedRow();
  }

  public focusFirstCellOfFirstRow() {
    const rowIndex = 0;
    this.focusCellOfAnyRow(rowIndex);
  }

  public focusFirstCellOfNewCreatedRow() {
    const rowIndex = this.rows.length - 1;
    this.focusCellOfAnyRow(rowIndex);
  }


  public focusCellOfAnyRow(rowIndex: number, columnKey?: string) {
    this.jumpToPage(rowIndex);
    const rowId = this.rows[rowIndex].id;
    const formData = this.getFormDataByRowId(rowId);
    const columns = this.configurationService.visibleColumns.value;
    const foundColumn = columns.find((column: NvColumnConfig) =>
      columnKey
        ? column.key === columnKey
        : true
        && column.editControl.editable !== false
        && formData.form.get(column.key).enabled
    );

    const rowIndexReal = rowIndex - (this.gridConfig.paging.pageNumber - 1) * this.gridConfig.paging.pageSize;
    this.toggleRowSelect(rowIndexReal, null);
    this.focusedCellSubject.next({ rowIndex: rowIndexReal, columnKey: foundColumn.key });
    this.editingCellSubject.next({ rowIndex: rowIndexReal, columnKey: foundColumn.key });
    this.stillClickedInsideBodySubject.next(true);
  }

  public createNewRow(row?: any) {
    const newRow: any = row ? row : {};
    if (!row) {
      this.gridConfig.columns.forEach(column => {
        newRow[column.key] = null;
        if (column.editControl.defaultValue) {
          newRow[column.key] = column.editControl.defaultValue;
        }
      });

      newRow['id'] = 'nv-' + (Math.floor(Math.random() * 1000000) + 1000);
    }
    this.rows = [...this.rows, newRow];
    this.totalItems = this.rows.length;

    newRow['_edited'] = true;
    newRow['_new'] = true;
    this.createNewForm(newRow['id']);
  }

  public deleteFormByRowId(rowId: number | string): void {
    this.formsDataSubject.next(this.formsDataSubject.value.filter(formData => formData.id !== rowId));
  }

  public checkIfFormExistsByRowId(rowId: number | string): boolean {
    return this.formsDataSubject.value.filter((formData) => formData.id === rowId).length > 0;
  }

  public getFormDataByRowId(rowId: number | string): NvForm {
    const foundFormData = this.formsDataSubject.value.find((formData: NvForm) => formData.id === rowId);
    if (foundFormData) {
      return foundFormData;
    }
    return null;
  }

  private subscribeToModifiedRows() {
    if (this.gridConfig.editForm.enableLocalStorageService) {
      this.modifiedRowsSubject
        .pipe(
          takeUntil(this.componentDestroyed$)
        ).subscribe((rows) => this.localStorageService
          .setLocal(this.gridConfig.gridName + '.unsaved.changes', rows));
    }
  }

  private createDefaultConfig() {
    const columns: NvColumnConfig[] = this.initColumns(Object.keys(this.dataSource[0]));
    this.gridConfig = this.initConfig(columns);
    this.handleNormalizationAndConfiguration();
  }

  private handleNormalizationAndConfiguration(): void {
    this.gridUtilsService.normalizeOptionalValues(this.gridConfig);
    this.configurationService.checkForUniqueness(this.gridConfig);
    this.mergeLocalStorageConfigInGridConfig();
    this.checkLocalStorageForChanges();
    this.subscribeToModifiedRows();
    this.configurationService.visibleColumns.next(
      this.configurationService.getVisibleAndNotHiddenColumns(this.gridConfig.columns)
    );
  }

  private initConfig(columns: NvColumnConfig[]): NvGridConfig {
    return ({
      gridName: 'grid',
      columns: columns,
      hideAllFilters: true
    });
  }

  private initColumns(columns: any): NvColumnConfig[] {
    const newcolumns: NvColumnConfig[] = [];
    columns.forEach(column => {
      const newColumn = {
        key: column,
        title: column,
        filter: {
          values: [],
        }
      };
      newcolumns.push(newColumn);
    });
    return newcolumns;
  }

  private setRowSelection(rowIndex: number, value: boolean, dataSourceRowIndex?: number) {
    if (dataSourceRowIndex !== undefined && dataSourceRowIndex > -1) {
      this.rows[dataSourceRowIndex]['_checked'] = value;
    } else if (this.dataSource) {
      const virtualRowIndex = (this.gridConfig.paging.pageNumber - 1) * this.gridConfig.paging.pageSize + rowIndex;
      this.rows[virtualRowIndex]['_checked'] = value;
    } else {
      this.rows[rowIndex]['_checked'] = value;
    }
    this.selectedRowsSubject.next(this.getSelectedRows());
  }

  private getFirstInvalidCellCoordinates(): NvCellCordinates {
    const firstInvalidForm: NvForm = this.formsDataSubject
      .value
      .find(formData => formData.form.invalid);

    const firstInvalidColumn = this.gridConfig
      .columns
      .find(column => firstInvalidForm.form.get(column.key).invalid);

    const firstRowIndex = this.rows.findIndex(row => row.id === firstInvalidForm.id);

    return ({
      rowIndex: firstRowIndex,
      columnKey: firstInvalidColumn.key,
    });
  }

  public jumpToFirstInvalidCell(): void {
    const invalidCell = this.getFirstInvalidCellCoordinates();
    this.focusCellOfAnyRow(invalidCell.rowIndex, invalidCell.columnKey);
  }

  private jumpToPage(rowIndex: number) {
    const newPageNumber = Math.ceil((rowIndex + 1) / this.gridConfig.paging.pageSize) || 1;
    if (this.gridConfig.paging.pageNumber !== newPageNumber) {
      this.changePage(newPageNumber);
    }
  }

  private mergeLocalStorageConfigInGridConfig() {
    if (!this.gridConfig.hideSettingsButton) {
      this.configurationService.mergeLocalStorageConfigInGridConfig(this.gridConfig);
    }
  }

  private configChanged() {
    this.rows = [];
    this.totalItems = 0;
    this.gridDataService.configChanged.next(this.gridConfig);
  }

  private showExpandedComponent(rowIndex: number, value: boolean) {
    if (rowIndex < 0 || rowIndex >= this.rows.length) {
      return;
    }
    if (
      this.gridConfig.expandableComponentConfig &&
      !this.gridConfig.expandableComponentConfig.multiExpand
    ) {
      this.collapseAllRows();
    }
    const row = this.rows[rowIndex];
    this.setRowExpansion(row, value);
    if (value) {
      this.expandComponent.emit({
        rowIndex: rowIndex,
        row: row
      });
    }
  }

  private subscribeConnector() {
    this.dataRowSubscription = this.gridDataService.rowData$.subscribe((result: GridQueryResult) => {
      this.rows = result.items;
      this.totalItems = result.totalItems;
      this.gridUtilsService.applyMultiSelectValues(this.gridConfig, result.multiSelectColumns);
    });
    this.configChanged();
  }

  downloadAsExcel() {
    this.excelService.exportAsExcelFile(
      this.rows,
      this.gridConfig.gridName,
      this.gridConfig.columns.filter(column => column.visible),
      this.nvGridI18nService.getConfiguration
    );
  }
}
