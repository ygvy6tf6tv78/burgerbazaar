'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, ChevronRight } from 'lucide-react'
import { shopConfig } from '../config'

interface Review {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface ReviewsData {
  rating: number
  totalReviews: number
  reviews: Review[]
  googleUrl?: string
  unavailable?: boolean
  message?: string
}

export default function GoogleReviews() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shopConfig.google?.placeId) {
      setLoading(false)
      setError('Google Place ID not configured')
      return
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/google-reviews?placeId=${encodeURIComponent(shopConfig.google.placeId)}`
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || 'Failed to fetch reviews')
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.message || data.error)
        }
        
        setReviewsData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Don't render if no place ID
  if (!shopConfig.google?.placeId) {
    return null
  }

  // Show skeleton loader
  if (loading) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="section-title-accent">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
              Google Reviews
            </h2>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[24px] p-4 animate-pulse border bg-white/95"
              style={{
                height: '120px',
                borderColor: 'rgba(216, 195, 165, 0.18)',
                boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
              }}
            />
          ))}
        </div>
      </section>
    )
  }

  // Show error state with message
  if (error || (!reviewsData && !loading)) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="section-title-accent">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
              Google Reviews
            </h2>
          </div>
          <Link
            href="/reviews"
            className="text-sm font-semibold text-mango-green hover:text-mango-greenSoft transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div
          className="rounded-[24px] p-6 text-center bg-white/95"
          style={{
            border: '1px solid rgba(216, 195, 165, 0.18)',
            boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
          }}
        >
          <p className="text-slate-600 mb-4">
            {error || 'Unable to load reviews at the moment.'}
          </p>
          <Link
            href="/reviews"
            className="inline-block bg-mango-green hover:bg-mango-greenSoft text-white font-semibold py-2 px-4 rounded-xl transition-all"
          >
            View Reviews Page
          </Link>
        </div>
      </section>
    )
  }

  if (!reviewsData) return null

  if (reviewsData.unavailable) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="section-title-accent">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
              Google Reviews
            </h2>
          </div>
          <Link
            href="/reviews"
            className="text-sm font-semibold text-mango-green hover:text-mango-greenSoft transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="rounded-[24px] p-6 bg-white/95"
          style={{
            border: '1px solid rgba(216, 195, 165, 0.18)',
            boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(reviewsData.rating)
                      ? 'fill-[#FFD43B] text-[#FFD43B]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-900 font-bold text-lg">
              {reviewsData.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Live Google rating summary based on {reviewsData.totalReviews.toLocaleString()} reviews.
          </p>

          <div className="mt-4 space-y-3">
            <Link
              href="/reviews"
              className="block w-full font-semibold py-3.5 px-4 rounded-2xl shadow-[0_14px_28px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.1)] transition-all flex items-center justify-center gap-2 bg-white text-slate-900"
              style={{ border: '1px solid rgba(216, 195, 165, 0.18)' }}
            >
              Open Reviews Page
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </Link>
            {reviewsData.googleUrl && (
              <a
                href={reviewsData.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full font-semibold py-3.5 px-4 rounded-2xl shadow-[0_18px_34px_rgba(30,77,61,0.28)] hover:shadow-[0_22px_40px_rgba(30,77,61,0.34)] transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #7B4A2D 0%, #9A6A43 100%)',
                  color: 'white',
                }}
              >
                View on Google
                <ArrowRight className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>
      </section>
    )
  }

  const displayReviews = reviewsData.reviews.slice(0, 2)

  return (
    <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="section-title-accent">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Google Reviews
          </h2>
        </div>
        <Link
          href="/reviews"
          className="text-sm font-semibold text-mango-green hover:text-mango-greenSoft transition-colors flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-5 rounded-[24px] p-5 bg-white/95"
        style={{
          border: '1px solid rgba(216, 195, 165, 0.22)',
          boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[1, 2].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-[#FFD43B] text-[#FFD43B]"
                  />
                ))}
              </div>
              <span className="text-slate-900 font-extrabold text-lg">
                {reviewsData.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Based on {reviewsData.totalReviews.toLocaleString()} reviews on Google
            </p>
          </div>
          <div className="rounded-full px-3 py-1.5 border border-[#FFD43B]/45 bg-[#fff8df] text-slate-900 text-xs font-extrabold whitespace-nowrap">
            Google
          </div>
        </div>
      </motion.div>

      <div className="space-y-3.5">
        {displayReviews.map((review, index) => (
          <motion.div
            key={review.time}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            className="rounded-[24px] p-[18px] hover:shadow-lg transition-all relative overflow-hidden bg-white/95"
            style={{
              border: '1px solid rgba(216, 195, 165, 0.18)',
              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div className="flex items-start gap-3 mb-2 relative z-10">
              {review.profile_photo_url ? (
                <Image
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  unoptimized
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #9A6A43 0%, #7B4A2D 100%)',
                  }}
                >
                  <span className="text-white font-semibold text-sm">
                    {review.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-sm text-slate-900">
                    {review.author_name}
                  </h3>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'fill-[#FFD43B] text-[#FFD43B]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {review.relative_time_description}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed line-clamp-3 text-slate-700 relative z-10">
              {review.text}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5 space-y-3"
      >
        <Link
          href="/reviews"
          className="block w-full font-semibold py-3.5 px-4 rounded-2xl shadow-[0_14px_28px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_34px_rgba(15,23,42,0.1)] transition-all flex items-center justify-center gap-2 bg-white text-slate-900"
          style={{ border: '1px solid rgba(216, 195, 165, 0.18)' }}
        >
          View All Reviews
          <ArrowRight className="w-4 h-4 text-slate-900" />
        </Link>
        <Link
          href="/reviews#write-review"
          className="block w-full font-semibold py-3.5 px-4 rounded-2xl shadow-[0_18px_34px_rgba(30,77,61,0.28)] hover:shadow-[0_22px_40px_rgba(30,77,61,0.34)] transition-all flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #7B4A2D 0%, #9A6A43 100%)',
            color: 'white',
          }}
        >
          Write a Review
          <Star className="w-4 h-4 fill-white text-white" />
        </Link>
      </motion.div>
    </section>
  )
}
