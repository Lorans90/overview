import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftActionEmptyComponent } from './left-action-empty.component';
import { NvGridModule } from '../../grid.module';
import { FAKE_GridGlobalConfig } from '../../services/grid-api.config';

describe('LeftActionEmptyComponent', () => {
  let component: LeftActionEmptyComponent;
  let fixture: ComponentFixture<LeftActionEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftActionEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
