/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');
const nextConfig = {
  output: "standalone",
  i18n
}

module.exports = nextConfig
