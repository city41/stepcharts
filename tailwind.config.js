module.exports = {
  purge: {
    content: ["./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  },
  darkMode: "media", // 'media' or 'class'
  theme: {
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT:
        "0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md:
        "0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg:
        "0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl:
        "0 20px 25px -5px rgba(0, 0, 0, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      none: "none",
    },
    extend: {
      colors: {
        link: "var(--color-link)",
        beginner: "var(--color-beginner)",
        basic: "var(--color-basic)",
        difficult: "var(--color-difficult)",
        expert: "var(--color-expert)",
        challenge: "var(--color-challenge)",
        focal: {
          50: "var(--color-focal-50)",
          100: "var(--color-focal-100)",
          200: "var(--color-focal-200)",
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
      margin: ["group-hover", "first"],
      borderColor: ["last"],
    },
  },
  plugins: [],
};
