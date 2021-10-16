import React, { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { GeoJSONSource } from "mapbox-gl"
import { ParsedUrlQuery } from "querystring"
import ReactMapGL, { ExtraState, PointerEvent, ViewportProps } from "react-map-gl"

import { createStyles, Fab, makeStyles, Theme, Tooltip } from "@material-ui/core"
import { Remove, Add } from "@material-ui/icons"

import { viewportStore, snackStore, geojsonStore } from "src/lib/stores"
import { filterObject, isUndef, pushViewportToUrl } from "../../../utils/utils"
import authFetch from "../../../lib/auth/authFetch"
import {
  AppState,
  EstateCluster,
  EstateFeature,
  EstateFeatureCollection,
  GeoJSONRequestParams,
  MapComponentProps
} from "../../../types"

const MAPBOX_MAP_STYLE_URL = "mapbox://styles/pkratky/ck2dpu35v14ox1co4654rrb9n?optimize=true"

const FAB_BOTTOM_OFFSET = 5
const FAB_RIGHT_OFFSET = 2

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      height: "calc(100vh - 48px)",
      width: "100%",
      position: "relative"
    },
    fabZoomIn: {
      position: "absolute",
      bottom: theme.spacing(FAB_BOTTOM_OFFSET + 6),
      right: theme.spacing(FAB_RIGHT_OFFSET)
    },
    fabZoomOut: {
      position: "absolute",
      bottom: theme.spacing(FAB_BOTTOM_OFFSET),
      right: theme.spacing(FAB_RIGHT_OFFSET)
    }
  })
)

const RSMap: FunctionComponent<MapComponentProps & AppState> = ({
  children,
  contextMenuProps,
  setContextMenuProps,
  popupProps,
  setPopupProps,
  appState
}) => {
  const classes = useStyles()
  const router = useRouter()
  const mapRef = useRef<ReactMapGL>(null)

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      const map = mapRef.current.getMap()

      try {
        map.addSource("estates", {
          type: "geojson",
          data: geojsonStore.initialState.featureCollection,
          buffer: 0,
          tolerance: 10,
          cluster: true,
          clusterRadius: 50
        })

        map.addLayer({
          id: "clusters",
          type: "circle",
          interactive: true,
          source: "estates",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#c10800",
            "circle-radius": {
              property: "point_count",
              stops: [
                [5, 10],
                [10, 13],
                [15, 18]
              ]
            },
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
          }
        })

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "estates",
          filter: ["has", "point_count"],
          paint: {
            "text-color": "#fff"
          },
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
          }
        })

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          interactive: true,
          source: "estates",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": {
              stops: [
                [0, 2],
                [5, 3],
                [12, 4],
                [16, 7]
              ]
            },
            "circle-color": "#c10800",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
          }
        })
        // Refresh geoJSON data source from API
        setTimeout(() => updateGeojsonSource(), 200)
      } catch (err: any) {
        // console.error(err.message)
      }
    }
  }, [isMapLoaded])

  useEffect(() => {
    updateGeojsonSource()
  }, [appState.geojson.refetchCounter, appState.geojson.filter])

  useEffect(() => {
    const queryViewport = getQueryViewport(router.query)
    const initViewport = { ...appState.viewport, ...queryViewport, ready: true }
    viewportStore.setViewport(initViewport)
    pushViewportToUrl(router, initViewport)
  }, [])

  const zoomIn = () => {
    viewportStore.setViewport({ ...appState.viewport, zoom: appState.viewport.zoom + 1 }, true, 300)
  }

  const zoomOut = () => {
    viewportStore.setViewport({ ...appState.viewport, zoom: appState.viewport.zoom - 1 }, true, 300)
  }

  const __onContextMenu = (e: PointerEvent): void => {
    const [longitude, latitude] = e.lngLat
    const srcEvent: MouseEvent = e.srcEvent
    srcEvent.preventDefault()
    setContextMenuProps({ ...contextMenuProps, longitude, latitude, isVisible: true })
  }

  const __onClick = (e: PointerEvent): void => {
    const srcEvent: MouseEvent = e.srcEvent
    const eventTarget = srcEvent.target as HTMLElement

    if (srcEvent.button === 0 && eventTarget.className === "overlays") {
      setContextMenuProps({ ...contextMenuProps, isVisible: false })
      setPopupProps({ ...popupProps, isVisible: false })
    }
    if (isMapLoaded && mapRef.current) {
      const clickedEstateFeature: EstateFeature = e.features.find(ftr => ftr.layer.id === "unclustered-point")
      if (clickedEstateFeature) __onEstateClick(clickedEstateFeature)

      const clickedEstateCluster: EstateCluster = e.features.find(ftr => ftr.layer.id === "clusters")
      if (clickedEstateCluster) __onClusterClick(clickedEstateCluster)
    }
  }

  const __onLoad = (): void => {
    setIsMapLoaded(true)
  }

  const __onViewPortChange = (viewportProps: ViewportProps) => {
    viewportStore.setViewport({ ...viewportProps, ready: appState.viewport.ready })
    setContextMenuProps({ ...contextMenuProps, isVisible: false })
  }

  const __onInteractionStateChange = async (interactionState: ExtraState) => {
    const { isZooming, isPanning, inTransition, isDragging } = interactionState
    if (!isZooming && !isPanning && !inTransition && !isDragging) {
      if (appState.viewport.width && appState.viewport.height) {
        await pushViewportToUrl(router, appState.viewport)
        await updateGeojsonSource()
      }
    }
  }

  const __onClusterClick = async (cluster: EstateCluster) => {
    if (mapRef.current) {
      const {
        geometry: { coordinates }
      } = cluster
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

  const __onEstateClick = (feature: EstateFeature) => {
    const {
      properties: { id },
      geometry: { coordinates }
    } = feature
    setPopupProps({
      markerId: id,
      isVisible: true,
      features: [feature],
      longitude: coordinates[0],
      latitude: coordinates[1]
    })
  }

  const updateGeojsonSource = async () => {
    if (mapRef.current && isMapLoaded) {
      try {
        const geojsonSource = mapRef.current.getMap().getSource("estates") as GeoJSONSource
        const geojsonRequestParams = getGeoJSONRequestParams()
        const geojsonResponse = await authFetch("/api/gis/geojson/estates", {
          method: "POST",
          cache: "no-cache",
          body: JSON.stringify(geojsonRequestParams),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const geojsonData: EstateFeatureCollection = await geojsonResponse.json()
        geojsonStore.setFeatures(geojsonData)
        geojsonSource.setData(geojsonData)
      } catch (err: any) {
        snackStore.toggle("error", "Nepodařilo se obnovit data na mapě")
        console.error(err)
      }
    }
  }

  const getGeoJSONRequestParams = (): GeoJSONRequestParams => {
    if (mapRef.current && isMapLoaded) {
      const bounds = mapRef.current.getMap().getBounds()
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      return {
        columns: ["id"],
        bounds: [sw.lng, sw.lat, ne.lng, ne.lat],
        filter: generateGeoJSONFilters()
      }
    } else {
      return {
        columns: ["id"],
        bounds: [0, 0, 0, 0]
      }
    }
  }

  const getEstatesFromCluster = async (cluster: EstateCluster): Promise<EstateFeature[]> => {
    return new Promise<EstateFeature[]>((resolve, reject) => {
      if (mapRef.current && isMapLoaded) {
        const {
          id,
          properties: { point_count }
        } = cluster
        const clusterSource = mapRef.current.getMap().getSource("estates") as GeoJSONSource

        clusterSource.getClusterLeaves(id, point_count, 0, (error, features) => {
          if (error) reject(error)
          else resolve(features as EstateFeature[])
        })
      }
    })
  }

  const generateGeoJSONFilters = (): string => {
    const parseFilters = ([key, value]: Array<string | string[]>): string => {
      if (value instanceof Array) {
        return value.length ? "(" + value.map(value => `${key}=${value}`).join(" OR ") + ")" : ""
      } else if (value.match(/\d*,\d*/)) {
        return value
          .split(",")
          .map((value, index) => (value ? `${key}${index ? "<" : ">"}=${value}` : null))
          .filter(value => value !== null)
          .join(" AND ")
      } else {
        return `${key}=${value}`
      }
    }
    return Object.entries(appState.geojson.filter)
      .filter(entry => !!entry[1])
      .map(parseFilters)
      .filter(value => value.length)
      .join(" AND ")
  }

  return appState.viewport.ready ? (
    <ReactMapGL
      {...appState.viewport}
      onLoad={__onLoad}
      onClick={__onClick}
      onContextMenu={__onContextMenu}
      onViewportChange={__onViewPortChange}
      onInteractionStateChange={__onInteractionStateChange}
      ref={mapRef}
      doubleClickZoom={false}
      interactiveLayerIds={["clusters", "unclustered-point"]}
      mapStyle={MAPBOX_MAP_STYLE_URL}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      width='100%'
      height='100%'
      maxZoom={18}
      minZoom={7}
    >
      {children}
      <Tooltip placement='left' title='Přiblížit' enterDelay={1250}>
        <Fab variant='circular' color='default' size='small' classes={{ root: classes.fabZoomIn }} onClick={zoomIn}>
          <Add />
        </Fab>
      </Tooltip>
      <Tooltip placement='left' title='Oddálit' enterDelay={1250}>
        <Fab variant='circular' color='default' size='small' classes={{ root: classes.fabZoomOut }} onClick={zoomOut}>
          <Remove />
        </Fab>
      </Tooltip>
    </ReactMapGL>
  ) : null
}

type QueryViewport = {
  zoom?: number
  longitude?: number
  latitude?: number
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

export default RSMap
