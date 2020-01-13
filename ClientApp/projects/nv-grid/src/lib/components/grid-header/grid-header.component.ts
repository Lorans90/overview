import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NvButton,
  NvColumnConfig,
  NvGridConfig,
  NvGridConstants
} from '../../models/grid-config';
import { DragDropService } from '../../services/drag-drop.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'nv-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: ['./grid-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridHeaderComponent {
  @Input() gridConfig: NvGridConfig;
  @Input() selectedRowsLength: number;
  @Input() columns: NvColumnConfig[];

  @Output() openedContextMenu = new EventEmitter<{ colIndex: number, rowIndex: number, mouseEvent: MouseEvent, buttons: NvButton[] }>();
  @Output() columnSorted = new EventEmitter<NvColumnConfig>();

  public readonly Constants = NvGridConstants;
  public headButtons = [];
  private readonly pinButton: NvButton = {
    icon: 'link',
    description: 'pinColumn',
    name: 'pin',
    tooltip: 'pinColumn',
    func: (colIndex: number): void => {
      this.setPin(colIndex);
    }
  };

  private readonly unpinButton: NvButton = {
    icon: 'disconnect',
    description: 'unpinColumn',
    name: 'unpin',
    tooltip: 'unpinColumn',
    func: (): void => {
      this.unPin();
    }
  };

  constructor(
    private dragDropService: DragDropService,
    public configurationService: ConfigurationService) { }

  public dragEndEvent(event: CdkDragDrop<string[]>): void {
    const newOrderColumns = this.dragDropService.dragEndEvent(event,
      this.gridConfig.columns,
      this.configurationService.visibleColumns.value
    );
    this.configurationService.updateVisibleColumns(this.configurationService.getVisibleAndNotHiddenColumns(newOrderColumns));
  }

  public updateColumns() {
    this.configurationService.updateVisibleColumns(this.gridConfig.columns);
  }

  public setPin(colIndex: number) {
    this.gridConfig.pin.pinTill = colIndex + 1;
  }

  public unPin() {
    this.gridConfig.pin.pinTill = 0;
  }

  public sortColumn(column: NvColumnConfig) {
    if (!this.gridConfig.disableSortColumns) {
      this.columnSorted.emit(column);
    }
  }

  public getPinButtons(colIndex: number) {
    if (this.gridConfig.pin.pinTill === colIndex + 1) {
      this.headButtons
        .splice(this.headButtons.indexOf(this.pinButton), 1);

      this.headButtons
        .push(this.unpinButton);

    } else {
      this.headButtons
        .splice(this.headButtons.indexOf(this.unpinButton), 1);
      if (this.headButtons.indexOf(this.pinButton) === -1) {
        this.headButtons
          .push(this.pinButton);
      }
    }
  }

  public handleContextMenu(colIndex: number, mouseEvent: MouseEvent) {
    if (this.gridConfig.pin.pinActive) {
      this.getPinButtons(colIndex);
    }

    this.openedContextMenu.emit({
      colIndex: colIndex,
      rowIndex: -1,
      mouseEvent: mouseEvent,
      buttons: this.headButtons
    });
  }
}
