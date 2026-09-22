// Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the project's production domain,
// so metadata, robots and the sitemap point at the live site after the first deploy.
export function baseUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : "http://localhost:3000";
}
