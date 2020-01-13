import { Component, OnInit } from '@angular/core';
import { wording } from 'src/app/core/wording';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements OnInit {
  index = 1;
  disable = false;
  wording = wording;
  constructor() { }

  ngOnInit() {
  }

  onIndexChange(index: number): void {
    this.index = index;
  }
}
