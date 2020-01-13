import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  NvColumnConfig,
  NvColumnDataType
} from '../../../../models/grid-config';
import { FormGroup } from '@angular/forms';
import { NvGridI18nInterface } from '../../../../services/nv-grid-i18n.service';

@Component({
  selector: 'nv-grid-cell-editing',
  templateUrl: './grid-cell-editing.component.html',
  styleUrls: ['./grid-cell-editing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCellEditingComponent implements AfterViewInit {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() public cellValue: any;
  @Input() public column: NvColumnConfig;
  @Input() public row: any;
  @Input() public form: FormGroup;
  @Input() public rootConfigChanged: NvGridI18nInterface;
  @Output() public switchCellToViewMode = new EventEmitter();
  @Output() public next = new EventEmitter<KeyboardEvent>();

  public readonly NvColumnDataType = NvColumnDataType;

  constructor() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
    }, 0);
  }

  public jump(event: KeyboardEvent) {
    event.preventDefault();
    this.next.emit(event);
  }


  public switch() {
    this.switchCellToViewMode.emit();
  }
}
