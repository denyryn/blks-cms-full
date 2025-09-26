const config = {
  appName: import.meta.env.VITE_APP_NAME || "React",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",

  imageFallback: "/src/assets/placeholder.svg",
};

export default config;
