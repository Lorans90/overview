import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {
  NvColumnConfig,
  NvColumnDataType
} from '../../../models/grid-config';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { NvGridI18nInterface } from '../../../services/nv-grid-i18n.service';

@Component({
  selector: 'nv-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCellComponent implements OnInit {
  @Input() public column: NvColumnConfig;
  @Input() public form: FormGroup;
  @Input() public cellValue: any;
  @Input() public row: any;
  @Input() public rowIndex: number;
  @Input() public customTooltip: string;
  @Input() public isEditing = false;
  @Input() public allowJumpToNextCellIfInvalid = false;
  @Input() columnTemplate: TemplateRef<any>;
  @Input() columnEditTemplate: TemplateRef<any>;
  @Input() public rootConfigChanged: NvGridI18nInterface;
  @Input() public error: ValidationErrors;
  @Output() public nextCell = new EventEmitter();
  @Output() public rowModified = new EventEmitter();
  @Output() public switch = new EventEmitter();

  public externalEmitter = new EventEmitter<string>();
  public tabKeyDown = new Subject<KeyboardEvent>();
  public NvColumnDataType = NvColumnDataType;

  @HostBinding('attr.data-cell') dataAttr = '';

  ngOnInit(): void {
    this.dataAttr = this.column.key;
    this.tabKeyDown
      .subscribe((event) => {
        this.markRowAsModified();
        if (!this.containsErrors() || this.allowJumpToNextCellIfInvalid) {
          if (event.shiftKey && event.key === 'Tab') {
            this.nextCell.emit({ form: this.form, event: true });
          } else {
            this.nextCell.emit({ form: this.form, event: false });
          }
        }
      });

    this.externalEmitter.subscribe((event: KeyboardEvent | FocusEvent | boolean) => {

      if (
        (event instanceof FocusEvent && event.type === 'blur')
        || (event instanceof KeyboardEvent && event.key === 'Escape')
        || (typeof event === 'boolean' && event === false)
      ) {
        this.switchCellToViewMode();
      } else if (
        event instanceof KeyboardEvent
        && (event.key === 'Enter' || event.key === 'Tab')
      ) {
        event.preventDefault();
        this.markRowAsModified();

        if (
          !this.containsErrors()
          || this.allowJumpToNextCellIfInvalid
        ) {
          this.jumpToCell(event);
        }
      } else if (typeof event === 'boolean'
        && event === true) {
        this.markControlAsTouched();
        this.nextCell.emit({ form: this.form, event: false });
      }
    });
  }

  public switchCellToViewMode(): void {
    this.markControlAsTouched();
    this.markRowAsModified();
    this.switch.emit();
  }

  public jumpToCell(event: KeyboardEvent): void {
    this.markControlAsTouched();
    this.tabKeyDown.next(event);
  }

  public markRowAsModified(): void {
    if (this.form.dirty) {
      this.rowModified.emit();
    }
  }

  private containsErrors(): boolean {
    if (this.form && this.form.get(this.column.key).errors) {
      return true;
    }
    return false;
  }

  private markControlAsTouched(): void {
    if (!this.form.get(this.column.key).touched) {
      this.form.get(this.column.key).markAsTouched();
    }
  }
}
