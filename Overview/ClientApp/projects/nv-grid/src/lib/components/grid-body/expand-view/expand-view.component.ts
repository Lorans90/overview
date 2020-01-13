import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DynamicComponentConfig } from '../../../models/grid-config';

@Component({
  selector: 'nv-expand-view',
  templateUrl: './expand-view.component.html',
  styleUrls: ['./expand-view.component.css']
})
export class ExpandViewComponent implements OnInit {
  @ViewChild('content', {
    static: true,
    read: ViewContainerRef
  }) public viewport: ViewContainerRef;
  @Input() public componentConfig: DynamicComponentConfig;
  private componentRef: ComponentRef<any> = null;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.destroyComponent();
    if (this.componentConfig) {
      this.componentRef = this.viewport.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(
          this.componentConfig.componentToPort
        )
      );

      const inputs = this.componentConfig.inputs;
      for (const key in inputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = inputs[key];
        }
      }

      const outputs = this.componentConfig.outputs;
      for (const key in outputs) {
        if (this.componentRef) {
          this.componentRef.instance[key] = outputs[key];
        }
      }
    }
  }

  closeExpandView() {
    this.destroyComponent();
  }

  destroyComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
