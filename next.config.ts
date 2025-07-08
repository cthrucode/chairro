// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',         // Where service worker is output
  register: true,         // Auto-register service worker
  skipWaiting: true       // Skip waiting on new version
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ...other config options
}

module.exports = withPWA(nextConfig)
