import { NextRequest, NextResponse } from 'next/server'
import { shopConfig } from '../../shops/honeys-fresh-n-frozen/config'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

interface GoogleReview {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface GooglePlacesResponse {
  result: {
    name: string
    rating: number
    user_ratings_total: number
    reviews: GoogleReview[]
    url?: string
  }
  status: string
}

function getFallbackRating() {
  if ('fallbackRating' in shopConfig.google && typeof shopConfig.google.fallbackRating === 'number') {
    return shopConfig.google.fallbackRating
  }

  const badge = shopConfig.keywordBadges?.find((item) => item.toLowerCase().includes('google rating'))
  if (!badge) return 0

  const match = badge.match(/(\d+(\.\d+)?)/)
  return match ? Number.parseFloat(match[1]) : 0
}

function getFallbackResponse(message: string) {
  return NextResponse.json(
    {
      rating: getFallbackRating(),
      totalReviews:
        'fallbackReviewCount' in shopConfig.google && typeof shopConfig.google.fallbackReviewCount === 'number'
          ? shopConfig.google.fallbackReviewCount
          : 0,
      reviews: [],
      googleUrl: shopConfig.google?.mapsUrl || shopConfig.google?.reviewsUrl,
      unavailable: true,
      message,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const placeId = searchParams.get('placeId')

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return getFallbackResponse('Google reviews are temporarily unavailable.')
    }

    // Fetch place details with reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()

    if (data.status !== 'OK') {
      return getFallbackResponse(
        data.status === 'NOT_FOUND'
          ? 'Google reviews are unavailable for this location right now.'
          : data.status === 'REQUEST_DENIED'
            ? 'Google reviews are temporarily unavailable.'
            : `Google reviews are temporarily unavailable.`
      )
    }

    const result = data.result
    const rating = result.rating ?? 0
    const totalReviews = result.user_ratings_total ?? 0
    const reviews = result.reviews ?? []
    const placeUrl = result.url

    // Return up to 5 reviews (API limit)
    const limitedReviews = reviews.slice(0, 5)

    return NextResponse.json(
      {
        rating,
        totalReviews,
        reviews: limitedReviews,
        googleUrl: placeUrl,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Google Reviews:', error)
    return getFallbackResponse('Google reviews are temporarily unavailable.')
  }
}
