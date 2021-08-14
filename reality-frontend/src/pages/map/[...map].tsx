import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createUseStyles } from 'react-jss'

import EstatesSidebar from '../../components/map/sidebar/EstatesSidebar'
import MapContainer from '../../components/map/map/MapContainer'
import { filterObject, isUndef, pushViewportToUrl } from '../../utils/utils'
import viewportStore, { CachedViewport } from 'src/store/viewport.store'



type QueryViewport = {
  zoom?: number
  longitude?: number
  latitude?: number
}


interface MapPageProps {
  queryViewport: QueryViewport
}


const useStyles = createUseStyles({
  contentContainer: {
    display: 'flex'
  }
})


function getQueryViewport(query: string | undefined): QueryViewport {
  const viewportRegex = /@([+-]?([0-9]*[.])?[0-9]+,){2}\dz/g

  if ((typeof query === 'undefined' || !(viewportRegex.test(query)))) return {}

  const [latStr, lngStr, zStr]: string[] = query
    .match(viewportRegex)?.[0]
    .slice(1)
    .split(',') as string[]

  const [latitude, longitude, zoom]: Array<number | undefined> = [latStr, lngStr, zStr[0]]
    .map(value => isUndef(value) ? NaN : Number(value))
    .map(value => isNaN(value) ? undefined : value)

  const viewport: QueryViewport = { longitude, latitude, zoom }
  const filteredViewport = filterObject<QueryViewport, number | undefined>(viewport, value => !isUndef(value))

  return filteredViewport
}


const MapPage: NextPage<MapPageProps> = () => {
  const classes = useStyles()
  const router = useRouter()

  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [onScreenEstates, setOnScreenEstates] = useState<string[]>([])
  
  const [viewportState, setViewportState] = useState<CachedViewport>(viewportStore.initialState)

  useEffect(() => {
    const subs = viewportStore.subscribe(setViewportState)
    return () => subs.unsubscribe()
  }, [])

  useEffect(() => {
    const queryViewport: QueryViewport = getQueryViewport(router.query.map?.[0])
    const initViewport = { ...viewportState, ...queryViewport }
    viewportStore.setViewport(initViewport)
    pushViewportToUrl(router, { ...initViewport })
  }, [])

  const _handleSidebarToggle = (): void => setSidebarOpen(!sidebarOpen)

  return (
    <div className={classes.contentContainer}>
      <Head>
        <title>Realitní Portál</title>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <EstatesSidebar open={sidebarOpen} estates={onScreenEstates} toggleOpen={_handleSidebarToggle} />
      <MapContainer setOnScreenEstates={setOnScreenEstates} />
    </div>
  )
}

export default MapPage
