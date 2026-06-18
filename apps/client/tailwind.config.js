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
        'rs-color-green': 'var(--rs-color-green)',
        'rs-color-red': 'var(--rs-color-red)',
        'rs-color-text-1': 'var(--rs-color-text-1)',
        'rs-color-text-2': 'var(--rs-color-text-2)',
        'rs-color-text-3': 'var(--rs-color-text-3)',
        'rs-color-primary': 'var(--rs-color-primary)',
        'rs-alt-bg': 'var(--rs-color-text-3)',
        'rs-button-bg': 'var(--rs-button-bg-color)',
        'rs-button-border': 'var(--rs-button-border-color)',
        'rs-border-color-1': 'var(--rs-border-color-1)',
        'rs-border-color-2': 'var(--rs-border-color-2)',
      },
      fontSize: {
        'rs-font-size-title': 'var(--rs-font-size-title)',
        'rs-font-size-subtitle-1': 'var(--rs-font-size-subtitle-1)',
        'rs-font-size-subtitle-2': 'var(--rs-font-size-subtitle-2)',
        'rs-font-size-body-1': 'var(--rs-font-size-body-1)',
        'rs-font-size-body-2': 'var(--rs-font-size-body-2)',
        'rs-font-size-body-3': 'var(--rs-font-size-body-3)',
        'rs-font-size-small': 'var(--rs-font-size-small)',
      },
      spacing: {
        rs1: 'var(--rs-box-spacing-1)',
        rs2: 'var(--rs-box-spacing-2)',
      },
      maxWidth: {
        'rs-max-width': 'var(--rs-size-max-width)',
      },
      borderRadius: {
        fb: 'var(--rs-size-border-radius)',
      },
      boxShadow: {
        rs: 'var(--rs-size-box-shadow)',
        rs2: 'var(--rs-size-box-shadow-2)',
        rs3: 'var(--rs-size-box-shadow-3)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtitilites = {
        '.rs-competition-tab': {
          display: 'flex',
          'margin-top': '0.75rem',
          'padding-inline': '0.75rem',
          'padding-bottom': '1rem',
        },
      };

      addUtilities(newUtitilites);
    },
  ],
};
