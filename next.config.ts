import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // Add security headers
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            // Enables DNS prefetching to improve performance
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            // Forces browsers to use HTTPS for a specified time period
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            // Enables browser's built-in XSS filtering
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            // Prevents clickjacking by restricting who can put site in a frame
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            // Prevents MIME type sniffing (security vulnerability)
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            // Controls how much referrer info is sent with requests
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            // Controls which browser features can be used (formerly Feature-Policy)
            value:
              "camera=(), microphone=(), geolocation=(), payment=self, fullscreen=self",
          },
          {
            key: "Content-Security-Policy",
            // Defines trusted sources for content loading, preventing XSS and data injection
            value:
              "default-src 'self' *.api.paycrypt.tech api.paycrypt.tech; script-src 'self' 'unsafe-inline' https://js.stripe.com https://checkout.paypal.com; connect-src 'self' *.api.paycrypt.tech api.paycrypt.tech https://api.stripe.com https://api.paypal.com; frame-src 'self' *.api.paycrypt.tech api.paycrypt.tech https://js.stripe.com https://checkout.paypal.com; img-src 'self' *.api.paycrypt.tech api.paycrypt.tech https: data:; style-src 'self' *.api.paycrypt.tech api.paycrypt.tech 'unsafe-inline'; font-src 'self' *.api.paycrypt.tech api.paycrypt.tech data:; object-src 'none'; base-uri 'none'; form-action 'self' *.api.paycrypt.tech api.paycrypt.tech; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
          {
            key: "Cache-Control",
            // Prevents caching of potentially sensitive data
            value: "no-store, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            // Legacy cache control header for older browsers
            value: "no-cache",
          },

          {
            key: "Cross-Origin-Opener-Policy",
            // Prevents window.opener relationship with cross-origin popups
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            // Controls which websites can include this resource
            // 'cross-origin' allows resources to be shared across origins
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
