import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        navy: 'hsl(var(--navy))',
        'navy-light': 'hsl(var(--navy-light))',
        'navy-dark': 'hsl(var(--navy-dark))',
        gold: 'hsl(var(--gold))',
        'gold-light': 'hsl(var(--gold-light))',
        'gold-dark': 'hsl(var(--gold-dark))',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Open Sans"', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
      },
      borderColor: {
        border: 'hsl(var(--border))', // ✅ added for border-border class
      },
      textColor: {
        'muted-foreground': 'hsl(var(--muted-foreground))', // optional if you use text-muted-foreground
      },
    },
  },
  plugins: [],
}

export default config