import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[nvColumnTemplate]'
})
export class ColumnTemplateDirective {

  @Input() columnName = '';

  constructor(public templateRef: TemplateRef<any>) {
  }

}
