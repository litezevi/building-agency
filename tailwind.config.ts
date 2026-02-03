import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffeadd',
          200: '#ffd0bb',
          300: '#ffab88',
          400: '#ff7d4d',
          500: '#ff5722',
          600: '#e64a19',
          700: '#bf360c',
          800: '#9a2807',
          900: '#7d1f07',
        },
        accent: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8daff',
          300: '#7eb8ff',
          400: '#4b96ff',
          500: '#2b7bff',
          600: '#1866e6',
          700: '#1252b4',
          800: '#12468c',
          900: '#153d71',
        },
        secondary: {
          50: '#f7f7f7',
          100: '#eaeaea',
          200: '#d4d4d4',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6b6b6b',
          600: '#5a5a5a',
          700: '#4a4a4a',
          800: '#3d3d3d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;