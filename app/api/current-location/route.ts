import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GeocodeResponse {
  status: string
  results: Array<{
    formatted_address: string
    place_id?: string
  }>
}

function pinnedLocationPayload(lat: number, lng: number) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  return {
    address: 'Pinned location from phone GPS. Please add house, area and landmark details.',
    mapUrl,
    lat,
    lng,
    source: 'gps',
  }
}

export async function GET(request: NextRequest) {
  try {
    const latParam = request.nextUrl.searchParams.get('lat')
    const lngParam = request.nextUrl.searchParams.get('lng')

    if (!latParam || !lngParam) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 })
    }

    const lat = Number(latParam)
    const lng = Number(lngParam)

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: 'lat and lng must be valid numbers' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json(pinnedLocationPayload(lat, lng))
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json(pinnedLocationPayload(lat, lng))
    }

    const data: GeocodeResponse = await response.json()
    if (data.status !== 'OK' || data.results.length === 0) {
      return NextResponse.json(pinnedLocationPayload(lat, lng))
    }

    const result = data.results[0]
    return NextResponse.json({
      address: result.formatted_address,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      placeId: result.place_id,
      lat,
      lng,
      source: 'google-geocode',
    })
  } catch (error) {
    console.error('Current location geocode error:', error)
    const lat = Number(request.nextUrl.searchParams.get('lat'))
    const lng = Number(request.nextUrl.searchParams.get('lng'))
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return NextResponse.json(pinnedLocationPayload(lat, lng))
    }
    return NextResponse.json({ error: 'Unable to resolve current location' }, { status: 500 })
  }
}
