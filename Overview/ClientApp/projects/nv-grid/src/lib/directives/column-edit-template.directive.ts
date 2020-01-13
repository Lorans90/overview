import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[nvEditColumnTemplate]'
})
export class ColumnEditTemplateDirective {

  @Input() columnName = '';

  constructor(public templateRef: TemplateRef<any>) {
  }

}
