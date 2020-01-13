import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { WidgetType } from '../../enums/widgets.enum';

@Component({
  selector: 'app-widgets-container',
  templateUrl: './widgets-container.component.html',
  styleUrls: ['./widgets-container.component.css']
})
export class WidgetsContainerComponent implements OnInit {
  @Input() item: GridsterItem;
  @Input() editMode: boolean;
  @Output() deleteWidget: EventEmitter<void> = new EventEmitter<void>();
  WidgetType = WidgetType;

  constructor() { }

  ngOnInit() {
  }
}
