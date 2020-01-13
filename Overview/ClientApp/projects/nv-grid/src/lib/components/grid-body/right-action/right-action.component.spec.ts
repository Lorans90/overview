/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightActionComponent } from './right-action.component';
import { NvGridModule } from '../../../grid.module';
import { FAKE_GridGlobalConfig } from '../../../services/grid-api.config';

describe('RightActionComponent', () => {
  let component: RightActionComponent;
  let fixture: ComponentFixture<RightActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
