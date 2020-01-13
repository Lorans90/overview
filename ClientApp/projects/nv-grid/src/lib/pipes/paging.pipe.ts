import { Pipe, PipeTransform } from '@angular/core';
import { NvPagination } from '../models/grid-config';

@Pipe({
    name: 'paging',
    pure: true
})
export class PagingPipe implements PipeTransform {
    constructor() {

    }
    transform(array: any[], paging: NvPagination, usingUrl?: boolean): any[] {
        if (!usingUrl && array && array.length > 0) {
            return array.slice(
                paging.pageSize * (paging.pageNumber - 1),
                paging.pageSize * paging.pageNumber
            );

        }
        return array;
    }
}
