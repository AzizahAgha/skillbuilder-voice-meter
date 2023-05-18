module.exports = {
  reactStrictMode: true,
  experimental: {
        images: {
            unoptimized: true
        }
   },
  publicRuntimeConfig: {
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "envnotset",
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "envnotset",
    FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "envnotset",
    WEBFLOW_URL:
      process.env.NEXT_PUBLIC_WEBFLOW_URL ||
      "https://landing-page-ac72bc.webflow.io",
  },
};
