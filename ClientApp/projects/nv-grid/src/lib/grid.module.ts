import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  registerLocaleData
} from '@angular/common';
import { GridComponent } from './components/grid.component';
import { GridCellComponent } from './components/grid-body/grid-cell/grid-cell.component';
import { FilterCellComponent } from './components/grid-filter/filter-cell/filter-cell.component';
import { GridPaginationComponent } from './components/grid-pagination/grid-pagination.component';
import { ResizeableColumnDirective } from './directives/resizeable-column.directive';
import { GridSettingDropDownComponent } from './components/grid-toolbar/grid-setting-drop-down/grid-setting-drop-down.component';
import { LeftActionComponent } from './components/grid-body/left-action/left-action.component';
import { RightActionComponent } from './components/grid-body/right-action/right-action.component';
import { de_DE, en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { NvButtonModule } from 'nv-button/src/public_api';
import { ToolbarComponent } from './components/grid-toolbar/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ExpandViewComponent } from './components/grid-body/expand-view/expand-view.component';
import { GridToolbarComponent } from './components/grid-toolbar/grid-toolbar.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { LeftActionEmptyComponent } from './components/left-action-empty/left-action-empty.component';
import { RightActionEmptyComponent } from './components/right-action-empty/right-action-empty.component';
import { GridFilterComponent } from './components/grid-filter/grid-filter.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GridBodyComponent } from './components/grid-body/grid-body.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { GeneratePipe } from './pipes/generate.pipe';
import { PagingPipe } from './pipes/paging.pipe';
import { GRID_GLOBAL_CONFIG, GridGlobalConfig } from './services/grid-api.config';
import { LoadingComponent } from './components/loading/loading.component';
import { ColumnTemplateDirective } from './directives/column-template.directive';
import { ColumnEditTemplateDirective } from './directives/column-edit-template.directive';
import { ColumnInputDirective } from './directives/column-input.directive';
import { GridCellEditingComponent } from './components/grid-body/grid-cell/grid-cell-editing/grid-cell-editing.component';
import { ObjectFirstElementPipe } from './pipes/object-first-element.pipe';
import localeDE from '@angular/common/locales/de';
import localeUK from '@angular/common/locales/en-GB';

registerLocaleData(localeDE);
registerLocaleData(localeUK);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    DragDropModule,
    NvButtonModule
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    GeneratePipe,
    PagingPipe,
    ObjectFirstElementPipe
  ],
  exports: [
    GridComponent,
    ToolbarComponent,
    ColumnTemplateDirective,
    ColumnInputDirective,
    ColumnTemplateDirective,
    ColumnEditTemplateDirective
  ],
  declarations: [
    GridComponent,
    GridCellComponent,
    FilterCellComponent,
    GridPaginationComponent,
    ResizeableColumnDirective,
    GridSettingDropDownComponent,
    LeftActionComponent,
    RightActionComponent,
    ToolbarComponent,
    ExpandViewComponent,
    GridToolbarComponent,
    GridHeaderComponent,
    GridFilterComponent,
    LeftActionEmptyComponent,
    RightActionEmptyComponent,
    GridFooterComponent,
    GridBodyComponent,
    LoadingComponent,
    TranslatePipe,
    GeneratePipe,
    PagingPipe,
    ObjectFirstElementPipe,
    ColumnInputDirective,
    GridCellEditingComponent,
    ColumnTemplateDirective,
    ColumnEditTemplateDirective,
  ]
})
export class NvGridModule {
  static forRoot(gridGlobalConfig: GridGlobalConfig): ModuleWithProviders {
    return {
      ngModule: NvGridModule,
      providers: [
        {
          provide: GRID_GLOBAL_CONFIG,
          useValue: gridGlobalConfig
        },
        {
          provide: NZ_I18N,
          useValue: gridGlobalConfig.locale === 'en-US'
            ? en_US
            : de_DE
        }
      ]
    };
  }
}
