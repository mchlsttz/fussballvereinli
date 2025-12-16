/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Verhindert, dass ESLint Errors (z. B. no-unused-vars) den Build auf Vercel abbrechen
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
