import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFilterComponent } from './grid-filter.component';
import { NvGridModule } from '../../grid.module';
import { FAKE_GridGlobalConfig } from '../../services/grid-api.config';

describe('GridFilterComponent', () => {
  let component: GridFilterComponent;
  let fixture: ComponentFixture<GridFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
