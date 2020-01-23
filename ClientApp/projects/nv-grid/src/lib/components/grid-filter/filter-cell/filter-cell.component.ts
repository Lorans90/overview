import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  NvColumnConfig,
  NvFilterControl,
} from '../../../models/grid-config';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

interface FilterValue {
  value: string;
  rangeUpperBound?: any;
}

@Component({
  selector: 'nv-filter-cell',
  templateUrl: './filter-cell.component.html',
  styleUrls: ['./filter-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterCellComponent implements OnInit, OnDestroy {
  @Input() column: NvColumnConfig;
  @Output() columnChange: EventEmitter<void> = new EventEmitter<void>();

  public NvFilterControl = NvFilterControl;
  public form: FormGroup;
  private componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      value: '',
      rangeUpperBound: ''
    });
  }

  ngOnInit() {
    if (this.column.filter) {
      this.column.filter.form = this.form;
      if (this.column.filter.controlType === NvFilterControl.RangeNumber) {
        this.form.reset({
          value: this.column.filter.values[0],
          rangeUpperBound: this.column.filter.values[1]
        });
      } else {
        this.form.reset({
          value: this.column.filter.values[0]
        });
      }
    }
    this.form.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(400),
        distinctUntilChanged(),
      )
      .subscribe((formValue: FilterValue) => {
        if (this.column.filter.controlType === NvFilterControl.RangeNumber) {
          this.column.filter.values = [formValue.value, formValue.rangeUpperBound];
        } else {
          this.column.filter.values = Array.isArray(formValue.value)
            ? formValue.value
            : formValue.value
              ? [formValue.value]
              : [];
        }
        this.columnChange.emit();
      });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
