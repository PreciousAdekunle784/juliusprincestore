import type { Config } from "tailwindcss";

/**
 * Julius Prince Store — "the light meter"
 * Camera-body monochrome base + a single golden-hour amber accent.
 * These hex values mirror the CSS custom properties in app/globals.css.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",        // camera-body black (primary dark surface / text)
        charcoal: "#16161A",   // raised dark surface
        graphite: "#26262B",   // borders / dividers on dark
        slate: "#6C6C74",      // muted text
        mist: "#F5F5F4",       // light surface background
        paper: "#FFFFFF",
        accent: {
          DEFAULT: "#E8A13C",  // golden hour
          press: "#C9821E",    // pressed / hover
          tint: "#F6E4C7",     // soft amber wash
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        // precision-instrument radii — tight, not pill-shaped
        DEFAULT: "3px",
        lg: "5px",
        xl: "8px",
      },
      maxWidth: { screen: "1280px" },
      letterSpacing: { eyebrow: "0.18em" },
      keyframes: {
        "focus-lock": {
          "0%": { opacity: "0", transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "focus-lock": "focus-lock 0.5s cubic-bezier(0.2,0.8,0.2,1) both",
        "rise": "rise 0.6s cubic-bezier(0.2,0.8,0.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
