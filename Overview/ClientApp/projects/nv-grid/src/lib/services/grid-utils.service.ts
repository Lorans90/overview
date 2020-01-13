import { Injectable } from '@angular/core';
import {
  NvButton,
  NvColumnConfig,
  NvColumnDataType,
  NvFilterControl,
  NvGridButtonsPosition,
  NvGridConfig,
  NvGridConstants
} from '../models/grid-config';
import { NvKeyValuePair } from '../models/grid-query-payload-config';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { NvGridI18nInterface } from '../services/nv-grid-i18n.service';

@Injectable({
  providedIn: 'root'
})
export class GridUtilsService {
  constructor(
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ) {
  }

  public isButtonVisible(row: any, button: NvButton): boolean {
    return button.hidden === undefined || button.hidden === null || button.hidden === false
      ? true
      : (typeof button.hidden === 'function' ? !button.hidden(row) : !button.hidden);
  }

  public isButtonDisabled(row: any, button: NvButton): boolean {
    return button.disabled === undefined || button.disabled === null || button.disabled === false
      ? false
      : (typeof button.disabled === 'function' ? button.disabled(row) : button.disabled);
  }

  public normalizeOptionalValues(gridConfig: NvGridConfig) {
    // set optional values
    if (gridConfig) {
      if (gridConfig.expandableComponentConfig !== undefined) {
        if (gridConfig.expandableComponentConfig.multiExpand === undefined) {
          gridConfig.expandableComponentConfig.multiExpand = true;
        }
      }

      if (gridConfig.styles === undefined) {
        gridConfig.styles = {
          toolbarBackgroundColor: 'inherit',
          paginationBackgroundColor: 'inherit'
        };
      }

      if (gridConfig.toolbarButtons === undefined) {
        gridConfig.toolbarButtons = [];
      }
      if (gridConfig.editForm === undefined) {
        gridConfig.editForm = {
          allowCreateNewRow: false,
          disableEditColumns: true
        };
      }
      if (gridConfig.showFooter === undefined) {
        gridConfig.showFooter = true;
      }
      if (gridConfig.showRowIndex === undefined) {
        gridConfig.showRowIndex = false;
      }
      if (gridConfig.showFooter === undefined) {
        gridConfig.showFooter = true;
      }
      if (gridConfig.rowHeight === undefined) {
        gridConfig.rowHeight = NvGridConstants.DEFAULT_ROW_HEIGHT;
      }
      if (gridConfig.showPaging === undefined) {
        gridConfig.showPaging = true;
      }
      if (gridConfig.hideSettingsButton === undefined) {
        gridConfig.hideSettingsButton = false;
      }
      if (gridConfig.paging === undefined) {
        gridConfig.paging = {
          pageNumber: 1,
          pageSize: 100,
          showQuickJumper: true
        };
      } else {
        if (gridConfig.paging.showQuickJumper === undefined) {
          gridConfig.paging.showQuickJumper = false;
        }
        if (gridConfig.paging.showTotalItems === undefined) {
          gridConfig.paging.showTotalItems = true;
        }
      }

      if (gridConfig.buttons && gridConfig.buttons.length > 0 && gridConfig.rowButtonsPosition === undefined) {
        gridConfig.rowButtonsPosition = NvGridButtonsPosition.CollapsedLeft;
      }
      // set default value to false
      if (gridConfig.hideAllFilters === undefined) {
        gridConfig.hideAllFilters = false;
      }

      if (gridConfig.buttons === undefined) {
        gridConfig.buttons = [];
      }

      if (gridConfig.hideRefreshButton === undefined) {
        gridConfig.hideRefreshButton = false;
      }

      if (gridConfig.pin === undefined) {
        gridConfig.pin = {
          pinActive: true,
          pinTill: 0
        };
      } else {
        if (gridConfig.pin.pinActive === undefined) {
          gridConfig.pin.pinActive = true;
          gridConfig.pin.pinTill = gridConfig.pin.pinTill ? gridConfig.pin.pinTill : 0;
        } else {
          gridConfig.pin.pinTill = 0;
        }
      }

      gridConfig.columns.forEach((column: NvColumnConfig) => {
        if (column.key === NvGridConstants.UNIQUE_ROW_KEY) {
          column.visible = false;
        }
        if (column.editControl === undefined) {
          column.editControl = { editable: false };
        } else if (column.editControl.editable !== true) {
          column.editControl.editable = false;
        }
        if (column.dataType === undefined) {
          column.dataType = NvColumnDataType.String;
        }
        if (column.filter) {
          switch (column.filter.controlType) {
            case undefined: {
              column.filter.controlType = NvFilterControl.FreeText;
              break;
            }
            case NvFilterControl.RangeNumber: {
              if (column.filter.values === undefined) {
                column.filter.values = ['', ''];
              }
              break;
            }
          }
          if (column.filter.multiSelect === undefined) {
            column.filter.multiSelect = true;
          }
        }
        if (column.dataType === undefined) {
          column.dataType = NvColumnDataType.String;
        }
        if (column.visible === undefined) {
          column.visible = true;
        }
        if (column.hidden === undefined) {
          column.hidden = false;
        }
        if (column.resizeable === undefined) {
          column.resizeable = true;
        }
        if (column.minWidth === undefined) {
          column.minWidth = 50;
        }
        if (column.maxWidth === undefined) {
          column.maxWidth = 500;
        }
        if (column.width === undefined) {
          column.width = 100;
        }
        if (column.isSortable === undefined) {
          column.isSortable = true;
        }
      });
    }
  }

  public findColumn(gridConfig: NvGridConfig, columnKey: string): NvColumnConfig | undefined {
    return gridConfig.columns.find(column => column.key === columnKey);
  }

  public runExternalButtonFunction<T>(row: T, button: NvButton, rowIndex: number): any {
    return button.func(row, rowIndex);
  }

  public handleRowDoubleClick(gridConfig: NvGridConfig, row: any, rowIndex: number) {
    if (gridConfig && gridConfig.buttons) {
      const actionButton = gridConfig.buttons.find((button: NvButton) => button.actOnDoubleClick);
      if (actionButton && actionButton.func) {
        actionButton.func(row, rowIndex);
      }
    }
  }

  public handleRowEnterKeyDown(gridConfig: NvGridConfig, row: any, rowIndex: number) {
    if (gridConfig && gridConfig.buttons) {
      const actionButton = gridConfig.buttons
        .find((button: NvButton) => this.isButtonVisible(row, button) && button.actOnEnter);
      if (
        actionButton
        && !this.isButtonDisabled(row, actionButton)
        && actionButton.func
      ) {
        actionButton.func(row, rowIndex);
      }
    }
  }

  public applyMultiSelectValues(gridConfig: NvGridConfig, multiSelectColumns: NvKeyValuePair[]) {
    if (multiSelectColumns) {
      multiSelectColumns.forEach(multiSelectColumn => {
        const column: NvColumnConfig = this.findColumn(gridConfig, multiSelectColumn.key);
        if (column && column.filter) {
          column.filter.selectValues = multiSelectColumn.values;
        }
      });
    }
  }

  public getVisibleButtons(row: any, buttons: NvButton[]) {
    return buttons.filter((button: NvButton) => this.isButtonVisible(row, button));
  }

  public generateDisplayValue(column: NvColumnConfig, value: any, row: any, config: NvGridI18nInterface, disableFormat: boolean): string {
    let displayValue = value;
    if (!column.customFormatFn) {
      switch (column.dataType) {
        case NvColumnDataType.Date: {

          displayValue = ((typeof value === 'string') && value.match(NvGridConstants.ISO8601_DATE_REGEX)) && !disableFormat
            ? this.datePipe.transform(
              value,
              NvGridConstants.getGridDateFormat(config.gridLocale)
            )
            : value;
          break;
        }
        case NvColumnDataType.DateTime: {
          displayValue = ((typeof value === 'string') && value.match(NvGridConstants.ISO8601_DATE_REGEX)) && !disableFormat
            ? this.datePipe.transform(
              value,
              NvGridConstants.getGridDateTimeFormat(config.gridLocale)
            )
            : value;
          break;
        }
        case NvColumnDataType.Boolean: {
          displayValue = this.translateLanguage(config.gridLanguage, value);
          break;
        }
        case NvColumnDataType.Decimal: {
          displayValue = !disableFormat
            ? this.decimalPipe.transform(
              value,
              column.decimalDigitsInfo
                ? column.decimalDigitsInfo
                : '1.2-2', config.gridLocale
            )
            : value;
          break;
        }
        case NvColumnDataType.Currency: {
          displayValue = this.transferCurrency(config.gridLocale, value);
          break;
        }
      }
    } else {
      displayValue = column.customFormatFn(row);
    }
    return displayValue ? displayValue : '';
  }

  isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.valueOf());
  }

  private transferCurrency(locale: string, value: any): string {
    if (typeof +value === 'number') {
      switch (locale) {
        case 'en-US':
          return this.currencyPipe.transform(value, 'USD', 'symbol-narrow');
        case 'en-GB':
          return this.currencyPipe.transform(value, 'GBP', 'symbol-narrow');
        default:
          return this.currencyPipe.transform(value, 'EUR', 'symbol-narrow');
      }
    }
    return value;
  }

  private translateLanguage(language: string, value: any) {
    if (language === 'en') {
      return this.isTrue(value) ? 'Yes' : 'No';
    } else {
      return this.isTrue(value) ? 'Ja' : 'Nein';
    }
  }

  private isTrue(value: any): boolean {
    return (value === 1 || value === '1' || value === true || value === 'true');
  }

  public widthOfVisibleButtons(row: any, buttons: NvButton[]): number {
    let width = 0;
    buttons.forEach(button =>
      this.isButtonVisible(row, button)
        ? width += NvGridConstants.MENU_BUTTON_COLUMN_WIDTH
        : null
    );
    return width;
  }
}
