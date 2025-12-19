/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'retro-panel',
    'bg-cyan-500', 'to-cyan-600',
    'bg-amber-500', 'to-amber-600',
    'bg-fuchsia-500', 'to-fuchsia-600',
    'bg-emerald-500', 'to-emerald-600',
    'bg-red-500', 'to-red-600',
    'text-slate-700', 'text-slate-400', // Common text colors
    'border-gray-300', 'border-gray-400', // Common border colors
  ],
  theme: {
    extend: {
      fontFamily: {
        'jetbrains-mono': ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}