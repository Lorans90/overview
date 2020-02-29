import { TemplateRef, Type } from '@angular/core';
import { NvAction } from 'nv-button/src/public_api';
import { AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export interface NvGridConfig {
  url?: NvUrlConfig;
  gridName: string;
  title?: object | string;
  paging?: NvPagination;
  sortBy?: string;
  isSortAscending?: boolean;
  rowSelectionType?: NvGridRowSelectionType;
  columns: NvColumnConfig[];
  buttons?: NvButton[];
  pin?: NvGridPin;
  rowHeight?: NvRowHeight;
  tooltipDisabled?: boolean;
  hideAllFilters?: boolean;
  showFooter?: boolean;
  showPaging?: boolean;
  excelExportUrl?: string;
  pdfExportUrl?: string;
  toolbarButtons?: NvToolbarButton[];
  rowButtonsPosition?: NvGridButtonsPosition;
  expandableComponentConfig?: DynamicComponentConfig;
  showRowIndex?: boolean;
  customDataSourceRefreshFunction?: NvAction;
  hideSettingsButton?: boolean;
  disableDragAndDrop?: boolean;
  disableHideColumns?: boolean;
  disableSortColumns?: boolean;
  hideToolbar?: boolean;
  pinFirstRow?: boolean;
  editForm?: NvEditForm;
  hideRefreshButton?: boolean;
  showExcelButton?: boolean;
  styles?: NvStyles;
  contextMenuButtons?: NvButton[];
  scrollMode?: NvScrollMode;
}

export enum NvScrollMode {
  default,
  central
}

export interface NvStyles {
  toolbarBackgroundColor: string;
  paginationBackgroundColor: string;
}

export interface NvUrlConfig {
  method: 'POST' | 'GET';
  endPoint: string;
  response?: string;
}

export interface NvColumnConfig {
  key: string;
  title?: object | string;
  tooltip?: object | string;
  customTooltip?: (row: any) => any;
  dataType?: NvColumnDataType;
  decimalDigitsInfo?: string;
  width?: number;
  isSortable?: boolean;
  editControl?: {
    editable?: boolean;
    disabled?: boolean;
    validation?: NvValidation;
    defaultValue?: any;
    errorPopoverContentTemplate?: (form: FormGroup) => TemplateRef<any>
    onValueChange?: (form: FormGroup) => any;
  };
  resizeable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  filter?: NvFilterType;
  hidden?: boolean;
  visible?: boolean;
  footer?: NvFooter;
  customCellClickFn?: (row: any) => any;
  customFormatFn?: (row: any) => any;
}

export interface NvValidation {
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
}

export enum NvOperation {
  Sum = 0
}

export interface NvForm {
  id: number | string;
  form: FormGroup;
  changed: BehaviorSubject<boolean>;
}

export interface NvEditForm {
  createFirstFormIfRowExist?: boolean;
  disableFirstCell?: boolean;
  disableEditColumns?: boolean;
  enableLocalStorageService?: boolean;
  allowCreateNewRow?: boolean;
  preventDiscardingFirstRow?: boolean;
  showCreateNewRowButton?: boolean;
  showDiscardChangesButton?: boolean;
  showSaveChangesButton?: boolean;
  markBackgroundAsEdited?: boolean;
  allowJumpToNextCellIfInvalid?: boolean;
  allowJumpToNextRowIfInvalid?: boolean;
  onFormValuesChange?: (form: FormGroup) => any;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
}


export interface NvLocalStorageConfig extends NvGridConfig {
  version: string;
}

export interface NvPagination {
  pageNumber: number;
  pageSize: PagingSize;
  showTotalItems?: boolean;
  showQuickJumper?: boolean;
}

export interface NvFilterType {
  keys?: string[];
  values?: any[];
  controlType?: NvFilterControl;
  selectValues?: string[];
  multiSelect?: boolean;
  form?: FormGroup;
}

export type PagingSize = 3 | 10 | 25 | 50 | 100;

export interface NvButton {
  name?: object | string;
  icon: string;
  tooltip?: object | string;
  description: object | string;
  func: (row: any, rowIndex: number) => any;
  hidden?: boolean | ((row: any) => boolean);
  disabled?: boolean | ((row: any) => boolean);
  actOnDoubleClick?: boolean;
  actOnEnter?: boolean;
}

export interface NvFooter {
  label?: object | string;
  operation?: NvOperation | ((rows: any[]) => any);
  disableCustomFormat?: boolean;
}

export interface NvExpandedRowEvent {
  rowIndex: number;
  row: any;
}

export interface NvToolbarButton {
  title?: object | string;
  tooltip?: object | string;
  icon: string;
  func?: NvAction | ((row: any) => any);
  disabled?: () => boolean;
  hidden?: () => boolean;
  class?: string;
}

export interface NvRowSelection {
  rowIndex: number;
  row: any;
  mouseEvent?: MouseEvent;
  column?: NvColumnConfig;
}

export enum NvRowHeight {
  smallSize = 22,
  midSize = 33,
  largeSize = 44
}

export enum NvColumnDataType {
  Number = 0,
  Boolean,
  Date,
  String,
  Decimal,
  Currency,
  DateTime
}

export enum NvFilterControl {
  Boolean,
  Select,
  Date,
  FreeText,
  RangeNumber,
}

export type GridLocale = 'de-DE' | 'en-US' | 'en-GB' | string;
export type GridLanguage = 'de' | 'en' | string;

// @dynamic
export class NvGridConstants {

  static readonly CHECKBOX_COLUMN_WIDTH = 32;
  static readonly EXPAND_BUTTON_COLUMN_WIDTH = 26;
  static readonly RADIO_BUTTON_COLUMN_WIDTH = 26;
  static readonly NAVBAR_WIDTH = 60;
  static readonly MENU_BUTTON_COLUMN_WIDTH = 25;
  static readonly ROW_INDEX_COLUMN_WIDTH = 30;
  static readonly GRID_LOCAL_STORAGE_PREFIX_NAME = 'nv.grid.';
  static readonly currenctLocalStorageVersion = '1.2.1';
  // tslint:disable:max-line-length
  static readonly ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
  // tslint:enable:max-line-length
  static readonly DEFAULT_ROW_HEIGHT = NvRowHeight.midSize;
  static readonly TOOLBAR_HEIGHT = 46;
  static readonly HEADER_HEIGHT = 40;
  static readonly FILTER_HEIGHT = 24;
  static readonly FOOTER_HEIGHT = 22;
  static readonly PAGINATION_HEIGHT = 36;
  static readonly UNIQUE_ROW_KEY = 'id';

  static readonly DATE_FMT_DE = 'dd.MM.y';
  static readonly DATE_FMT_US = 'MM/dd/y';
  static readonly DATE_FMT_GB = 'dd/MM/y';

  static readonly DATE_TIME_FMT_DE = `${NvGridConstants.DATE_FMT_DE} HH:mm`;
  static readonly DATE_TIME_FMT_US = `${NvGridConstants.DATE_FMT_US} h:mm a`;
  static readonly DATE_TIME_FMT_GB = `${NvGridConstants.DATE_FMT_GB} h:mm a`;

  static getGridDateFormat(locale: string): string {
    return locale === 'en-GB'
      ? NvGridConstants.DATE_FMT_GB
      : (locale === 'en-US'
        ? NvGridConstants.DATE_FMT_US
        : NvGridConstants.DATE_FMT_DE);
  }

  static getGridDateTimeFormat(locale: string): string {
    return locale === 'en-GB'
      ? NvGridConstants.DATE_TIME_FMT_GB
      : (locale === 'en-US'
        ? NvGridConstants.DATE_TIME_FMT_US
        : NvGridConstants.DATE_TIME_FMT_DE);
  }


}

export enum NvGridButtonsPosition {
  ExpandedRight,
  CollapsedLeft
}

export enum NvGridRowSelectionType {
  RadioButton,
  Checkbox
}

export interface DynamicComponentConfig {
  multiExpand?: boolean;
  actOnDoubleClick?: boolean;
  inputs?: object;
  outputs?: object;
  componentToPort: Type<any>;
}

export interface NvGridPin {
  pinActive?: boolean;
  pinTill?: number;
}

export interface NvCellCordinates {
  rowIndex: number;
  columnKey: string;
}
