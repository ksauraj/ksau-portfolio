import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0D0D0D',
        card: '#080808',
        border: '#1A1A1A',
        'border-hover': '#444444',
        muted: '#888888',
        'muted-dark': '#444444',
        fg: '#FFFFFF',
        'fg-dim': '#CCCCCC',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
