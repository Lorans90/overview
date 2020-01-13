import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { customers } from 'src/data/customers';
import { customersGridConfig } from 'src/app/shared/config/customers.config';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit {

  dataSource = customers;
  gridConfig = customersGridConfig();
  constructor() { }

  ngOnInit() {
  }

}
