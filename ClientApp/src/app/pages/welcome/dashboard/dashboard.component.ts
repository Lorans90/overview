import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { WidgetType } from 'src/app/shared/enums/widgets.enum';
import { Widget } from 'src/app/shared/models/widget.model';
import { DataService } from 'src/app/shared/services/data.service';
import * as uuid from 'uuid';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})


export class DashboardComponent implements OnInit, OnDestroy {
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
        { icon: 'ant-cloud', name: 'Weather', type: WidgetType.Weather },
        { icon: 'clock-circle', name: 'Clock', type: WidgetType.Clock },
        { icon: 'book', name: 'Bookmark', type: WidgetType.Bookmark },
        { icon: 'unordered-list', name: 'Todo', type: WidgetType.Todo },
        { icon: 'dollar', name: 'Currency', type: WidgetType.Currency },
        { icon: 'swap', name: 'Bars', type: WidgetType.Bars },
        { icon: 'fast-forward', name: 'Steps', type: WidgetType.Steps },
        { icon: 'pie-chart', name: 'Circles', type: WidgetType.Circles },
        { icon: 'bar-chart', name: 'Chart', type: WidgetType.Chart },
        { icon: 'unordered-list', name: 'Feed', type: WidgetType.Feed },


    ];
    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.dashboardWidgetItems.subscribe(items => this.saveItems(items));
        // this.dataService.startConnection();
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

    ngOnDestroy() {
        this.dataService.stopConnection();
    }
}
