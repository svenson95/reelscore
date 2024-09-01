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
      colors: {
        'fb-color-black-1': 'var(--fb-color-black-1)',
        'fb-color-black-2': 'var(--fb-color-black-2)',
        'fb-color-white': 'var(--fb-color-white)',
        'fb-color-white-2': 'var(--fb-color-white-2)',
        'fb-color-green-1': 'var(--fb-color-green-1)',
        'fb-color-green-1-light': 'var(--fb-color-green-1-light)',
        'fb-color-green-2': 'var(--fb-color-green-2)',
        'fb-color-text-1': 'var(--fb-color-text-1)',
        'fb-color-text-2': 'var(--fb-color-text-2)',
        'fb-win': 'var(--fb-color-win)',
        'fb-lose': 'var(--fb-color-lose)',
      },
      fontSize: {
        'fb-font-size-title': 'var(--fb-font-size-title)',
        'fb-font-size-subtitle-1': 'var(--fb-font-size-subtitle-1)',
        'fb-font-size-subtitle-2': 'var(--fb-font-size-subtitle-2)',
        'fb-font-size-body-1': 'var(--fb-font-size-body-1)',
        'fb-font-size-body-2': 'var(--fb-font-size-body-2)',
        'fb-font-size-small': 'var(--fb-font-size-small)',
      },
      spacing: {
        'fb-padding-1': 'var(--fb-padding-1)',
        'fb-padding-2': 'var(--fb-padding-2)',
        'fb-padding-3': 'var(--fb-padding-3)',
      },
      maxWidth: {
        'fb-max-width': 'var(--fb-size-max-width)',
      },
      borderRadius: {
        fb: 'var(--fb-size-border-radius)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtitilites = {
        '.fb-as-label': {
          background: 'white',
          '--mdc-outlined-button-disabled-label-text-color':
            'var(--fb-color-text-1)',
        },
      };

      addUtilities(newUtitilites);
    },
  ],
};
