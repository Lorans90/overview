export interface GridQueryResult {
  data?: any;
  totalItems: number;
  items: any[];
  displayItems: any[];
  multiSelectColumns: NvKeyValuePairResult [];
}

export interface NvKeyValuePairResult {
  key: string;
  values: any[];
}
