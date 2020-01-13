import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftActionComponent } from './left-action.component';
import { NvGridModule } from '../../../grid.module';

import { getDataSource } from '../../../../../test/dataSource';
import { getGridConfig } from '../../../../../test/gridConfig';
import { FAKE_GridGlobalConfig } from '../../../services/grid-api.config';
import { NvGridButtonsPosition } from '../../../models/grid-config';

describe('LeftActionComponent', () => {
  let component: LeftActionComponent;
  let fixture: ComponentFixture<LeftActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvGridModule.forRoot(FAKE_GridGlobalConfig)],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the checkbox and toggleRow', () => {

    component.rowIndex = 4;
    component.row = getDataSource()[component.rowIndex];
    component.rowSelectType = getGridConfig().rowSelectionType;
    component.showMenuButton = getGridConfig().rowButtonsPosition === NvGridButtonsPosition.CollapsedLeft;
    component.showExpandButton = getGridConfig().expandableComponentConfig;
    component.showRowIndex = getGridConfig().showRowIndex;
    component.paging = getGridConfig().paging;
    // component.row['_checked'] = false;
    fixture.detectChanges();


    // const div = fixture.nativeElement.querySelector('.grid-cell-left-action');
    // const input = fixture.nativeElement.querySelector('input');
    // div.dispatchEvent(new Event('click'));
    spyOn(component.selectRow, 'emit');
    component.selectRowAction(null);
    // input.click();
    fixture.detectChanges();
    // console.log(component.row);
    // expect(input.checked).toBeTruthy();
    // expect(component.row['_checked']).toBeTruthy();
    expect(component.selectRow.emit).toHaveBeenCalled();

  });
});
