import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      fontFamily: {
        'Inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: "#8043cc",
        secondary: "#e3d1f9",
        third: '#f1e8fc', //e6d6f9
        info: "#6b7280",
        like: '#cf79f2',

      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
