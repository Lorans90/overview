import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridHeaderComponent } from './grid-header.component';
import { NvGridModule } from '../../grid.module';
import { FAKE_GridGlobalConfig } from '../../services/grid-api.config';

describe('GridHeaderComponent', () => {
  let component: GridHeaderComponent;
  let fixture: ComponentFixture<GridHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
