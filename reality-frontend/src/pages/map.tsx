import React, { useEffect, useState } from "react"
import { ParsedUrlQuery } from "querystring"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { makeStyles } from "@material-ui/core"

import MapContainer from "../components/map/map/MapContainer"
import { filterObject, isUndef, pushViewportToUrl } from "../utils/utils"
import viewportStore, { CachedViewport } from "src/store/viewport.store"
import { AppState } from "src/types"

type QueryViewport = {
  zoom?: number
  longitude?: number
  latitude?: number
}

interface MapPageProps {
  queryViewport: QueryViewport
}

const useStyles = makeStyles({
  contentContainer: {
    display: "flex"
  }
})

const MapPage: NextPage<MapPageProps & AppState> = ({ appState }) => {
  const classes = useStyles()
  const router = useRouter()

  const [onScreenEstates, setOnScreenEstates] = useState<string[]>([])

  const [viewportState, setViewportState] = useState<CachedViewport>(viewportStore.initialState)

  useEffect(() => {
    const subs = viewportStore.subscribe(setViewportState)
    return () => subs.unsubscribe()
  }, [])

  useEffect(() => {
    const initViewport = { ...viewportState, ...getQueryViewport(router.query) }
    viewportStore.setViewport(initViewport)
    pushViewportToUrl(router, initViewport)
  }, [])

  return (
    <div className={classes.contentContainer}>
      <Head>
        <title>Realitní Portál | Mapa</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <MapContainer setOnScreenEstates={setOnScreenEstates} appState={appState} />
    </div>
  )
}

function getQueryViewport(query: ParsedUrlQuery): QueryViewport {
  const { latitude: qLatitude, longitude: qLongitude, zoom: qZoom } = query

  const [latitude, longitude, zoom]: Array<number | undefined> = [qLatitude, qLongitude, qZoom]
    .map(value => (isUndef(value) ? NaN : Number(value)))
    .map(value => (isNaN(value) ? undefined : value))

  const viewport: QueryViewport = { longitude, latitude, zoom }
  const filteredViewport = filterObject<QueryViewport, number | undefined>(viewport, value => !isUndef(value))

  return filteredViewport
}

export default MapPage
