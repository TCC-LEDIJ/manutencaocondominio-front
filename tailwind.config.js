/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        status: {
          success: '#639922',
          warning: '#EF9F27',
          danger: '#E24B4A',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 20px 45px -28px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(25, 83, 95, 0.16), transparent 35%), radial-gradient(circle at 80% 20%, rgba(239, 159, 39, 0.14), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.96))',
      },
    },
  },
  plugins: [],
}