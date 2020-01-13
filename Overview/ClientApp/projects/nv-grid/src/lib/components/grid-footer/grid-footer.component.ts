import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  NvColumnConfig,
  NvGridConfig,
  NvGridConstants,
  NvOperation
} from '../../models/grid-config';
import { ConfigurationService } from '../../services/configuration.service';
import { GridUtilsService } from '../../services/grid-utils.service';
import { NvGridI18nInterface } from '../../services/nv-grid-i18n.service';

@Component({
  selector: 'nv-grid-footer',
  templateUrl: './grid-footer.component.html',
  styleUrls: ['./grid-footer.component.css']
})
export class GridFooterComponent implements OnChanges {
  @Input() gridConfig: NvGridConfig;
  @Input() rows: any[];
  @Input() public rootConfigChanged: NvGridI18nInterface;
  @Input() columns: NvColumnConfig[];
  @Input() changesDetected: any;

  public footerRow: any[] = [];
  public readonly Constants = NvGridConstants;
  public row: any;
  public footer: { [columnKey: string]: any } = {};
  constructor(
    public configurationService: ConfigurationService,
    public gridUtilsService: GridUtilsService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.gridConfig.columns.forEach(column => this.calculateValue(column));
  }
  calculateValue(column: NvColumnConfig) {
    const rows = this.rows.map(row => row[column.key]);
    if (column && column.footer && column.footer.operation === NvOperation.Sum) {
      const result = rows.reduce((prev, cur) => +prev + +cur, 0);
      this.row = { [column.key]: result };

      return this.footer = {
        ...this.footer,
        [column.key]: result
      };
    } else if (column && column.footer && column.footer.operation) {
      this.row = { [column.key]: column.footer.operation(this.rows) };

      return this.footer = {
        ...this.footer,
        [column.key]: column.footer.operation(this.rows)
      };
    }
    this.footer = {
      ...this.footer,
      [column.key]: null
    };
  }
}
