import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  styleUrls: ['./circles.component.css']
})
export class CirclesComponent implements OnInit {

  progress1 = new BehaviorSubject<number>(0);
  progress2 = new BehaviorSubject<number>(0);
  progress3 = new BehaviorSubject<number>(0);
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    setInterval(() => {
      this.progress1.next(this.progress1.value + this.dataService.random(1, 4));
      this.progress2.next(this.progress2.value + this.dataService.random(2, 3));
      this.progress3.next(this.progress3.value + this.dataService.random(4, 6));
    }, 400);
  }

}
