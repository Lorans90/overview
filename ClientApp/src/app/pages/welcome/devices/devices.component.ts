import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/shared/models/device.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  devices: Device[] = [];
  constructor() { }

  ngOnInit() {
  }

}
