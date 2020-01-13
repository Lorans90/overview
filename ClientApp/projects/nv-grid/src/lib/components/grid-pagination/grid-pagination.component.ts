import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { NvGridConstants, NvPagination } from '../../models/grid-config';

@Component({
  selector: 'nv-grid-pagination',
  templateUrl: './grid-pagination.component.html',
  styleUrls: ['./grid-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPaginationComponent implements OnChanges {
  @Input() totalItems: number;
  @Input() paging: NvPagination;
  @Input() backgroundColor: string;
  @Input() showQuickJumber = false;
  @Input() showTotalItems = true;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  public possiblePageSizes = [10, 25, 50, 100];
  currentPage = 1;
  pagesCount = 0;

  public readonly Constants = NvGridConstants;

  ngOnChanges(changes: SimpleChanges) {
    this.currentPage = this.paging.pageNumber;
    this.pagesCount = Math.ceil(this.totalItems / this.paging.pageSize) || 1;
    if (changes.totalItems) {
      if (this.pagesCount < this.paging.pageNumber) {
        this.currentPage = this.currentPage - 1;
        this.changePageNumber();
      }
    }
  }

  changePageNumber() {
    this.pageChanged.emit(this.currentPage);
  }

  changePageSize(newPageSize: number) {
    this.pageSizeChanged.emit(newPageSize);
  }

}
