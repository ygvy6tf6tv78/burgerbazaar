'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Play, Pin } from 'lucide-react'
import { shopConfig } from '../config'

type FeedPost = {
  id: string
  image: string
  caption: string
  mediaType: 'post' | 'reel'
  href: string
  pinned?: boolean
}

type FeedResponse = {
  source?: 'instagram' | 'fallback'
  posts?: FeedPost[]
}

export default function InstagramFeed() {
  const feed = shopConfig.instagramFeed
  const instagramUrl = shopConfig.social?.instagram
  const fallbackPosts = feed?.posts
    ? [...feed.posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))).slice(0, 6)
    : []

  const [posts, setPosts] = useState<FeedPost[]>(fallbackPosts)
  const [source, setSource] = useState<'instagram' | 'fallback'>('fallback')

  useEffect(() => {
    let active = true

    const loadFeed = async () => {
      try {
        const response = await fetch('/api/instagram-feed?limit=6', { cache: 'no-store' })
        const data = (await response.json()) as FeedResponse

        if (!active || !data.posts?.length) {
          return
        }

        setPosts(data.posts)
        setSource(data.source === 'instagram' ? 'instagram' : 'fallback')
      } catch {
        // Keep curated fallback posts on any fetch error.
      }
    }

    loadFeed()

    return () => {
      active = false
    }
  }, [])

  if (!feed || !instagramUrl || !posts.length || shopConfig.sections?.showInstagramFeed === false) {
    return null
  }

  return (
    <section className="w-full max-w-md mx-auto py-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-5"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="section-title-accent mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
                {feed.title}
              </h2>
            </div>
            <p className="whitespace-nowrap text-sm sm:text-base text-slate-300/90 font-normal text-left tracking-tight">
              Drops • burgers • kitchen moments • offers.
            </p>
          </div>
          {source === 'instagram' && (
            <div className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 whitespace-nowrap">
              Live Feed
            </div>
          )}
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-3.5 shadow-[0_18px_30px_rgba(0,0,0,0.2)] transition-all hover:bg-white/[0.075]"
        >
          <div className="pointer-events-none absolute right-3 top-0 h-14 w-20 rounded-full bg-white/8 blur-2xl" />
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.16)]">
            <Image
              src={shopConfig.assets.logo}
              alt={shopConfig.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{feed.profileHandle}</p>
            <p className="truncate text-xs text-slate-400">Posts, reels and updates from Burger Bazaar Jammu</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white p-2 shadow-[0_10px_22px_rgba(221,42,123,0.24)] transition-transform group-hover:scale-105">
            <Image src="/instagram-official.png" alt="Instagram" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
        </a>
      </motion.div>

      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {posts.slice(0, 6).map((post, index) => (
          <motion.a
            key={post.id}
            href={post.href || instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative w-[14.25rem] flex-shrink-0 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.05] shadow-[0_20px_40px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[0.9] overflow-hidden">
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="228px"
              />
              <div className="absolute inset-[1px] rounded-[25px] border border-white/10" />
              <div className="absolute inset-x-6 top-4 h-9 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_12%,rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.985)_100%)]" />

              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
                {post.pinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-900">
                    <Pin className="w-3.5 h-3.5" />
                    Pinned
                  </span>
                ) : (
                  <span />
                )}
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(131,58,180,0.85),rgba(221,42,123,0.82),rgba(245,133,41,0.82))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_18px_rgba(221,42,123,0.18)]">
                  {post.mediaType === 'reel' ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      Reel
                    </>
                  ) : (
                    <>
                      <Image src="/instagram-official.png" alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" aria-hidden />
                      Post
                    </>
                  )}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20 bg-white">
                    <Image
                      src={shopConfig.assets.logo}
                      alt={shopConfig.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs font-medium text-white/80">{feed.profileHandle}</span>
                </div>
                <p className="line-clamp-2 text-[15px] font-bold leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.75)]">
                  {post.caption}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white/60">View on Instagram</span>
                  <ArrowRight className="h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-[18px] border-0 px-6 font-bold text-white shadow-[0_18px_34px_rgba(221,42,123,0.22)] outline outline-1 outline-white/15 transition-all hover:shadow-[0_22px_40px_rgba(221,42,123,0.28)]"
        style={{
          background: 'linear-gradient(90deg, #833AB4 0%, #DD2A7B 52%, #F58529 100%)',
        }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white p-1.5 shadow-sm">
          <Image src="/instagram-official.png" alt="Instagram" width={22} height={22} className="h-full w-full object-contain" />
        </span>
        View Full Instagram
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </section>
  )
}
