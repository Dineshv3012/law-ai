export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'background': '#081425',
        'surface': '#081425',
        'surface-dim': '#081425',
        'surface-container-lowest': '#040e1f',
        'surface-container-low': '#111c2d',
        'surface-container': '#152031',
        'surface-container-high': '#1f2a3c',
        'surface-container-highest': '#2a3548',
        'surface-bright': '#2f3a4c',
        'surface-variant': '#2a3548',
        'on-surface': '#d8e3fb',
        'on-surface-variant': '#c7c4d7',
        'on-background': '#d8e3fb',
        'inverse-surface': '#d8e3fb',
        'outline': '#908fa0',
        'outline-variant': '#464554',
        'primary': '#c0c1ff',
        'on-primary': '#1000a9',
        'primary-container': '#8083ff',
        'on-primary-container': '#0d0096',
        'primary-fixed': '#e1e0ff',
        'primary-fixed-dim': '#c0c1ff',
        'secondary': '#ffb95f',
        'on-secondary': '#472a00',
        'secondary-container': '#ee9800',
        'on-secondary-container': '#5b3800',
        'tertiary': '#4edea3',
        'on-tertiary': '#003824',
        'tertiary-container': '#00885d',
        'error': '#ffb4ab',
        'error-container': '#93000a',
        'surface-tint': '#c0c1ff',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'headline': ['Inter', 'sans-serif'],
        'body': ['"Source Sans 3"', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
