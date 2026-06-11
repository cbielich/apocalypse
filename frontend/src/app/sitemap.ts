import type { MetadataRoute } from 'next';

const BASE = 'https://apocalypsetracker.com';

const ROUTES = ['', '/dashboard', '/trends', '/records', '/prepper', '/faq', '/embed'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: path === '' ? 'hourly' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
