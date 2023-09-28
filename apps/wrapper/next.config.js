// /** @type {import('next').NextConfig} */


// const runtimeCaching = require("next-pwa/cache");
// const withPWA = require("next-pwa")({
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//     disable: process.env.NODE_ENV === "development",
//     runtimeCaching
// });

// module.exports = withPWA({
//     reactStrictMode: true,
// });

const withPWAInit = require("next-pwa");

const isDev = process.env.NODE_ENV !== "production";
const runtimeCaching = require("next-pwa/cache");
const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    }
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = withPWA(nextConfig);