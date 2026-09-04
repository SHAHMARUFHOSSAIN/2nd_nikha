import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blush: '#FDF2F8',
          blushLight: '#FFF1F2',
          pinkSoft: '#FCE7F3',
          pink: '#EC4899',
          pinkHot: '#DB2777',
          pinkDark: '#BE185D',
          rose: '#E11D48',
          roseHover: '#9F1239',
          wine: '#831843',
          wineDark: '#500724',
          wineHover: '#701A75',
          textMain: '#1C1917',
          textMuted: '#78716C',
          borderSoft: '#FBCFE8',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -5px rgba(236, 72, 153, 0.25)',
        'pink-glow': '0 12px 35px -8px rgba(219, 39, 119, 0.35)',
        'card-hover': '0 20px 40px -15px rgba(236, 72, 153, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
