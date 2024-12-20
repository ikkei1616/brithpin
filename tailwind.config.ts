import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        customBackGround: "url('/tree.svg')",
        customSpecialSpring: "url('/birthpin.svg'), url('/textspecialday.svg')",
        customSpecialSummer: "url('/birthpinsummer.svg'), url('/textspecialday.svg')",
        customSpecialAutumn: "url('/birthpinautumn.svg'), url('/textspecialday.svg')",
        customSpecialWinter: "url('/birthpinwinter.svg'), url('/textspecialday.svg')",
      },
      screens: {
        'xs': '375px',
        'md': '430px',
        'lg': '767px',
        'xl': '1023px',
      },
    },

    fontFamily: {
      sans: ["Noto Sans JP", "sans-serif"],
      serif: ["Noto Serif JP", "serif"],
      aboreto: ["Aboreto", "serif"],
    },

    colors: {
      hiyokoyellow: "#FFF964",
      yellow:"#FFFB92",
      orange:"#FF9979",
      cream:"#FFFEE3",
      cream2:"#FEFEF3",
      color:"#FFFFFA",
      mainpink:"#FEB69F",
      mainpinklight:"#FFDFD5",
      textbrawn:"#644C44",
      textbrawnlight:"#8D6A5F",
      placeholderpink:"#FFF6F3",
      backgroundcolor:"#FFFEFA",
      shadowgray:"#F2F1ED",
      summerbackground:"#FCFFF3",
      autumnbackground:"#FBF1E7",
      winterbackground:"#F9FFFF",
    },

    backgroundImage:{
      birthpin:"url('/birthpin.svg')",
      birthtree:"url('/birthtree-spring.svg')",
      getuphiyoko:"url('/getuphiyoko.svg')",
      sleephiyoko:"url('/sleephiyoko.svg')",
      textspecialday:"url('/textspecialday.svg')",
      usericonshadow:"url('/usericonshadow.svg')",     
    },
  },
  plugins: [],
};
export default config;
