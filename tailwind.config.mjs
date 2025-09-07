/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'code': ['Fira Code', 'monospace']
      },
      colors: {
        'github': {
          'bg': 'var(--bg-color)',
          'text': 'var(--text-color)',
          'accent': 'var(--accent-color)',
          'secondary': 'var(--secondary-color)',
          'hover': 'var(--hover-color)',
          'code-bg': 'var(--code-bg)',
          'muted': 'var(--muted-text)',
          'error': '#cf222e',
          'error-bg': '#ffebe9'
        }
      },
      fontSize: {
        'sm': '0.85rem',
        'base': '0.9rem'
      },
      lineHeight: {
        'relaxed': '1.6'
      }
    }
  },
  plugins: []
}
