import { InjectionToken } from '@angular/core';

export interface GridGlobalConfig {
  apiEndpoint?: string;
  language?: string;
  locale?: string;
}

export let GRID_GLOBAL_CONFIG = new InjectionToken<GridGlobalConfig>('GridGlobalConfig');


export const FAKE_GridGlobalConfig: GridGlobalConfig = {
  apiEndpoint: '',
  language: 'en',
  locale: 'en-Us'
};
