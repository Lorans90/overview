import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightActionEmptyComponent } from './right-action-empty.component';
import { NvGridModule } from '../../grid.module';
import { FAKE_GridGlobalConfig } from '../../services/grid-api.config';

describe('RightActionEmptyComponent', () => {
  let component: RightActionEmptyComponent;
  let fixture: ComponentFixture<RightActionEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightActionEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
