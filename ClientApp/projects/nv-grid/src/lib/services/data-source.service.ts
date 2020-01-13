import { Injectable } from '@angular/core';
import {
  GridLocale,
  NvColumnConfig,
  NvColumnDataType,
  NvFilterControl,
  NvGridConstants
} from '../models/grid-config';
import { GridUtilsService } from './grid-utils.service';
import { DatePipe } from '@angular/common';
import { NvGridI18nInterface, NvGridI18nService } from './nv-grid-i18n.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {

  constructor(private gridUtilsService: GridUtilsService,
    private datePipe: DatePipe,
    private nvGridI18nService: NvGridI18nService
  ) {
  }

  public getFilteredDataSource(
    columns: NvColumnConfig[],
    dataSource: any[],
    config: NvGridI18nInterface
  ): any[] {
    const filterColumns = this.getColumnsWithFilter(columns);
    let filteredData = [...dataSource];
    if (filterColumns.length > 0) {
      for (const filterColumn of filterColumns) {
        filteredData = filteredData.filter(row => this.rowShouldBeFiltered(row, filterColumn, config));
      }
    }
    return filteredData;
  }

  public applySortingToDataSource(sortKey: string, isSortAscending: boolean, rows: any[]): any[] {
    if (sortKey && rows && rows.length > 0) {
      return rows.sort((a, b) => {
        const aGridConfig = a[sortKey];
        const bGridConfig = b[sortKey];

        if (aGridConfig === bGridConfig) {
          return 0;
        }
        if (
          aGridConfig === null
          || aGridConfig === ''
          || aGridConfig === undefined
        ) {
          return isSortAscending ? -1 : 1;
        } else if (
          bGridConfig === null
          || bGridConfig === ''
          || bGridConfig === undefined
        ) {
          return isSortAscending ? 1 : -1;
        } else if (
          typeof aGridConfig === 'string'
          && typeof bGridConfig === 'string'
        ) {
          return isSortAscending
            ? aGridConfig.localeCompare(bGridConfig)
            : bGridConfig.localeCompare(aGridConfig);
        } else if (
          typeof aGridConfig === 'number'
          || typeof aGridConfig === 'boolean'
        ) {
          if (aGridConfig < bGridConfig) {
            return isSortAscending ? -1 : 1;
          }
          if (aGridConfig > bGridConfig) {
            return isSortAscending ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return rows;
  }

  private getColumnsWithFilter(columns: NvColumnConfig[]): NvColumnConfig[] {
    return columns
      .filter((column: NvColumnConfig) => column.filter && column.filter.values && column.filter.values.length > 0);
  }

  private rowShouldBeFiltered(row: any[], column: NvColumnConfig, config: NvGridI18nInterface): boolean {
    if (column.filter.controlType === NvFilterControl.RangeNumber) {
      return this.isInRange(row[column.key], column.filter.values);
    }
    if (column.filter.controlType === NvFilterControl.Boolean) {
      return this.isTrueOrFalse(row[column.key], column.filter.values);
    }
    let cellValue = row[column.key];
    if (column.customFormatFn) {
      cellValue = this.gridUtilsService.generateDisplayValue(column, cellValue, row, config, false);
    }
    if (
      column.dataType === NvColumnDataType.Date ||
      column.dataType === NvColumnDataType.DateTime
    ) {
      return this.ContainsDate(cellValue, column.filter.values, config.gridLocale);
    }

    return this.ContainsAny(cellValue, column.filter.values);
  }

  private ContainsAny(cellStringValue: any, filterStrings: string[]): boolean {
    filterStrings = filterStrings.filter(str => !!str);
    for (const filterStr of filterStrings) {
      if (
        cellStringValue &&
        filterStr &&
        new TranslatePipe(this.nvGridI18nService).transform(cellStringValue)
          .toString()
          .toLowerCase()
          .indexOf(
            filterStr.toString()
              .toLowerCase()
          ) > -1
      ) {
        return true;
      }
    }
    return false;
  }

  private ContainsDate(cellStringValue: any, filterStrings: string[], locale: GridLocale): boolean {
    filterStrings = filterStrings.filter(filterString => !!filterString);
    for (const filterString of filterStrings) {
      if (
        cellStringValue &&
        filterString &&
        this.datePipe.transform(
          cellStringValue,
          NvGridConstants.getGridDateTimeFormat(locale)
        ).toString()
          .replace(/ /g, '')
          .indexOf(
            filterString
              .toString()
              .replace(/ /g, '')
              .toLowerCase()) > -1
      ) {
        return true;
      }
    }
    return false;
  }

  private isTrueOrFalse(cellStringValue: any, filterValues: any[]) {
    if (
      filterValues[0] === '1'
      && (
        cellStringValue === true
        || cellStringValue === 'true'
        || cellStringValue === 1
        || cellStringValue === '1'
      )
    ) {
      return true;
    } else if (
      filterValues[0] === '0'
      && (
        cellStringValue === false
        || cellStringValue === 'false'
        || cellStringValue === 0
        || cellStringValue === '0'
      )
    ) {
      return true;
    }
    return false;
  }

  private isInRange(cellStringValue: any, filterRange: any[]): boolean {
    const from = filterRange[0];
    const to = filterRange[1];
    let gtThan = false;
    let smThan = false;
    if (cellStringValue != null) {
      if ((this.isNumber(from) && +cellStringValue >= +from) || from == null || from === '') {
        gtThan = true;
      }
      if ((this.isNumber(to) && +cellStringValue <= +to) || to == null || to === '') {
        smThan = true;
      }
    }
    return gtThan && smThan;
  }

  private isNumber(n: any): boolean {
    return n != null && !isNaN(parseFloat(n)) && isFinite(n);
  }
}
