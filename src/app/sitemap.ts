import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yb.xyz'
  
  const staticRoutes = [
    '',
    '/dmca',
    '/awards',
    '/categories',
    '/companies',
    '/people',
    '/search',
    '/privacy',
    '/terms',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [
    ...staticRoutes,
  ]
}
