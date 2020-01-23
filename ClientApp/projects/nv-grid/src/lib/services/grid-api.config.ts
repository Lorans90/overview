import { InjectionToken } from '@angular/core';
import { GridLanguage, GridLocale } from '../models/grid-config';

export interface GridGlobalConfig {
  apiEndpoint?: string;
  language?: GridLanguage;
  locale?: GridLocale;
}

export let GRID_GLOBAL_CONFIG = new InjectionToken<GridGlobalConfig>('GridGlobalConfig');


export const FAKE_GridGlobalConfig: GridGlobalConfig = {
  apiEndpoint: '',
  language: 'en',
  locale: 'en-US'
};
