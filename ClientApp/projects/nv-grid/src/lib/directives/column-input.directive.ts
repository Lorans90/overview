import { AfterViewChecked, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { GridDataService } from '../services/grid-data.service';
import { NvGridConfig } from '../models/grid-config';

@Directive({
  selector: '[nvColumnInput]'
})
export class ColumnInputDirective implements AfterViewChecked {
  @Input() columnName: string;

  constructor(
    private el: ElementRef,
    public gridService: GridDataService,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewChecked() {
    const formControlName = (this.el.nativeElement as HTMLElement).getAttribute('formControlName');
    if (formControlName || this.columnName) {
      this.gridService.configChanged.subscribe((gridConfig: NvGridConfig) => {
        const foundColumn = gridConfig.columns.find(column => column.key === formControlName || column.key === this.columnName);
        if (foundColumn) {
          this.renderer.setStyle(this.el.nativeElement, 'minWidth', foundColumn.width + 'px');
          this.renderer.setStyle(this.el.nativeElement, 'maxWidth', foundColumn.width + 'px');
        }
      });
    }
  }

}
