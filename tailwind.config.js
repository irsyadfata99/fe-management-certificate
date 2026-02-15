/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // =========================================================
      // TYPOGRAPHY — Poppins
      // =========================================================
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "ui-sans-serif", "sans-serif"],
      },

      // =========================================================
      // COLOR PALETTE
      // =========================================================
      colors: {
        // Primary: Cornflower Blue
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6495ED", // brand — Cornflower Blue
          600: "#4f72d4",
          700: "#3b55b0",
          800: "#2d3f8a",
          900: "#1e2b65",
          950: "#111844",
        },

        // Accent: Magenta
        accent: {
          50: "#fff0ff",
          100: "#ffe0ff",
          200: "#ffc0ff",
          300: "#ff90ff",
          400: "#ff50ff",
          500: "#FF00FF", // brand — Magenta
          600: "#dd00dd",
          700: "#b800b8",
          800: "#920092",
          900: "#6b006b",
          950: "#450045",
        },

        // Neutrals: Slate (blue-tinted, fits the bg perfectly)
        neutral: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9", // light mode bg
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a", // dark mode bg — Deep Navy
          950: "#020617",
        },

        // Semantic
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fefce8",
          100: "#fef9c3",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },

      // =========================================================
      // BORDER RADIUS — Bento Grid style
      // =========================================================
      borderRadius: {
        none: "0px",
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px", // bento cards
        xl: "20px",
        "2xl": "24px", // hero bento
        "3xl": "32px",
        full: "9999px",
      },

      // =========================================================
      // BOX SHADOW — Glassmorphism
      // =========================================================
      boxShadow: {
        // Light mode glass (Cornflower Blue tint)
        "glass-xs": "0 1px 4px rgba(100,149,237,0.06)",
        "glass-sm":
          "0 2px 8px rgba(100,149,237,0.08), 0 1px 3px rgba(100,149,237,0.06)",
        glass:
          "0 4px 16px rgba(100,149,237,0.12), 0 2px 6px rgba(100,149,237,0.08)",
        "glass-md":
          "0 6px 24px rgba(100,149,237,0.14), 0 3px 10px rgba(100,149,237,0.09)",
        "glass-lg":
          "0 8px 32px rgba(100,149,237,0.16), 0 4px 12px rgba(100,149,237,0.10)",
        "glass-xl":
          "0 16px 48px rgba(100,149,237,0.20), 0 8px 24px rgba(100,149,237,0.12)",

        // Dark mode glass
        "glass-dark-sm":
          "0 2px 8px rgba(0,0,0,0.30), 0 1px 3px rgba(0,0,0,0.20)",
        "glass-dark": "0 4px 16px rgba(0,0,0,0.40), 0 2px 6px rgba(0,0,0,0.28)",
        "glass-dark-lg":
          "0 8px 32px rgba(0,0,0,0.50), 0 4px 12px rgba(0,0,0,0.35)",

        // Glow effects
        "glow-primary":
          "0 0 20px rgba(100,149,237,0.35), 0 0 40px rgba(100,149,237,0.15)",
        "glow-accent":
          "0 0 20px rgba(255,0,255,0.25),  0 0 40px rgba(255,0,255,0.10)",
        "glow-cta":
          "0 4px 20px rgba(100,149,237,0.40), 0 2px 8px rgba(255,0,255,0.20)",
        "glow-success": "0 0 16px rgba(34,197,94,0.30)",
        "glow-danger": "0 0 16px rgba(239,68,68,0.30)",

        // Inset highlight (glass top edge shimmer)
        "inner-glass": "inset 0 1px 0 rgba(255,255,255,0.20)",
        "inner-glass-dark": "inset 0 1px 0 rgba(255,255,255,0.08)",
      },

      // =========================================================
      // BACKDROP BLUR — Glassmorphism
      // =========================================================
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "10px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },

      // =========================================================
      // BACKGROUND IMAGES — Gradients
      // =========================================================
      backgroundImage: {
        // CTA button: Cornflower Blue → Magenta 135deg
        "gradient-cta": "linear-gradient(135deg, #6495ED 0%, #FF00FF 100%)",
        "gradient-cta-hover":
          "linear-gradient(135deg, #4f72d4 0%, #dd00dd 100%)",
        "gradient-cta-soft":
          "linear-gradient(135deg, rgba(100,149,237,0.15) 0%, rgba(255,0,255,0.10) 100%)",

        // Sidebar
        "gradient-sidebar": "linear-gradient(180deg, #0f172a 0%, #1a2744 100%)",
        "gradient-sidebar-item":
          "linear-gradient(90deg, rgba(100,149,237,0.15) 0%, rgba(100,149,237,0.05) 100%)",

        // Subtle mesh background
        "gradient-mesh-light":
          "radial-gradient(ellipse at 20% 20%, rgba(100,149,237,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(255,0,255,0.06) 0%, transparent 55%), radial-gradient(ellipse at 60% 5%, rgba(100,149,237,0.05) 0%, transparent 45%)",
        "gradient-mesh-dark":
          "radial-gradient(ellipse at 20% 20%, rgba(100,149,237,0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(255,0,255,0.08) 0%, transparent 55%), radial-gradient(ellipse at 60% 5%, rgba(100,149,237,0.07) 0%, transparent 45%)",

        // Skeleton shimmer
        shimmer:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        "shimmer-light":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.50) 50%, transparent 100%)",
      },

      // =========================================================
      // ANIMATIONS
      // =========================================================
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(100,149,237,0.30)" },
          "50%": {
            boxShadow:
              "0 0 24px rgba(100,149,237,0.60), 0 0 48px rgba(100,149,237,0.20)",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.30s ease-out both",
        "fade-in-scale": "fade-in-scale 0.25s ease-out both",
        "slide-in-left": "slide-in-left 0.30s ease-out both",
        "slide-in-right": "slide-in-right 0.30s ease-out both",
        "slide-up": "slide-up 0.30s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },

      // =========================================================
      // TRANSITION
      // =========================================================
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
