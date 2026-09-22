import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/base-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Patient requests live here; keep it out of search results.
      disallow: "/admin",
    },
    sitemap: `${baseUrl()}/sitemap.xml`,
  };
}
