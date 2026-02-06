/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
    "./src/**/*.{html,ts,js}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6a1b9a",
        "primary-dark": "#4a148c",
        "header-brand": "#4a148c",
        "header-nav": "#7b1fa2",
        "background-light": "#f1f5f9",
        "background-dark": "#0f172a",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-main-light": "#1e293b",
        "text-main-dark": "#f8fafc",
        "text-muted-light": "#64748b",
        "text-muted-dark": "#94a3b8",
        "admin-primary": "#4A148C",
        "admin-secondary": "#7B1FA2",
      },
      fontFamily: {
        display: ["Inter", "Roboto", "sans-serif"],
        body: ["Inter", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        'hero-pattern': "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.05\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
