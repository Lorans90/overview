import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NvButton, NvGridConstants } from '../../../models/grid-config';
import { GridUtilsService } from '../../../services/grid-utils.service';

@Component({
  selector: 'nv-right-action',
  templateUrl: './right-action.component.html',
  styleUrls: ['./right-action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RightActionComponent implements OnInit {
  @Input() buttons: NvButton[];
  @Input() public row: any;
  @Input() public rowIndex: number;

  public readonly Constants = NvGridConstants;

  constructor(
    public gridUtilsService: GridUtilsService
  ) {
  }

  ngOnInit() {
  }
}
