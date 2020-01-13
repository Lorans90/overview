import { Component, Input, OnInit } from '@angular/core';

export interface NvLoadingBar {
  top: number;
  strokeWidth: number;
}

@Component({
  selector: 'nv-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() loading = false;
  @Input() showProgressbar = false;
  @Input() progressbarTop = 0;
  @Input() paragraphSize = 10;

  public readonly Array = Array;

  constructor() {
  }

  ngOnInit() {
  }

}
