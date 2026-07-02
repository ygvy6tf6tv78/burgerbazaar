'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, ExternalLink } from 'lucide-react'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import ReviewForm from '../shops/honeys-fresh-n-frozen/components/ReviewForm'

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

export default function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set())
  const [displayCount, setDisplayCount] = useState(3) // Show 3 reviews initially

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

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          const message = data.message || data.error || 'Failed to fetch reviews'
          throw new Error(message)
        }

        if (data.error) {
          throw new Error(data.message || data.error)
        }

        setReviewsData(data)
      } catch (err: unknown) {
        console.error('Error fetching reviews:', err)
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const toggleReview = (index: number) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedReviews(newExpanded)
  }

  const getGoogleReviewsUrl = () => {
    // Priority: API response URL > reviewsUrl > mapsUrl
    if (reviewsData?.googleUrl) {
      return reviewsData.googleUrl
    }
    if (shopConfig.google?.reviewsUrl) {
      return shopConfig.google.reviewsUrl
    }
    if (shopConfig.google?.mapsUrl) {
      return shopConfig.google.mapsUrl
    }
    // Fallback: construct URL from placeId
    if (shopConfig.google?.placeId) {
      return `https://www.google.com/maps/place/?q=place_id:${shopConfig.google.placeId}`
    }
    return '#'
  }

  return (
    <main className="min-h-screen pb-12 relative z-10 overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #fefbf3 0%, #faf8f0 50%, #fefbf3 100%)'
    }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D8C3A5]/18 blur-3xl" />
        <div className="absolute top-[18rem] -left-16 h-64 w-64 rounded-full bg-mango-green/10 blur-3xl" />
        <div className="absolute bottom-[8rem] right-[-4rem] h-72 w-72 rounded-full bg-[#D8C3A5]/12 blur-3xl" />
      </div>

      {/* Header */}
      <div className="border-b sticky top-0 z-10 backdrop-blur-md shadow-sm" style={{ 
        backgroundColor: 'rgba(255, 251, 243, 0.95)',
        borderColor: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div className="max-w-md mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-4 flex items-center gap-3">
          <Link
            href="/"
            prefetch
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors hover:bg-black/5 active:scale-[0.98] touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('fromReviews', 'true')
              }
            }}
          >
            <ArrowLeft className="h-6 w-6 text-slate-800" strokeWidth={2.25} aria-hidden />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Google Reviews</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-6 relative z-10">
        {/* Review Us Button - At Top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <ReviewForm />
        </motion.div>
        {loading ? (
          // Skeleton Loader
          <div className="space-y-4">
            <div 
              className="rounded-[24px] p-6 animate-pulse" 
              style={{ 
                height: '150px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(216, 195, 165, 0.22)',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)'
              }} 
            />
            <div 
              className="rounded-[24px] p-6 animate-pulse" 
              style={{ 
                height: '150px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(216, 195, 165, 0.22)',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)'
              }} 
            />
            <div 
              className="rounded-[24px] p-6 animate-pulse" 
              style={{ 
                height: '150px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(216, 195, 165, 0.22)',
                boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)'
              }} 
            />
          </div>
        ) : error || !reviewsData ? (
          // Error State
          <div className="text-center py-12 rounded-[24px]" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(216, 195, 165, 0.22)',
            boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)'
          }}>
            <p className="mb-4 text-slate-700">
              {error || 'Google Place ID not configured'}
            </p>
            <Link
              href="/"
              className="transition-colors font-medium text-mango-green hover:text-mango-primary"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            {reviewsData.unavailable ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] p-6 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,240,0.95) 42%, rgba(255,255,255,0.98) 100%)',
                  border: '1px solid rgba(216, 195, 165, 0.26)',
                  boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(reviewsData.rating)
                            ? 'fill-[#FFD43B] text-[#FFD43B]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-2xl text-slate-800">
                    {reviewsData.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-base text-slate-600 leading-relaxed">
                  {reviewsData.message || 'Live Google rating summary.'}
                </p>
                <div className="mt-5">
                  <a
                    href={getGoogleReviewsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-white font-semibold py-4 px-6 rounded-[24px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #7B4A2D 0%, #9A6A43 100%)',
                      boxShadow: '0 20px 36px rgba(176,122,73,0.24)'
                    }}
                  >
                    View on Google
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <>
            {/* Rating Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6 text-center rounded-[28px] p-6 shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,240,0.95) 42%, rgba(255,255,255,0.98) 100%)',
                border: '1px solid rgba(216, 195, 165, 0.26)',
                boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)'
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(reviewsData.rating)
                          ? 'fill-[#FFD43B] text-[#FFD43B]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-2xl text-slate-800">
                  {reviewsData.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-base text-slate-600">
                Based on {reviewsData.totalReviews.toLocaleString()} reviews on Google
              </p>
            </motion.div>

            {/* Reviews List */}
            <div className="space-y-4 mb-6">
              {reviewsData.reviews.slice(0, displayCount).map((review, index) => {
                const isExpanded = expandedReviews.has(index)
                const shouldTruncate = review.text.length > 150

                return (
                  <motion.div
                    key={review.time}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="rounded-[24px] p-5 hover:shadow-lg transition-all shadow-sm relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,252,240,0.95) 42%, rgba(255,255,255,0.98) 100%)',
                      border: '1px solid rgba(216, 195, 165, 0.24)',
                      boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)'
                    }}
                  >
                    <div className="absolute inset-x-5 top-3 h-8 rounded-full bg-[#D8C3A5]/20 blur-2xl pointer-events-none" />
                    <div className="flex items-start gap-3 mb-3 relative z-10">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D8C3A5]/20"
                          unoptimized
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #9A6A43 0%, #7B4A2D 100%)'
                          }}
                        >
                          <span className="text-white font-semibold text-base">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base text-slate-800">
                            {review.author_name}
                          </h3>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
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
                    <p
                      className={`text-sm leading-relaxed ${
                        shouldTruncate && !isExpanded ? 'line-clamp-3' : ''
                      } text-slate-700`}
                    >
                      {review.text}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleReview(index)}
                        className="mt-2 text-sm font-medium transition-colors text-mango-green hover:text-mango-primary"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* View More Button - Blue Solid Color */}
            {reviewsData.reviews.length > displayCount && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-6"
              >
                <button
                  onClick={() => setDisplayCount(reviewsData.reviews.length)}
                  className="w-full text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #7B4A2D 0%, #9A6A43 100%)',
                    boxShadow: '0 18px 34px rgba(176,122,73,0.24)'
                  }}
                >
                  View More ({reviewsData.reviews.length - displayCount} more)
                </button>
              </motion.div>
            )}

            {/* View All Reviews on Google Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <a
                href={getGoogleReviewsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-white font-semibold py-4 px-6 rounded-[24px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #7B4A2D 0%, #9A6A43 100%)',
                  boxShadow: '0 20px 36px rgba(176,122,73,0.24)'
                }}
              >
                View All Reviews on Google
                <ExternalLink className="w-5 h-5" />
              </a>
            </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
