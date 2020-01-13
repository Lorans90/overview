import { Component, Input } from '@angular/core';
import { NvGridConstants, NvToolbarButton } from '../../../models/grid-config';

@Component({
  selector: 'nv-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() title: string;
  @Input() backgroundColor: string;
  @Input() toolbarButtons: NvToolbarButton[] = [];
  public readonly Constants = NvGridConstants;

  constructor() {
  }

  public runExternalToolbarButtonFunction(toolbarButton: NvToolbarButton): any {
    return toolbarButton.func;
  }
}
