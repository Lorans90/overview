import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NvColumnConfig, NvGridConfig, NvGridConstants } from '../../models/grid-config';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'nv-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.css']
})

export class GridFilterComponent {
  @Input() gridConfig: NvGridConfig;
  @Input() selectedRowsLength: number;
  @Input() areAllRowsSelected: boolean;
  @Input() columns: NvColumnConfig[];

  @Output() allRowsSelected = new EventEmitter<boolean>();
  @Output() gridFiltered = new EventEmitter<void>();
  @Output() allRowsCollapsed = new EventEmitter<void>();

  public readonly Constants = NvGridConstants;
  constructor(public configurationService: ConfigurationService) {
  }
}
