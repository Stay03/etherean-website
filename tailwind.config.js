/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'urbanist': ['Urbanist', 'sans-serif'],
        'questrial': ['Questrial', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            'table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'table th': {
              backgroundColor: '#FEF3C7',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
              borderBottom: '2px solid #F59E0B',
              color: '#92400E',
            },
            'table td': {
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #E5E7EB',
              verticalAlign: 'top',
            },
            'table tr:hover': {
              backgroundColor: '#FFFBEB',
            },
            'table tr:nth-child(even)': {
              backgroundColor: '#FEFCE8',
            },
          },
        },
        amber: {
          css: {
            '--tw-prose-body': '#374151',
            '--tw-prose-headings': '#92400E',
            '--tw-prose-lead': '#374151',
            '--tw-prose-links': '#D97706',
            '--tw-prose-bold': '#92400E',
            '--tw-prose-counters': '#92400E',
            '--tw-prose-bullets': '#92400E',
            '--tw-prose-hr': '#E5E7EB',
            '--tw-prose-quotes': '#374151',
            '--tw-prose-quote-borders': '#F59E0B',
            '--tw-prose-captions': '#6B7280',
            '--tw-prose-code': '#92400E',
            '--tw-prose-pre-code': '#374151',
            '--tw-prose-pre-bg': '#FEF3C7',
            '--tw-prose-th-borders': '#F59E0B',
            '--tw-prose-td-borders': '#E5E7EB',
            'table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'table th': {
              backgroundColor: '#FEF3C7',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontWeight: '600',
              borderBottom: '2px solid #F59E0B',
              color: '#92400E',
            },
            'table td': {
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #E5E7EB',
              verticalAlign: 'top',
            },
            'table tr:hover': {
              backgroundColor: '#FFFBEB',
            },
            'table tr:nth-child(even)': {
              backgroundColor: '#FEFCE8',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}