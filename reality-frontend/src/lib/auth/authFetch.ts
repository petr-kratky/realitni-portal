import fetch from "isomorphic-fetch"

import { getAccessToken, setAccessToken, validateAccessToken } from "./accessToken"

export default async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  if (!validateAccessToken()) {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include"
    })
    const data = await response.json()
    setAccessToken(data.accessToken)
  }
  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${getAccessToken()}`
  }
  return await fetch(input, { ...init, headers })
}
