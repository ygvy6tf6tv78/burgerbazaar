import type { MetadataRoute } from 'next'
import { siteConfig } from './data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = ['', '/menu', '/order', '/gallery', '/reviews', '/checkout', '/sonnet-pay']

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/menu' ? 0.95 : 0.8,
  }))
}
