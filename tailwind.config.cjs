module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        indigo: {
          500: '#4f46e5',
          600: '#4338ca'
        },
        primary: {
          from: '#4f46e5',
          to: '#4338ca'
        },
        accent: {
          purple: '#8B5CF6',
          green: '#10B981',
          blue: '#3B82F6'
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0'
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.05)',
        floating: '0 4px 10px rgba(0,0,0,0.03)'
      }
    },
  },
  plugins: [],
}
