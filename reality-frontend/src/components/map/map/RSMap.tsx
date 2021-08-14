import ReactMapGL, { ExtraState, FlyToInterpolator, FullscreenControl, PointerEvent, ViewportProps } from 'react-map-gl'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useRouter } from 'next/dist/client/router'
import { GeoJSONSource, LngLatBounds, Map } from 'mapbox-gl'
import * as d3 from 'd3-ease'
import React, { FunctionComponent, useEffect, useRef, useState, useLayoutEffect } from 'react';

import { FILTERS_QUERY, VIEWPORT_QUERY } from '../../../graphql/apollo-client/client-cache/queries'
import { SET_VIEWPORT } from '../../../graphql/apollo-client/client-cache/mutations'
import { pushViewportToUrl, removeSpaces } from '../../../utils/utils'
import useDebounce from '../../../lib/hooks/useDebounce'
import viewportStore, { CachedViewport } from 'src/store/viewport.store'
import {
  CachedFiltersData,
  CachedViewportData,
  CachedViewportInput,
  EstateCluster,
  EstateFeature,
  LocalQueryResult,
  MapComponentProps,
  MapViewport
} from '../../../types'


const MAPBOX_MAP_STYLE_URL = 'mapbox://styles/pkratky/ck2dpu35v14ox1co4654rrb9n?optimize=true'


const RSMap: FunctionComponent<MapComponentProps> = (props) => {
  const { children, contextMenuProps, setContextMenuProps, setOnScreenEstates, popupProps, setPopupProps } = props

  const router = useRouter()
  const mapRef = useRef<ReactMapGL>(null)

  const { data: { cachedFilters } } = useQuery(FILTERS_QUERY) as LocalQueryResult<CachedFiltersData>

  const [viewportState, setViewportState] = useState<CachedViewport>(viewportStore.initialState)
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)

  useLayoutEffect(() => {
    const subs = viewportStore.subscribe(setViewportState)
    return () => subs.unsubscribe()
  }, [])

  useEffect(() => {
    if (mapRef.current !== null && isMapLoaded) {
      const map: Map = mapRef.current.getMap()

      try {
        map.addSource('estates', {
          type: 'geojson',
          data: getGeojsonSourceUri(),
          buffer: 0,
          tolerance: 10,
          cluster: true,
          clusterRadius: 50,
        })

        map.addLayer({
          id: "clusters",
          type: "circle",
          interactive: true,
          source: "estates",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": '#c10800',
            "circle-radius": {
              property: 'point_count',
              stops: [[5, 10], [10, 13], [15, 18]]
            },
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'estates',
          filter: ['has', 'point_count'],
          paint: {
            'text-color': '#fff'
          },
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
          }
        })

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          interactive: true,
          source: 'estates',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': { stops: [[0, 2], [5, 3], [12, 4], [16, 7]] },
            'circle-color': '#c10800',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        })

      } catch (err) {
        console.error(err)
      }

      // Get initial viewport 'height' and 'width' to match its container div
      const { clientWidth: width, clientHeight: height } = map.getContainer()
      viewportStore.setViewport({ ...viewportState, width, height })
      // @ts-ignore
      pushViewportToUrl(router, {  ...viewportState, width, height })
      // Initial update of rendered features
      updateOnScreenEstates()
    }
  }, [isMapLoaded])

  useEffect(() => {
    updateGeojsonSource(getGeojsonSourceUri())
  }, [cachedFilters])


  const _onContextMenu = (e: PointerEvent): void => {
    const [longitude, latitude] = e.lngLat
    const srcEvent: MouseEvent = e.srcEvent
    srcEvent.preventDefault()
    setContextMenuProps({ ...contextMenuProps, longitude, latitude, isVisible: true })
  }


  const _onClick = (e: PointerEvent): void => {
    const srcEvent: MouseEvent = e.srcEvent
    const eventTarget = srcEvent.target as HTMLElement

    if (srcEvent.button === 0 && eventTarget.className === 'overlays') {
      setContextMenuProps({ ...contextMenuProps, isVisible: false })
      setPopupProps({ ...popupProps, isVisible: false })
    }
    if (isMapLoaded && mapRef.current !== null) {
      const clickedEstateFeature: EstateFeature = e.features.find(ftr => ftr.layer.id === 'unclustered-point')
      if (clickedEstateFeature) onEstateClick(clickedEstateFeature)

      const clickedEstateCluster: EstateCluster = e.features.find(ftr => ftr.layer.id === 'clusters')
      if (clickedEstateCluster) onClusterClick(clickedEstateCluster)
    }
  }


  const _onLoad = (): void => {
    setIsMapLoaded(true) 
  }


  const _onViewPortChange = (viewport: ViewportProps): void => {
    viewportStore.setViewport(viewport)
    setContextMenuProps({ ...contextMenuProps, isVisible: false })
  }


  const _onInteractionStateChange = (interactionState: ExtraState): void => {
    const { isZooming, isPanning, inTransition, isDragging } = interactionState

    if (!isZooming && !isPanning && !inTransition && !isDragging) {
      // setCachedViewport({ variables: { cachedViewport: mapViewport } })
      pushViewportToUrl(router, viewportState)
      updateGeojsonSource(getGeojsonSourceUri())
      updateOnScreenEstates()
    }
  }


  const onClusterClick = async (cluster: EstateCluster) => {
    if (mapRef.current !== null) {
      const { geometry: { coordinates } } = cluster
      const features = await getEstatesFromCluster(cluster)
      setPopupProps({
        markerId: cluster.id.toString(10),
        isVisible: true,
        features: features as Array<EstateFeature>,
        longitude: coordinates[0],
        latitude: coordinates[1]
      })
    }
  }


  const onEstateClick = (feature: EstateFeature) => {
    const { properties: { id }, geometry: { coordinates } } = feature
    setPopupProps({
      markerId: id,
      isVisible: true,
      features: [feature],
      longitude: coordinates[0],
      latitude: coordinates[1]
    })
  }


  const updateOnScreenEstates = async () => {
    if (mapRef.current !== null && isMapLoaded) {
      const map = mapRef.current.getMap()

      // Re-run function every X milliseconds if the source is not finished loading data
      // TODO: Find better solution
      if (!map.isSourceLoaded('estates')) {
        setTimeout(updateOnScreenEstates, 50)
        return
      }

      // Clear currently visible estates, otherwise list is not load from scratch
      setOnScreenEstates([])

      const onScreenEstates: Array<string> = []

      const estates = map.queryRenderedFeatures(undefined, { layers: ['unclustered-point'] })
      estates.forEach(estate => onScreenEstates.push(estate.properties?.id))

      const clusters = map.queryRenderedFeatures(undefined, { layers: ['clusters'] })

      await Promise.all(clusters.map(async cluster => {
        try {
          const features = await getEstatesFromCluster(cluster as unknown as EstateCluster)
          features.forEach(estate => onScreenEstates.push(estate.properties.id))
        } catch (err) {
          console.error(err)
        }

      }))
      
      setOnScreenEstates(onScreenEstates)
    }
  }


  const updateGeojsonSource = (geojsonEndpointUri: string) => {
    if (mapRef.current !== null && isMapLoaded) {
      const map: Map = mapRef.current.getMap()
      const geojsonSource = map.getSource('estates') as GeoJSONSource
      geojsonSource.setData(geojsonEndpointUri)
    }
  }


  const getEstatesFromCluster = async (cluster: EstateCluster): Promise<EstateFeature[]> => {
    return new Promise<EstateFeature[]>((resolve, reject) => {

      if (mapRef.current !== null && isMapLoaded) {
        const { id, properties: { point_count } } = cluster
        const clusterSource = mapRef.current.getMap().getSource('estates') as GeoJSONSource

        clusterSource.getClusterLeaves(id, point_count, 0, (error, features) => {
          if (error) reject(error)
          else resolve(features as EstateFeature[])
        })
      }
    })
  }


  const getGeojsonSourceUri = (): string => {
    if (mapRef.current !== null && isMapLoaded) {
      const map: Map = mapRef.current.getMap()
      const bbox: LngLatBounds = map.getBounds()
      const ne = bbox.getNorthEast()
      const sw = bbox.getSouthWest()

      const parameters = {
        geom_column: 'geom',
        columns: ['id'].join(','),
        bounds: `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`,
        filter: getGeojsonSourceFilter()
      }

      const geojsonEndpointUri: URL = new URL(window.location.origin + `/api/postgis/v1/geojson/estates`)
      Object.entries(parameters).forEach(entry => {
        geojsonEndpointUri.searchParams.append(entry[0], entry[1])
      })

      return geojsonEndpointUri.href
    } else {
      return ''
    }
  }


  const generatePriceFilters = (price_from: string, price_to: string): string => {
    return [price_from, price_to]
      .map(price => removeSpaces(price))
      .map((price, index) => price ? `advertPrice${index ? '<' : '>'}=${price}` : null)
      .filter(price => price !== null)
      .join(' AND ')
  }


  const getGeojsonSourceFilter = (): string => {
    const { __typename, price_from, price_to, ...selectFilters } = cachedFilters
    // Generate price filters
    const parsedPriceFilter = generatePriceFilters(price_from, price_to)
    // Generate filters from select fields
    const parsedSelectFilters =
      Object.entries(selectFilters)
        .filter(entry => !!entry[1])
        .map(entry => {
          const key = entry[0]
          const value = entry[1]
          return `(${key}=${value})`
        })
    //TODO adhoc pridani source_id:
    // parsedSelectFilters.push('(source_id=3)')
    // Consolidate filters and join with all with 'AND' operator
    const parsedFinalFilters =
      parsedSelectFilters
        .concat(parsedPriceFilter)
        .filter(value => value.length)
        .join(' AND ')

    return parsedFinalFilters
  }

  return (
    <ReactMapGL
      {...viewportState}
      onLoad={_onLoad}
      onClick={_onClick}
      onContextMenu={_onContextMenu}
      onViewportChange={_onViewPortChange}
      onInteractionStateChange={_onInteractionStateChange}
      ref={mapRef}
      doubleClickZoom={false}
      interactiveLayerIds={['clusters', 'unclustered-point']}
      mapStyle={MAPBOX_MAP_STYLE_URL}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      width="100%"
      height="100%"
      maxZoom={18}
      minZoom={6.5}
    >
      {children}
    </ReactMapGL>
  )
}

export default RSMap
