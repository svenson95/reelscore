import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

export const MATERIAL_TOOLTIP_DEFAULT_OPTIONS_PROVIDER = {
  provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
  useValue: {
    showDelay: 400,
    hideDelay: 0,
    touchGestures: 'auto',
    touchendHideDelay: 2000,
  },
};
