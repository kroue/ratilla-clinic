import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/base-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
