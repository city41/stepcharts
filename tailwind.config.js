module.exports = {
  purge: {
    content: ["./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  },
  darkMode: "media", // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        focal: {
          300: "var(--color-focal-300)",
          400: "var(--color-focal-400)",
          500: "var(--color-focal-500)",
          600: "var(--color-focal-600)",
          700: "var(--color-focal-700)",
          DEFAULT: "var(--color-focal-500)",
        },
        heading: {
          DEFAULT: "var(--color-heading)",
        },
        "heading-border": {
          DEFAULT: "var(--color-heading-border)",
        },
        subheading: {
          DEFAULT: "var(--color-subheading)",
        },
        "focal-alt": {
          fade: "var(--color-focal-alt-fade)",
          DEFAULT: "var(--color-focal-alt)",
          deep: "var(--color-focal-alt-deep)",
        },
        bg: {
          DEFAULT: "var(--color-bg)",
        },
        fg: {
          DEFAULT: "var(--color-fg)",
        },
        "bg-warning": "var(--color-bg-warning)",
        "fg-warning": "var(--color-fg-warning)",
        "bg-wisdom": "var(--color-bg-wisdom)",
        "fg-wisdom": "var(--color-fg-wisdom)",
        white: "var(--color-white-agnostic)",
        black: "var(--color-black-agnostic)",
      },
    },
  },
  variants: {
    extend: {
      margin: ["group-hover"],
    },
  },
  plugins: [],
};
