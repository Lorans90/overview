import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NvGridConstants,
  NvGridRowSelectionType,
  NvPagination
} from '../../../models/grid-config';

@Component({
  selector: 'nv-left-action',
  templateUrl: './left-action.component.html',
  styleUrls: ['./left-action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftActionComponent {
  @Input() public rowIndex: number;
  @Input() public rowChecked: boolean;
  @Input() public rowExpanded: boolean;
  @Input() public rowSelectType: NvGridRowSelectionType;
  @Input() public showMenuButton: boolean;
  @Input() public disableMenuButton: boolean;
  @Input() public showExpandButton: any;
  @Input() public showRowIndex: boolean;
  @Input() public paging: NvPagination;

  @Output() public menuButtonClicked = new EventEmitter<{ mouseEvent: MouseEvent }>();
  @Output() public selectRow = new EventEmitter<{ mouseEvent: MouseEvent }>();
  @Output() public expandRow = new EventEmitter();

  public readonly Constants = NvGridConstants;
  public GridRowSelectionType = NvGridRowSelectionType;

  constructor() {
  }

  public openContextMenu(mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    if (this.rowSelectType in NvGridRowSelectionType) {
      this.selectRowAction(mouseEvent);
    }
    this.menuButtonClicked.emit({ mouseEvent: mouseEvent });
    return false;
  }

  public noAction(mouseEvent: MouseEvent) {
    mouseEvent.cancelBubble = true;
    return false;
  }

  public selectRowAction(mouseEvent: MouseEvent) {
    this.selectRow.emit({ mouseEvent: mouseEvent });
  }

  public openExpandView() {
    this.expandRow.emit();
  }

  public preventDefaultClick(event: KeyboardEvent) {
    event.preventDefault();
  }
}
