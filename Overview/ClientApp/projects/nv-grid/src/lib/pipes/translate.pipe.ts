import { Pipe, PipeTransform } from '@angular/core';
import { de, en } from '../languages/translations';
import { NvGridI18nService } from '../services/nv-grid-i18n.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private oldValue: any;
  private newValue: any;
  constructor(private nvGridI18nService: NvGridI18nService) {

  }

  private get translations() {
    switch (this.nvGridI18nService.getConfiguration.gridLanguage) {
      case 'en':
        return en;
      default:
        return de;
    }
  }

  transform(key: any): any {
    this.newValue = key !== undefined && key !== null
      ? key[this.nvGridI18nService.getConfiguration.gridLanguage]
      || this.translations[key]
      || key
      : '';

    if (this.newValue !== this.oldValue) {
      this.oldValue = this.newValue;
      return this.newValue;
    }
    return this.oldValue;
  }
}
