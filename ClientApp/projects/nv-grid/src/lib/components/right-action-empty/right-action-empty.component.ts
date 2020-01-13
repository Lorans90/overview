import { Component, Input, OnInit } from '@angular/core';
import {
  NvButton,
  NvGridButtonsPosition,
  NvGridConstants
} from '../../models/grid-config';
import { GridUtilsService } from '../../services/grid-utils.service';

@Component({
  selector: 'nv-right-action-empty',
  templateUrl: './right-action-empty.component.html',
  styleUrls: ['./right-action-empty.component.css']
})
export class RightActionEmptyComponent implements OnInit {
  @Input() rowButtonsPosition: NvGridButtonsPosition;
  @Input() buttons: NvButton[];

  public readonly Constants = NvGridConstants;
  public NvGridButtonsPosition = NvGridButtonsPosition;

  constructor(public gridUtilsService: GridUtilsService) {
  }

  ngOnInit() {
  }
}
