import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  NvGridButtonsPosition,
  NvGridConstants,
  NvGridRowSelectionType
} from '../../models/grid-config';

@Component({
  selector: 'nv-left-action-empty',
  templateUrl: './left-action-empty.component.html',
  styleUrls: ['./left-action-empty.component.css']
})
export class LeftActionEmptyComponent implements OnChanges {
  @Input() isFilterRow = false;
  @Input() selectedRowsLength: number;
  @Input() areAllRowsSelected: boolean;
  @Input() rowSelectionType: NvGridRowSelectionType;
  @Input() rowButtonsPosition: NvGridButtonsPosition;
  @Input() isGridExpandable: boolean;
  @Input() showRowIndex: boolean;

  @Output() allRowsSelected = new EventEmitter<boolean>();
  @Output() allRowsCollapsed = new EventEmitter<void>();

  public readonly Constants = NvGridConstants;
  public NvGridRowSelectionType = NvGridRowSelectionType;
  public NvGridButtonsPosition = NvGridButtonsPosition;

  public allChecked = false;
  public unknownStateOfSelection = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedRowsLength) {
      this.update();
    }
  }

  update() {
    if (this.selectedRowsLength === 0) {
      this.allChecked = false;
      this.unknownStateOfSelection = false;
    } else if (this.areAllRowsSelected) {
      this.allChecked = true;
      this.unknownStateOfSelection = false;
    } else {
      this.unknownStateOfSelection = true;
    }
  }
}
