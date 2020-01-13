import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { NvColumnConfig, NvGridConfig } from '../models/grid-config';
import {
  GridQueryPayloadColumnConfig,
  GridQueryPayloadConfig,
  GridQueryPayloadForExcelExportConfig,
  NvKeyValuePair
} from '../models/grid-query-payload-config';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { GridQueryResult } from '../models/grid-query-result';
import { GRID_GLOBAL_CONFIG, GridGlobalConfig } from './grid-api.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const httpExcelOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }),
  reportProgress: true,
  responseType: 'blob' as 'text',
  observe: 'response' as 'response',
  body: null as any,
};

@Injectable()
export class GridDataService {
  public configChanged = new ReplaySubject<NvGridConfig>(1);
  public gridConf: NvGridConfig;
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  private rawData: BehaviorSubject<GridQueryResult> = new BehaviorSubject<GridQueryResult>({
    items: [],
    totalItems: 0,
    displayItems: [],
    multiSelectColumns: []
  });
  public rowData$ = this.rawData.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(GRID_GLOBAL_CONFIG) private globalConfig: GridGlobalConfig
  ) {
    this.configChanged
      .pipe(
        filter((config: any) => config.url),
        tap((conf: any) => {
          this.isLoadingSubject.next(true);
          this.gridConf = conf;
          return conf;
        }),
        switchMap((config: any) => this.sendHttpRequest(config))
      )
      .subscribe((response: GridQueryResult) => {
          // Navido 2.0 backed works in this form:
          if (response.data) {
            response = response.data;
          }
          this.rawData.next(response);
          this.isLoadingSubject.next(false);
        },
        (error: HttpErrorResponse) => {
          console.error('grid can not load the dialogData!', error);
          const emptyResult: GridQueryResult = {
            displayItems: [],
            items: [],
            totalItems: 0,
            multiSelectColumns: []
          };
          this.rawData.next(emptyResult);
          this.isLoadingSubject.next(false);
          throw error;
        });
  }

  public downloadAsExcel(config: NvGridConfig): Observable<any> {
    httpExcelOptions.body = this.getQueryPayloadForExcel(config);

    return this.http.request('POST', `/${this.globalConfig.apiEndpoint}/${config.excelExportUrl}`, httpExcelOptions)
      .pipe(
        map((response: HttpResponse<any>) => {
          const blob = new Blob([response.body], { type: 'application/xlsx' });
          const disposition = response.headers.get('content-disposition');
          const matches = /"([^"]*)"/.exec(disposition);
          const filename = (matches != null && matches[1] ? matches[1] : 'result.xlsx');
          return [blob, filename];
        })
      );
  }

  public downloadAsPdf(config: NvGridConfig): Observable<any> {
    httpExcelOptions.body = this.getQueryPayloadForExcel(config);

    return this.http.request('POST', `${this.globalConfig.apiEndpoint}/${config.excelExportUrl.replace('Excel', 'Pdf')}`, httpExcelOptions)
      .pipe(
        map((response: HttpResponse<any>) => {
          const blob = new Blob([response.body], { type: 'application/pdf' });
          const disposition = response.headers.get('content-disposition');
          const matches = /"([^"]*)"/.exec(disposition);
          const filename = (matches != null && matches[1] ? matches[1] : 'result.pdf');
          return [blob, filename];
        })
      );
  }

  private sendHttpRequest(config: NvGridConfig): Observable<GridQueryResult> {
    const queryPayload = this.getQueryPayload(config);
    if (config.url.method === 'POST') {
      return this.http.post<GridQueryResult>(`${this.globalConfig.apiEndpoint}/${config.url.endPoint}`, queryPayload, httpOptions);
    } else {
      const queryString = JSON.stringify(queryPayload);
      return this.http.get<GridQueryResult>(`${this.globalConfig.apiEndpoint}/${config.url.endPoint}?queryObject=${queryString}`);
    }
  }


  private getQueryPayloadForExcel(config: NvGridConfig): GridQueryPayloadForExcelExportConfig {

    const payload = this.getQueryPayload(config) as GridQueryPayloadForExcelExportConfig;

    payload.title = config.gridName;
    const columns = config.columns.filter(column =>
      column && !column.hidden && column.visible
    ).map(visibleColumn => <GridQueryPayloadColumnConfig>{
      key: visibleColumn.key,
      title: visibleColumn.title || visibleColumn.key,
      width: visibleColumn.width || 0
    });

    if (columns) {
      payload.columns = columns;
    }
    return payload;
  }

  private getQueryPayload(config: NvGridConfig): GridQueryPayloadConfig {
    const payload: GridQueryPayloadConfig = {};

    payload.page = config.paging.pageNumber;
    payload.pageSize = config.paging.pageSize;

    // TODO : extend the filtering for more filter.keys or .values
    // currently we support filter.key[0] and filter.values[0]
    const filters = config.columns.filter(column =>
      column && column.filter && column.filter.values && column.filter.values.length > 0
    ).map(filterColumn => <NvKeyValuePair>{
      key: this.getColumnName(filterColumn),
      values: filterColumn.filter.values
    });
    if (filters) {
      payload.filters = filters;
    }

    const multiSelectColumns = config.columns.filter(column =>
      column && column.filter && column.filter.selectValues && column.filter.selectValues.length === 0
    ).map(selectColumn => this.getColumnName(selectColumn)
    );
    if (multiSelectColumns) {
      payload.multiSelectColumns = multiSelectColumns;
    }
    // sorting
    if (config.sortBy) {
      payload.sortBy = this.toUppercaseFirstChar(config.sortBy);
      payload.isSortAscending = config.isSortAscending;
    }
    return payload;
  }

  private getColumnName(column: NvColumnConfig): string {
    const columnNameLowerCase =
      column
      && column.filter
      && column.filter.keys
      && column.filter.keys.length > 0
        ? column.filter.keys[0]
        : column.key;
    return this.toUppercaseFirstChar(columnNameLowerCase);
  }

  private toUppercaseFirstChar(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1, word.length);
  }
}
