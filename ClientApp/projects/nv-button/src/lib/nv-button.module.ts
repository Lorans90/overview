import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NvButtonComponent } from './component/nv-button.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [
    NvButtonComponent
  ],
  declarations: [
    NvButtonComponent
  ]
})
export class NvButtonModule {}

