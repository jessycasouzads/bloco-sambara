/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand color por defecto (Sambará). En multi-tenant esto se sobreescribe
        // dinámicamente con CSS variables desde el tenant config.
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        cream: '#fdf6f0',
        parchment: '#f7ebe0',
        ink: '#1a0e16',
        // Estados (no son brand-able, son universales)
        success: '#16a34a',
        warning: '#d97706',
        danger: '#e11d48',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        card: '0 6px 20px -10px rgba(112, 26, 77, 0.18)',
        'card-hover': '0 10px 28px -12px rgba(112, 26, 77, 0.28)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, rgb(var(--brand-500)) 0%, rgb(var(--brand-700)) 100%)',
      },
    },
  },
  plugins: [],
};
