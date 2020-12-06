import { NextRouter } from 'next/router'
import { ViewportUrlOptions } from '../types'


export async function pushViewportToUrl(router: NextRouter, urlOptions: ViewportUrlOptions): Promise<void> {
  const { longitude: lng, latitude: lat, zoom: z } = urlOptions
  const href = `/map/@${lat.toFixed(5)},${lng.toFixed(5)},${z.toFixed(0)}z`
  await router.replace('/map/[...map]', href, { shallow: true })
}

export function camelToSnake(string: string): string {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

export function filterObject<K, T = any>(obj: { [key: string]: T }, predicate: (value: T) => boolean): Partial<K> {
  return Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
}

export function isUndef(obj: any): boolean {
  return typeof obj === 'undefined'
}

export function removeSpaces(string: string): string {
  return string.split(' ').join('')
}

export function getDeviceLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    } else {
      reject('Cannot get device location - not on client.')
    }
  })
}

export async function geocodeLocation(address: string): Promise<any> {
  const googleApiKey: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const googleGeocodeUrl: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_URL

  if (googleGeocodeUrl && googleApiKey) {
    const params = { address, language: 'cs', region: 'cz', key: googleApiKey }
    const requestUrl: URL = new URL(googleGeocodeUrl)

    Object.entries(params)
      .forEach(entry => requestUrl.searchParams.append(entry[0], entry[1]))

    try {
      const response = await fetch(requestUrl.href)
      return await response.json()
    } catch (err) {
      console.error('Geocoding failed with error:\n' + err);
    }

  } else {
    console.error('Google geocode API env vars not specified!')
  }
}
