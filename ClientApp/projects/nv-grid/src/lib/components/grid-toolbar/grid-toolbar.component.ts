import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NvGridConfig, NvToolbarButton } from '../../models/grid-config';
import { GridDataService } from '../../services/grid-data.service';
import { DOCUMENT } from '@angular/common';
import { ConfigurationService } from '../../services/configuration.service';
import { GridUtilsService } from '../../services/grid-utils.service';

@Component({
  selector: 'nv-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.css']
})

export class GridToolbarComponent implements OnInit {
  @Input() width: number;
  @Input() gridConfig: NvGridConfig;
  @Output() refresh = new EventEmitter<void>();
  @Output() public gridConfigChangedOnSave = new EventEmitter<void>();
  @Output() public gridConfigChangedOnReset = new EventEmitter<void>();
  @Output() public modifiedRowsOnSave = new EventEmitter<{}>();
  @Output() public createNewRow = new EventEmitter<void>();
  @Output() public export = new EventEmitter<void>();

  constructor(
    private gridDataService: GridDataService,
    public configurationService: ConfigurationService,
    public gridUtilsService: GridUtilsService,
    @Inject(DOCUMENT) private document: any
  ) {
  }

  ngOnInit() {
    if (this.gridConfig) {
      if (!this.gridConfig.hideRefreshButton) {
        const refreshButton = {
          title: 'refresh',
          tooltip: 'refresh',
          icon: 'reload',
          func: this.gridConfig.customDataSourceRefreshFunction ? this.gridConfig.customDataSourceRefreshFunction :
            () => this.refresh.emit()
        };
        const foundRefreshButton = this.gridConfig.toolbarButtons.find(toolbarbutton => toolbarbutton.title === refreshButton.title);
        if (!foundRefreshButton) {
          this.gridConfig.toolbarButtons.push(refreshButton);
        }
      }

      if (this.gridConfig.editForm.allowCreateNewRow && !this.gridConfig.editForm.disableEditColumns) {
        if (this.gridConfig.editForm.showCreateNewRowButton) {
          this.gridConfig.toolbarButtons.unshift({
            title: 'new',
            tooltip: 'createNew',
            icon: 'plus-circle-o',
            func: () => this.createNewRow.emit()
          });
        }
      }

      if (this.gridConfig.showExcelButton) {
        const excel: NvToolbarButton = {
          title: 'downloadAsExcel',
          tooltip: 'downloadAsExcel',
          icon: 'file-excel',
          func: () => this.export.emit()
        };
        this.gridConfig.toolbarButtons.unshift(excel);
      }

      if (this.gridConfig.excelExportUrl) {
        this.gridConfig.toolbarButtons.push({
          title: 'Excel',
          tooltip: 'downloadAsExcel',
          icon: 'windows',
          func: {
            action$: () => this.gridDataService.downloadAsExcel(this.gridConfig),
            subscribe: (res) => this.showBlob(res[0], res[1])
          }
        });
      }
      if (this.gridConfig.pdfExportUrl) {
        this.gridConfig.toolbarButtons.push({
          title: 'PDF',
          tooltip: 'downloadAsPdf',
          icon: 'file-pdf',
          func: {
            action$: () => this.gridDataService.downloadAsPdf(this.gridConfig),
            subscribe: (res) => this.showBlob(res[0], res[1])
          }
        });
      }
    }
  }

  private showBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;

    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
  }
}
