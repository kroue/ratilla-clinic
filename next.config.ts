import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (local dev database) ships WASM; load it from node_modules instead of bundling it,
  // and keep it out of the Vercel functions, which always use Neon.
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingExcludes: {
    "/*": ["./node_modules/@electric-sql/pglite/**/*", "./.pglite/**/*"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
