export interface GridQueryPayloadConfig {
  filters?: NvKeyValuePair[];
  multiSelectColumns?: string[];
  sortBy?: string;
  isSortAscending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface GridQueryPayloadForExcelExportConfig extends GridQueryPayloadConfig {
  title: string;
  columns?: GridQueryPayloadColumnConfig[];
}

export interface NvKeyValuePair {
  key: string;
  values: any[];
}

export interface GridQueryPayloadColumnConfig {
  key: string;
  title: string;
  width: number;
}
