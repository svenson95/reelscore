const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      screens: {
        xs: '600px',
      },
      flex: {
        2: '2 2 0%',
      },
      colors: {
        'rs-color-white': 'var(--rs-color-white)',
        'rs-color-white-2': 'var(--rs-color-white-2)',
        'rs-color-green-1': 'var(--rs-color-green-1)',
        'rs-color-text-1': 'var(--rs-color-text-1)',
        'rs-color-text-2': 'var(--rs-color-text-2)',
        'rs-color-text-3': 'var(--rs-color-text-3)',
        'rs-color-orange': 'var(--rs-color-orange)',
      },
      fontSize: {
        'rs-font-size-title': 'var(--rs-font-size-title)',
        'rs-font-size-subtitle-1': 'var(--rs-font-size-subtitle-1)',
        'rs-font-size-subtitle-2': 'var(--rs-font-size-subtitle-2)',
        'rs-font-size-body-1': 'var(--rs-font-size-body-1)',
        'rs-font-size-body-2': 'var(--rs-font-size-body-2)',
        'rs-font-size-small': 'var(--rs-font-size-small)',
      },
      spacing: {
        'rs-padding-1': 'var(--rs-padding-1)',
        'rs-padding-2': 'var(--rs-padding-2)',
        'rs-padding-3': 'var(--rs-padding-3)',
      },
      maxWidth: {
        'rs-max-width': 'var(--rs-size-max-width)',
      },
      borderRadius: {
        fb: 'var(--rs-size-border-radius)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtitilites = {
        '.rs-as-label': {
          background: 'white',
          '--mdc-outlined-button-disabled-label-text-color':
            'var(--rs-color-text-1)',
        },
        '.rs-bg-color': {
          background: 'var(--mat-sys-surface)',
        },
      };

      addUtilities(newUtitilites);
    },
  ],
};
