import { Component, Input, EventEmitter, Output } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { WidgetType } from 'src/app/pages/welcome/dashboard/dashboard.component';
import { wording } from 'src/app/core/wording';



@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent {
    WidgetType = WidgetType;
    wording = wording;
    @Input() items: GridsterItem[];
    @Input() editMode: boolean;
    @Input() options: GridsterConfig;
    @Output() deleteWidget: EventEmitter<number> = new EventEmitter<number>();
}
