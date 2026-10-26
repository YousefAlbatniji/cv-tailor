/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(60px,-50px) scale(1.15)" },
          "66%": { transform: "translate(-40px,40px) scale(0.92)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r,0deg))" },
          "50%": { transform: "translateY(-22px) rotate(var(--r,0deg))" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pop: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "70%": { transform: "scale(1.15)", opacity: 1 },
          "100%": { transform: "scale(1)" },
        },
        shine: {
          from: { transform: "translateX(-120%)" },
          to: { transform: "translateX(220%)" },
        },
      },
      animation: {
        blob: "blob 18s ease-in-out infinite",
        "blob-slow": "blob 26s ease-in-out infinite reverse",
        floaty: "floaty 7s ease-in-out infinite",
        "fade-up": "fadeUp .8s cubic-bezier(.2,.7,.2,1) both",
        "gradient-x": "gradientShift 6s ease infinite",
        pop: "pop .6s cubic-bezier(.2,.9,.3,1.3) both",
        shine: "shine 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
