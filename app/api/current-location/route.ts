import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GeocodeResponse {
  status: string
  results: Array<{
    formatted_address: string
    place_id?: string
  }>
}

interface OpenStreetMapGeocodeResponse {
  display_name?: string
}

function pinnedLocationPayload(lat: number, lng: number) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  return {
    address: `GPS location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    mapUrl,
    lat,
    lng,
    source: 'gps',
  }
}

async function reverseGeocodeWithOpenStreetMap(lat: number, lng: number) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('zoom', '18')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(6500),
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      'User-Agent': 'BurgerBazaar-OneLink/1.0',
    },
  })
  if (!response.ok) return null

  const data: OpenStreetMapGeocodeResponse = await response.json()
  return data.display_name?.trim() || null
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
    if (apiKey) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      const response = await fetch(url, { cache: 'no-store' })
      if (response.ok) {
        const data: GeocodeResponse = await response.json()
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0]
          return NextResponse.json({
            address: result.formatted_address,
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            placeId: result.place_id,
            lat,
            lng,
            source: 'google-geocode',
          })
        }
      }
    }

    const openStreetMapAddress = await reverseGeocodeWithOpenStreetMap(lat, lng)
    if (openStreetMapAddress) {
      return NextResponse.json({
        address: openStreetMapAddress,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        lat,
        lng,
        source: 'openstreetmap-geocode',
      })
    }

    return NextResponse.json(pinnedLocationPayload(lat, lng))
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
