import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {
  NvButton,
  NvCellCordinates,
  NvColumnConfig,
  NvForm,
  NvGridButtonsPosition,
  NvGridConfig,
  NvGridConstants,
  NvGridRowSelectionType,
  NvRowSelection,
  NvScrollMode
} from '../../models/grid-config';
import { ConfigurationService } from '../../services/configuration.service';
import { GridUtilsService } from '../../services/grid-utils.service';
import { ColumnTemplateDirective } from '../../directives/column-template.directive';
import { ColumnEditTemplateDirective } from '../../directives/column-edit-template.directive';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ClickService } from '../../services/click.service';
import { OriginalRowsService } from '../../services/original-rows.service';
import { NvGridI18nInterface } from '../../services/nv-grid-i18n.service';

@Component({
  selector: 'nv-grid-body',
  templateUrl: './grid-body.component.html',
  styleUrls: ['./grid-body.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() gridConfig: NvGridConfig;
  @Input() isLoading: boolean;
  @Input() width: number;
  @Input() rows: any[];
  @Input() columnTemplates: QueryList<ColumnTemplateDirective>;
  @Input() columnEditTemplates: QueryList<ColumnEditTemplateDirective>;
  @Input() modifiedRowsSubject: BehaviorSubject<any[]>;
  @Input() editingCellRowIndex: number;
  @Input() editingCellColumnKey: string;
  @Input() focusedCellRowIndex: number;
  @Input() focusedCellColumnKey: string;
  @Input() forms: NvForm[];
  @Input() private stillClickedInsideBodySubject: BehaviorSubject<boolean>;
  @Input() rootConfigChanged: NvGridI18nInterface;
  @Input() columns: NvColumnConfig[];
  @Input() selectedRows: any[];

  @Output() selectedRow = new EventEmitter<{ rowIndex: number, mouseEvent: MouseEvent }>();
  @Output() expandedComponent = new EventEmitter<{ rowIndex: number }>();
  @Output() openedContextMenu = new EventEmitter<{ row: any, rowIndex: number, mouseEvent: MouseEvent, buttons: NvButton[] }>();
  @Output() handleCustom = new EventEmitter<{ row: any, column: NvColumnConfig }>();
  @Output() handleDoubleClick = new EventEmitter<NvRowSelection>();
  @Output() modifiedRowOnSave = new EventEmitter<any>();
  @Output() modifiedRowOnDiscard = new EventEmitter<any>();
  @Output() createNewRow = new EventEmitter<void>();
  @Output() createNewForm = new EventEmitter<{ rowId: number | string }>();
  @Output() handleEnterKeyDown = new EventEmitter();
  @Output() rowClicked = new EventEmitter<NvRowSelection>();
  @Output() jumpToFirstInvalidCell = new EventEmitter<void>();
  @Output() focusCell = new EventEmitter<NvCellCordinates>();
  @Output() editCell = new EventEmitter<NvCellCordinates>();
  @ViewChildren('rows', { read: ViewContainerRef }) rowsTemplates: QueryList<ViewContainerRef>;

  public NvGridButtonsPosition = NvGridButtonsPosition;
  public Constants = NvGridConstants;
  public columnTemplatesDictionary: any = {};
  public columnEditTemplatesDictionary: any = {};
  public topPosition = 0;
  public click = new Subject<NvRowSelection>();
  private arrowKeys = new Subject<KeyboardEvent>();
  private arrowKeysSubscribtion: Subscription;
  private clickedInsideOfBody = false;
  public formsObject: { [id: string]: { form: FormGroup, changed: BehaviorSubject<boolean> } } = {};
  public leftPositions: { [key: string]: number } = {};

  constructor(
    public configurationService: ConfigurationService,
    public gridUtilsService: GridUtilsService,
    private element: ElementRef,
    private clickService: ClickService,
    private originalRowsService: OriginalRowsService,
  ) {
  }

  @HostListener('document:keydown.control.ArrowDown', ['$event']) onCrtlArrowDownHandler(event: KeyboardEvent) {
    if (this.stillClickedInsideBodySubject.value) {
      event.preventDefault();
      if (
        !this.gridConfig.editForm.disableEditColumns
        && this.gridConfig.editForm.allowCreateNewRow
        && this.editingCellRowIndex
      ) {
        if (this.allFormsAreValid()) {
          this.createNewRow.emit();
        } else {
          this.jumpToFirstInvalidCell.emit();
        }
      }
    }
  }

  @HostListener('document:keydown.f2', ['$event']) onF2KeydownHandler(event: KeyboardEvent) {
    if (this.stillClickedInsideBodySubject.value) {
      event.preventDefault();
      if (!this.gridConfig.editForm.disableEditColumns) {
        if (this.focusedCellRowIndex > -1) {
          const columnKey = this.focusedCellColumnKey;
          const columnToEdit = this.gridConfig.columns.find(column => column.key === columnKey);

          if (
            columnToEdit &&
            columnToEdit.editControl.editable
          ) {
            this.updateEditingCellAndCreateForm(
              this.focusedCellRowIndex,
              this.focusedCellColumnKey
            );
          }
        }
      }
    }
  }

  @HostListener('document:keydown.Enter', ['$event']) enterKeyDownHandler(event: KeyboardEvent) {
    if (
      this.stillClickedInsideBodySubject.value
      && this.editingCellRowIndex === -1
    ) {
      event.preventDefault();
      this.handleEnterKeyDown.emit();
    }
  }

  @HostListener('document:click') clickout() {
    if (!this.clickedInsideOfBody) {
      this.stillClickedInsideBodySubject.next(false);
    }

    if (
      !this.clickedInsideOfBody
      && this.focusedCellRowIndex !== -1
    ) {
      this.focusCell.emit({ rowIndex: -1, columnKey: null });
    }

    this.clickedInsideOfBody = false;
  }

  @HostListener('document:keydown.ArrowUp', ['$event'])
  @HostListener('document:keydown.ArrowRight', ['$event'])
  @HostListener('document:keydown.ArrowDown', ['$event'])
  @HostListener('document:keydown.ArrowLeft', ['$event'])
  handleEvent(event: KeyboardEvent) {
    if (this.stillClickedInsideBodySubject.value) {
      if (this.editingCellRowIndex === -1) {
        event.preventDefault();
        this.arrowKeys.next(event);
      }
    }
  }

  ngOnInit() {

    this.topPosition = this.configurationService.getTopPosition(this.gridConfig.hideAllFilters);
    this.arrowKeysSubscribtion = this.arrowKeys
      .subscribe((event: KeyboardEvent) => this.handleArrowKeyboardEvent(event));

    this.clickService.clickSubscribtion(this.click)
      .subscribe((rowClicks: NvRowSelection[]) => {
        if (rowClicks.length === 1) {
          const lastRowData = rowClicks[0];
          this.handleClickEvent(
            lastRowData.mouseEvent,
            lastRowData.row,
            lastRowData.rowIndex,
            lastRowData.column
          );
        } else if (rowClicks.length === 2) {
          const lastRowData = rowClicks[1];
          this.handleDoubleClickEvent(
            lastRowData.mouseEvent,
            lastRowData.row,
            lastRowData.rowIndex,
            lastRowData.column
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.arrowKeysSubscribtion) {
      this.arrowKeysSubscribtion.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.forms) {
      const initialValue = {};
      this.formsObject = this.forms.reduce((object, nvForm) => {
        return {
          ...object,
          [nvForm.id]: nvForm
        };
      }, initialValue);
    }
    if (changes.columnTemplates && this.columnTemplates) {
      this.columnTemplates.forEach(template => {
        this.columnTemplatesDictionary[template.columnName] = template.templateRef;
      });
    }
    if (changes.columnEditTemplates && this.columnEditTemplates) {
      this.columnEditTemplates.forEach(template => {
        this.columnEditTemplatesDictionary[template.columnName] = template.templateRef;
      });
    }
  }

  public clickInside() {
    this.stillClickedInsideBodySubject.next(true);
    this.clickedInsideOfBody = true;
  }

  public markModifiedRows(newModifiedRow: any) {
    if (!newModifiedRow['_edited']) {
      newModifiedRow['_edited'] = true;
    }
    const modifiedRows = this.modifiedRowsSubject.value;
    const foundModifiedRowByRowIndex = modifiedRows.findIndex(modifiedRow => modifiedRow.id === newModifiedRow.id);

    if (foundModifiedRowByRowIndex > -1) {
      modifiedRows[foundModifiedRowByRowIndex] = newModifiedRow;
    } else {
      modifiedRows.push(newModifiedRow);
    }

    this.modifiedRowsSubject.next(modifiedRows);
  }

  public isRowSelected(row: any): boolean {
    return !!row['_checked'];
  }

  public handleDoubleClickEvent(mouseEvent: MouseEvent, row: any, rowIndex: number, column: NvColumnConfig) {
    this.handleDoubleClick.emit({
      rowIndex: rowIndex,
      row: row,
      mouseEvent: mouseEvent,
      column: column
    });
  }

  public handleClick(mouseEvent: MouseEvent, row: any, rowIndex: number, column: NvColumnConfig) {
    this.click.next(
      {
        mouseEvent: mouseEvent,
        row: row,
        rowIndex: rowIndex,
        column: column
      });
  }

  public handleClickEvent(mouseEvent: MouseEvent, row: any, rowIndex: number, column: NvColumnConfig): boolean {
    if (!this.gridConfig.editForm.disableEditColumns && column.editControl.editable) {
      this.updateEditingCellAndCreateForm(rowIndex, column.key);
    }
    this.updateFocusedCell(rowIndex, column.key);

    if (column.customCellClickFn !== undefined) {
      this.handleCustom.emit({
        row: row,
        column: column
      });

      return false;
    }

    if (this.gridConfig.rowSelectionType in NvGridRowSelectionType) {
      this.selectedRow.emit({
        rowIndex: rowIndex,
        mouseEvent: mouseEvent
      });
    }

    this.rowClicked.emit({
      rowIndex: rowIndex,
      row: row,
      column: column,
      mouseEvent: mouseEvent
    });
    return true;
  }

  public handleContextMenu(row: any, rowIndex: number, mouseEvent: MouseEvent): void {
    this.clickout();
    this.openedContextMenu.emit({
      row: row,
      rowIndex: rowIndex,
      mouseEvent: mouseEvent,
      buttons: this.gridUtilsService.getVisibleButtons(row, this.gridConfig.buttons)
    });
  }

  public switchToViewMode() {
    this.updateEditingCell(-1, null);
  }

  public jumpToNextCell(currentRow: any, currentColumnKey: string, currentRowIndex: number, form: FormGroup, backwards: boolean) {
    const orderedVisibleAndNotHiddenColumns = this.configurationService.visibleColumns.value;
    const reversedVisibleAndNotHiddenColumns = orderedVisibleAndNotHiddenColumns.slice().reverse();

    const visibleAndNotHiddenColumns = backwards ? reversedVisibleAndNotHiddenColumns : orderedVisibleAndNotHiddenColumns;
    const currentColumnIndex = visibleAndNotHiddenColumns.findIndex(column => column.key === currentColumnKey);

    let nextEditableColumn = visibleAndNotHiddenColumns
      .find((column: NvColumnConfig, index: number) =>
        index > currentColumnIndex &&
        column.editControl.editable !== false &&
        form.get(column.key).enabled);


    if (!nextEditableColumn) {
      backwards ? currentRowIndex -= 1 : currentRowIndex += 1;
      currentRow = this.rows[currentRowIndex];
      if (currentRow) {
        const currentRowForm = this.formsObject[currentRow.id];
        nextEditableColumn = visibleAndNotHiddenColumns
          .find((column: NvColumnConfig) =>
            column.editControl.editable !== false && (
              currentRowForm && currentRowForm.form.get(column.key).enabled
              || !column.editControl.disabled
            ));
      } else if (
        !backwards &&
        this.gridConfig.editForm.allowCreateNewRow &&
        !this.gridConfig.editForm.disableEditColumns
      ) {
        if (this.allFormsAreValid() || this.gridConfig.editForm.allowJumpToNextRowIfInvalid) {
          this.createNewRow.emit();
        } else {
          this.jumpToFirstInvalidCell.emit();
        }
      }
    }
    if (currentRow) {
      const newColumnKey = nextEditableColumn.key;
      const newRowIndex = currentRowIndex;

      this.updateFocusedCell(newRowIndex, newColumnKey);
      this.updateEditingCellAndCreateForm(newRowIndex, newColumnKey);
      this.updateSelectedRow(newRowIndex);
    }
  }

  public updateFocusedCell(rowIndex: number, columnKey: string) {
    this.focusCell.emit({ rowIndex: rowIndex, columnKey: columnKey });
  }

  public isRowEdited(row: any): any {
    return !!row['_edited'];
  }

  public isRowNew(row: any): any {
    return !!row['_new'];
  }

  public restore(rowIndex: number, row: any) {
    if (this.isRowNew(row)) {
      this.modifiedRowOnDiscard.emit({ rowId: row.id });
    } else {
      const form = this.formsObject[row.id].form;
      const foundOriginalRow = this.originalRowsService.originalRows.value
        .find((originalRow: any) => originalRow.id === row.id);
      if (foundOriginalRow) {
        this.gridConfig.columns.forEach(column => {
          form.get(column.key).setValue(foundOriginalRow[column.key]);
        });
      }
      row['_edited'] = false;
      form.markAsPristine();
    }
    if (this.gridConfig.editForm && this.gridConfig.editForm.enableLocalStorageService) {
      this.modifiedRowsSubject
        .next(
          this.modifiedRowsSubject
            .value
            .filter(modifiedRow => modifiedRow.id !== row.id)
        );
    }
  }

  public save(row: any) {
    this.modifiedRowOnSave.emit([this.formsObject[row.id]]);
  }

  private handleArrowKeyboardEvent(event: KeyboardEvent) {
    if (
      this.focusedCellRowIndex > -1
    ) {
      const currenctRowIndex = this.focusedCellRowIndex;
      const currentKey = this.focusedCellColumnKey;
      if (event.key === 'ArrowLeft') {
        const neighborColumn = this.getNeighborColumn(currentKey, false);

        if (neighborColumn) {
          this.updateFocusedCell(currenctRowIndex, neighborColumn.key);
        }
      }
      if (event.key === 'ArrowRight') {
        const neighborColumn = this.getNeighborColumn(currentKey, true);
        if (neighborColumn) {
          this.updateFocusedCell(currenctRowIndex, neighborColumn.key);
        }
      }
      if (event.key === 'ArrowUp') {
        if (currenctRowIndex - 1 > -1) {
          this.updateFocusedCell(currenctRowIndex - 1, currentKey);
          this.scrollToRowElement(currenctRowIndex - 1, true);

        }
      }
      if (event.key === 'ArrowDown') {
        if (currenctRowIndex + 1 < this.rows.length) {
          this.updateFocusedCell(currenctRowIndex + 1, currentKey);
          this.scrollToRowElement(currenctRowIndex + 1, false);

        }
      }
    }

    if (this.gridConfig.rowSelectionType === NvGridRowSelectionType.RadioButton) {
      const lastSelectIndex = this.rows.findIndex(row => this.isRowSelected(row));
      if (event.key === 'ArrowDown') {
        if (lastSelectIndex + 1 < this.rows.length) {
          this.selectedRow.emit({
            rowIndex: lastSelectIndex + 1,
            mouseEvent: null
          });
          this.scrollToRowElement(lastSelectIndex + 1, false);
        }
      }
      if (event.key === 'ArrowUp') {
        if (lastSelectIndex - 1 > -1) {
          this.selectedRow.emit({
            rowIndex: lastSelectIndex - 1,
            mouseEvent: null
          });
          this.scrollToRowElement(lastSelectIndex - 1, true);
        }
      }
    }
  }

  private scrollToRowElement(rowIndex: number, directionUp: boolean) {

    const foundRow = this.rowsTemplates
      .find(row => row.element.nativeElement.nextElementSibling.getAttribute('id') === rowIndex.toString());

    if (foundRow != null) {
      const nvGridElement = this.element.nativeElement.parentNode;
      const nvGridElementTop = nvGridElement.getBoundingClientRect().top;
      const nvGridOffsetTop = nvGridElementTop + this.topPosition;
      const rowElementTopWidthOffset = foundRow.element.nativeElement.nextElementSibling.getBoundingClientRect().top;
      const rowElementTop = rowElementTopWidthOffset - nvGridOffsetTop;
      let rowBottom = rowElementTopWidthOffset - nvGridElementTop + this.gridConfig.rowHeight;
      if (this.gridConfig.showFooter) {
        rowBottom += this.Constants.FOOTER_HEIGHT;
      }

      const tableHeight = nvGridElement.clientHeight;
      const currentScroll = nvGridElement.scrollTop;
      if (rowElementTop < 0) {
        nvGridElement.scrollTop = (currentScroll + rowElementTop);
        if (this.gridConfig.pinFirstRow) {
          nvGridElement.scrollTop -= this.gridConfig.rowHeight;
        }
      } else if (rowBottom > tableHeight) {
        const scrollAmount = rowBottom - tableHeight;
        nvGridElement.scrollTop = (currentScroll + scrollAmount);
      } else if (this.gridConfig.scrollMode === NvScrollMode.central) {
        if (directionUp) {
          nvGridElement.scrollTop -= this.gridConfig.rowHeight;
        } else {
          nvGridElement.scrollTop += this.gridConfig.rowHeight;
        }
        if (rowElementTop === this.gridConfig.rowHeight) {
          nvGridElement.scrollTop -= this.gridConfig.rowHeight;
        }
      }
      if (this.gridConfig.pinFirstRow && this.gridConfig.scrollMode !== NvScrollMode.central) {
        if (rowElementTop > -1 && rowElementTop < this.gridConfig.rowHeight) {
          nvGridElement.scrollTop -= this.gridConfig.rowHeight;
        }
      }
    }
  }

  private getNeighborColumn(key: string, forward: boolean): NvColumnConfig {
    const columns = this.configurationService.visibleColumns.value;
    const currentColumnIndex = columns.findIndex((column) => column.key === key);
    return columns.find((_, index) => forward ? index > currentColumnIndex : index === currentColumnIndex - 1);
  }

  private updateSelectedRow(rowIndex: number) {
    if (this.gridConfig.rowSelectionType === NvGridRowSelectionType.RadioButton) {
      this.selectedRow.emit({
        rowIndex: rowIndex,
        mouseEvent: null
      });
    }
  }

  public selectRowFromLeftAction(rowIndex: number, mouseEvent: MouseEvent) {
    this.clickout();
    this.selectedRow.emit({
      rowIndex: rowIndex, mouseEvent: mouseEvent
    });
  }

  private updateEditingCell(rowIndex: any, key: string) {
    this.editCell.emit({ rowIndex: rowIndex, columnKey: key });
  }

  private updateEditingCellAndCreateForm(rowIndex: number, key: string) {
    const rowId = this.rows[rowIndex].id;
    let form = this.formsObject[rowId] && this.formsObject[rowId].form;
    if (!form) {
      this.createNewForm.emit({ rowId: rowId });
      setTimeout(() => {
        form = this.formsObject[rowId] && this.formsObject[rowId].form;
        this.updateEditingCellAndCreateForm(rowIndex, key);
      }, 0);
    } else if (
      form.get(key).enabled &&
      (this.editingCellRowIndex !== rowIndex ||
        this.editingCellColumnKey !== key)
    ) {
      this.updateEditingCell(rowIndex, key);
    }
  }

  private allFormsAreValid(): boolean {
    return this.forms
      .every(formData => formData.form.valid) ? true : false;
  }
}
