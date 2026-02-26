import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Brand Colors ───────────────────────────────────────────────
      colors: {
        cream:      { DEFAULT: '#F7E8C8', dark: '#1A1612' },
        navy:       { DEFAULT: '#1A2B3C', dark: '#0D161F' },
        amber:      { DEFAULT: '#E8A820', dark: '#C48E18' },
        terracotta: { DEFAULT: '#C4622D', dark: '#A3501F' },
      },

      // ─── Brand Fonts ────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },

      // ─── Semantic tokens (CSS vars from globals.css) ────────────────
      backgroundColor: {
        base:    'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
      },
      textColor: {
        base:    'hsl(var(--foreground))',
        muted:   'hsl(var(--muted-foreground))',
        accent:  'hsl(var(--accent))',
      },
      borderColor: {
        base: 'hsl(var(--border))',
      },

      // ─── Animation ──────────────────────────────────────────────────
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee:    'marquee 30s linear infinite',
        float:      'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'fade-up':  'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
