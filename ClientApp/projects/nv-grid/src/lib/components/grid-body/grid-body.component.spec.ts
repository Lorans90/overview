import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBodyComponent } from './grid-body.component';
import { NvGridModule } from '../../grid.module';
import { GridComponent } from '../grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FAKE_GridGlobalConfig,
  GRID_GLOBAL_CONFIG
} from '../../services/grid-api.config';

describe('GridBodyComponent', () => {
  let component: GridBodyComponent;
  let gridComponent: GridComponent;
  let fixture: ComponentFixture<GridBodyComponent>;
  let gridComponentFixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig), HttpClientTestingModule],
      providers: [GridComponent,
        {
          provide: GRID_GLOBAL_CONFIG
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    gridComponentFixture = TestBed.createComponent(GridComponent);
    gridComponent = gridComponentFixture.componentInstance;
    gridComponentFixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('Testing Method -> should select rows and emits output',
  //   () => {
  //     gridComponent.gridConfig = getGridConfig();
  //     gridComponent.rawRows = getDataSource();
  //     gridComponent.displayRows = getDataSource();
  //     gridComponent.toggleRowSelect(2, null);
  //
  //     expect(gridComponent.selectedRows.length).toBe(1);
  //   });
});
