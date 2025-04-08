import { registerLocaleData } from '@angular/common';
import * as de from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';

export const LOCALE_PROVIDER = { provide: LOCALE_ID, useValue: 'de-DE' };
registerLocaleData(de.default);
