import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridToolbarComponent } from './grid-toolbar.component';
import { NvGridModule } from '../../grid.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FAKE_GridGlobalConfig,
  GRID_GLOBAL_CONFIG
} from '../../services/grid-api.config';
import { GridDataService } from '../../services/grid-data.service';

describe('GridToolbarComponent', () => {
  let component: GridToolbarComponent;
  let fixture: ComponentFixture<GridToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig), HttpClientTestingModule],
      providers: [
        GridToolbarComponent,
        GridDataService,
        {
          provide: GRID_GLOBAL_CONFIG
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
