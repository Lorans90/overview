import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { GoogleChartComponent } from 'angular-google-charts';
import { DataService } from 'src/app/shared/services/data.service';
import { GridsterItem } from 'angular-gridster2';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

export interface Machine {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('googlechart', { static: true })

  @Input() widget: GridsterItem;
  @Input() machineId: string;
  private componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private dataService: DataService) { }

  machines: Machine[] = [
    { id: 'machine1', name: 'Machine 1' },
    { id: 'machine2', name: 'Machine 2' },
    { id: 'machine3', name: 'Machine 3' },
    { id: 'machine4', name: 'Machine 4' }
  ];

  current: Machine;
  value = 0;
  googlechart: GoogleChartComponent;
  chart = {
    title: 'Yo',
    type: 'Gauge',
    data: [
      ['', this.value],
    ],
    options: {
      greenFrom: 0,
      greenTo: 60,
      redFrom: 85,
      redTo: 100,
      yellowFrom: 60,
      yellowTo: 85,
      minorTicks: 5
    }
  };

  ngOnInit() {
    if (this.widget.data) {
      this.current = this.machines.find(machine => machine.id === this.widget.data);
      this.subscribe();
    }
  }

  subscribe() {
    this.dataService.dataSubject.pipe(
      takeUntil(this.componentDestroyed$)
    )
      .subscribe(data => this.update(data[this.current.id]));
  }

  update(value: number) {
    this.chart = {
      ...this.chart,
      data: [
        [this.current.name, value]
      ]
    };
  }

  choose(machine: Machine) {
    this.current = machine;
    this.subscribe();
    this.widget.data = machine.id;
    localStorage.setItem('dashboard', JSON.stringify(
      [...this.getWidgetInfo().filter(widget => widget.id !== this.widget.id),
      this.widget
      ])
    );
  }

  getWidgetInfo(): GridsterItem[] {
    return JSON.parse(localStorage.getItem('dashboard'));
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

}


