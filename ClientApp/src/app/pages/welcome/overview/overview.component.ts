import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { columns } from 'src/app/shared/config/customers.config';
import { customers } from 'src/data/customers';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit {

    dataSource$ = of(customers);
    columns = columns;
    constructor() { }

    ngOnInit() {
    }
}
