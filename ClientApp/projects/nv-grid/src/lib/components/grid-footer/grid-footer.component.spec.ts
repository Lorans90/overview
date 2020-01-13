import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFooterComponent } from './grid-footer.component';
import { NvGridModule } from '../../grid.module';
import { FAKE_GridGlobalConfig } from '../../services/grid-api.config';

describe('GridFooterComponent', () => {
  let component: GridFooterComponent;
  let fixture: ComponentFixture<GridFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)],
      declarations: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
