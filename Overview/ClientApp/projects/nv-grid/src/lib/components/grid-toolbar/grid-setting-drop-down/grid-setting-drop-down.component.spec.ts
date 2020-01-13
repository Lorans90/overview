import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GridSettingDropDownComponent } from './grid-setting-drop-down.component';
import { NvGridModule } from '../../../grid.module';
import { FAKE_GridGlobalConfig } from '../../../services/grid-api.config';

describe('GridSettingDropDownComponent', () => {
  let component: GridSettingDropDownComponent;
  let fixture: ComponentFixture<GridSettingDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettingDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
