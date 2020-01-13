import { Inject, Injectable } from '@angular/core';
import { utils, WorkBook, WorkSheet, write } from 'xlsx';
import { GridUtilsService } from './grid-utils.service';
import { NvGridI18nInterface, NvGridI18nService } from './nv-grid-i18n.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { NvColumnConfig, NvColumnDataType } from '../models/grid-config';
import { DOCUMENT } from '@angular/common';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({ providedIn: 'root' })
export class ExcelService {
    constructor(
        private gridUtilsService: GridUtilsService,
        private nvGridI18nService: NvGridI18nService,
        @Inject(DOCUMENT) private document: any
    ) { }

    public exportAsExcelFile(rows: any[], excelFileName: string, columns: NvColumnConfig[], config): void {
        const rowsToExport = this.formatedRows(rows, columns, config);
        const worksheet: WorkSheet = utils.json_to_sheet(rowsToExport);

        worksheet['!cols'] = columns.map(column => ({ wpx: column.width / 1.2, hidden: column.hidden }));
        const workbook: WorkBook = { Sheets: { ['data']: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    public saveAsExcelFile(buffer: any, fileName: string): void {
        const blob: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        const url = window.URL.createObjectURL(blob);
        const link = this.document.createElement('a');
        link.href = url;
        link.download = fileName;

        this.document.body.appendChild(link);
        link.click();
        this.document.body.removeChild(link);
    }

    private formatedRows(rows: any[], columns: NvColumnConfig[], config: NvGridI18nInterface): any[] {
        const formatedRows: any[] = [];
        const clonedRows = JSON.parse(JSON.stringify(rows));

        clonedRows.forEach(row => {
            const toFormatRow = {};
            columns.forEach(column => {

                if (row[column.key] && typeof row[column.key] === 'object') {
                    row[column.key] = new TranslatePipe(this.nvGridI18nService).transform(row[column.key]);
                }
                let title: string;

                if (column.title && typeof column.title === 'object') {
                    title = new TranslatePipe(this.nvGridI18nService).transform(column.title);
                } else {
                    title = column.title as string;
                }

                const formattedValue = this.gridUtilsService.generateDisplayValue(column, row[column.key], row, config, true);

                const type = this.getType(column, formattedValue);

                toFormatRow[title] = {
                    v: formattedValue,
                    t: type,
                };
            });
            formatedRows.push(toFormatRow);
        });
        return formatedRows;
    }

    getType(column: NvColumnConfig, value: any) {
        if (!value) {
            return 's';
        }

        if (column.dataType === NvColumnDataType.Decimal) {
            return 'n';
        }

        if (column.dataType === NvColumnDataType.DateTime || column.dataType === NvColumnDataType.Date) {
            return 'd';
        }
        return 's';
    }
}
