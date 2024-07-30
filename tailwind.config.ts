import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        nifty: {
          black: "#1a1a1a",
          white: "#eeeeee",
          gray: {
            1: '#a5a5a5',
            2: '#757575'
          }
        }
      },
      // shadow
      boxShadow: {
        'search': '0px 4px 10px rgba(0, 0, 0, 0.20)',
        'book': '-20px 10px 10px rgba(0, 0, 0, 0.15)',
      },
    },

  },
  plugins: [],
};
export default config;
