import { Pipe, PipeTransform } from '@angular/core';
import { NvColumnConfig } from '../models/grid-config';
import { GridUtilsService } from '../services/grid-utils.service';
import { NvGridI18nInterface } from '../services/nv-grid-i18n.service';

@Pipe({
  name: 'generate',
  pure: true
})
export class GeneratePipe implements PipeTransform {

  constructor(private gridUtilsService: GridUtilsService) { }

  transform(value: any, column: NvColumnConfig, row: any, config: NvGridI18nInterface): string {
    return this.gridUtilsService.generateDisplayValue(column, value, row, config, false);
  }
}
