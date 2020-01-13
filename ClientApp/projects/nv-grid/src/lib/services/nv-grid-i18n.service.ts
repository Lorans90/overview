import { Inject, Injectable } from '@angular/core';
import { GRID_GLOBAL_CONFIG } from '../services/grid-api.config';
import { BehaviorSubject } from 'rxjs';
import { de_DE, en_US, NzI18nService } from 'ng-zorro-antd';
import { GridLanguage, GridLocale } from '../models/grid-config';

export interface NvGridI18nInterface {
  gridLanguage?: GridLanguage;
  gridLocale?: GridLocale;
}

@Injectable({
  providedIn: 'root'
})
export class NvGridI18nService {
  private configuration: BehaviorSubject<NvGridI18nInterface> = new BehaviorSubject<NvGridI18nInterface>({
    gridLanguage: 'de',
    gridLocale: 'de-DE',
  });

  public configuration$ = this.configuration.asObservable();

  // inject gotten tokens from forRoot()
  constructor(
    @Inject(GRID_GLOBAL_CONFIG) private gridGlobalConfig,
    private nzI18n: NzI18nService
  ) {
    if (this.gridGlobalConfig) {
      this.setConfiguration(
        {
          gridLanguage: this.gridGlobalConfig.gridLanguage,
          gridLocale: this.gridGlobalConfig.locale
        });
    }
  }

  get getConfiguration(): NvGridI18nInterface {
    return this.configuration.value;
  }

  setConfiguration(configuration: NvGridI18nInterface): void {
    this.configuration.next(configuration);
    this.nzI18n.setLocale(
      configuration.gridLanguage === 'en'
        ? en_US
        : de_DE
    );
  }
}
