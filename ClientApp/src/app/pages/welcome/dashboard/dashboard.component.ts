import { Component, OnInit, ViewChild } from '@angular/core';
import { GridsterComponent, GridsterConfig, GridType, CompactType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';

export enum WidgetType {
  Clock = 0,
  Weather = 1,
  Bookmark = 2,
  Todo = 3,
  Currency = 4,
  Steps = 5,
  Circles = 6,
  Bars = 7,
  Chart = 8,
  Feed = 9
}

export interface Widget {
  type: WidgetType;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})


export class DashboardComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid: GridsterComponent;
  public dashboardWidgetItems: BehaviorSubject<GridsterItem[]> = new BehaviorSubject<GridsterItem[]>(this.getItems()
  );

  public editMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public options: GridsterConfig = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
    margin: 5,
    outerMargin: true,
    mobileBreakpoint: 640,
    minCols: 1,
    maxCols: 4,
    minRows: 1,
    maxRows: 4,
    rows: 4,
    cols: 4,
    maxItemCols: 4,
    minItemCols: 1,
    maxItemRows: 4,
    minItemRows: 1,
    maxItemArea: 2500,
    minItemArea: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    fixedColWidth: 600,
    fixedRowHeight: 210,
    keepFixedHeightInMobile: false,
    keepFixedWidthInMobile: false,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    enableEmptyCellClick: false,
    enableEmptyCellContextMenu: false,
    enableEmptyCellDrop: false,
    enableEmptyCellDrag: false,
    emptyCellDragMaxCols: 50,
    emptyCellDragMaxRows: 50,
    ignoreMarginInRow: false,
    draggable: {
      enabled: false,
    },
    resizable: {
      enabled: false,
    },
    swap: true,
    pushItems: true,
    disablePushOnDrag: true,
    disablePushOnResize: true,
    pushDirections: { north: true, east: true, south: true, west: true },
    pushResizeItems: true,
    displayGrid: DisplayGrid.OnDragAndResize,
    disableWindowResize: false,
    disableWarnings: true,
    scrollToNewItems: false
  };

  widgetsList: Widget[] = [
    { icon: 'anticon-cloud', name: 'Weather', type: WidgetType.Weather },
    { icon: 'anticon-clock-circle-o', name: 'Clock', type: WidgetType.Clock },
    { icon: 'anticon-book', name: 'Bookmark', type: WidgetType.Bookmark },
    { icon: 'unordered-list', name: 'Todo', type: WidgetType.Todo },
    { icon: 'dollar', name: 'Currency', type: WidgetType.Currency },
    { icon: 'swap', name: 'Bars', type: WidgetType.Bars },
    { icon: 'fast-forward', name: 'Steps', type: WidgetType.Steps },
    { icon: 'pie-chart', name: 'Circles', type: WidgetType.Circles },
    { icon: 'bar-chart', name: 'Chart', type: WidgetType.Chart },
    { icon: 'unordered-list', name: 'Feed', type: WidgetType.Feed },


  ];
  constructor() { }

  ngOnInit() {
    this.dashboardWidgetItems.subscribe(items => this.saveItems(items));
  }

  private getItems(): GridsterItem[] {
    const localStorageDashboard = JSON.parse(localStorage.getItem('dashboard'));
    return localStorageDashboard || [];
  }

  private saveItems(items: GridsterItem[]) {
    localStorage.setItem('dashboard', JSON.stringify(items));
  }

  public addWidget(type: WidgetType) {
    const newItem = this.options.api.getFirstPossiblePosition({
      cols: 1,
      rows: 1,
      y: 0,
      x: 0
    });

    const newWidget: GridsterItem = {
      cols: 1,
      rows: 1,
      y: newItem.y,
      x: newItem.x,
      type,
      id: uuid.v4()
    };

    this.appendWidget(newWidget);
  }

  public appendWidget(gridsterItem: GridsterItem): void {
    this.dashboardWidgetItems.next([...this.dashboardWidgetItems.getValue(), gridsterItem]);
  }

  public deleteWidget(item: GridsterItem) {
    this.dashboardWidgetItems.next(
      this.dashboardWidgetItems.value.filter(dashboardItem => dashboardItem.id !== item.id));
    setTimeout(() => (document.querySelector('gridster-preview') as HTMLElement).style.display = 'none');
  }

  public toggleGrid() {
    this.editMode.next(!this.editMode.value);
    this.options.resizable.enabled = !this.options.resizable.enabled;
    this.options.draggable.enabled = !this.options.draggable.enabled;
    this.options.api.optionsChanged();
    if (!this.editMode.value) {
      this.saveItems(this.dashboardWidgetItems.value);
    }
  }

}
