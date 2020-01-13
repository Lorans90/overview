import { Injectable } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NvColumnConfig } from '../models/grid-config';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  orderElementsInArrayUsingKeys(array: any[], previousKey: string, newKey: string): any[] {
    const prevIndex = array.findIndex(element => element.key === previousKey);
    const newIndex = array.findIndex(element => element.key === newKey);

    if (newIndex > prevIndex) {
      const movedColumn = array[prevIndex];
      for (let i = prevIndex; i < newIndex; i++) {
        array[i] = array[i + 1];
      }
      array[newIndex] = movedColumn;
    } else if (newIndex < prevIndex) {
      const movedColumn = array[prevIndex];
      for (let i = prevIndex; i > newIndex; i--) {
        array[i] = array[i - 1];
      }
      array[newIndex] = movedColumn;
    }

    return array;
  }

  public dragEndEvent(
    event: CdkDragDrop<string[]>,
    gridConfigColumns: NvColumnConfig[],
    columnsToGetKeyFrom: NvColumnConfig[]
  ): any[] {
    /**
     * update the main columns array gridConfig.columns.
     */

    return this.orderElementsInArrayUsingKeys(
      gridConfigColumns,
      columnsToGetKeyFrom[event.previousIndex].key,
      columnsToGetKeyFrom[event.currentIndex].key,
    );
  }
}
