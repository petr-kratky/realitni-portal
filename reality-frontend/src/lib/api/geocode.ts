import authFetch from "../auth/authFetch"
import { GeocodeResults } from "../../types/geocode-result"

export async function geocodeLocation(options: { latlng?: string, address?: string }): Promise<GeocodeResults> {
    const params = {
      language: 'cs',
      region: 'cz',
      ...options,
    }
    try {
      const result = await authFetch("/api/gis/geocode", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await result.json() as GeocodeResults
    } catch (err: any) {
      throw new Error(err.message)
    }
}