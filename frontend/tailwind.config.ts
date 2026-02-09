import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // make sure all TSX files are scanned
  theme: {
    extend: {
      colors: {
        bg: '#EDE4D5',       // background / light
        primary: '#C24A48',  // accent / red
        text: '#1C0D0C',     // main text
        secondary: '#F5F0E8', // optional tertiary highlight
      },
    },
  },
  plugins: [],
};

export default config;
