import fetch from "isomorphic-fetch"

import { getAccessToken, setAccessToken, validateAccessToken } from "./accessToken"

export default async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  if (!validateAccessToken()) {
    const tokenResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include"
    })
    const tokenData = await tokenResponse.json()
    setAccessToken(tokenData.accessToken)
  }
  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${getAccessToken()}`
  }
  const fetchResponse = await fetch(input, { ...init, headers })

  if (fetchResponse.ok) {
    return fetchResponse
  } else {
    throw new Error(fetchResponse.statusText)
  }
}
