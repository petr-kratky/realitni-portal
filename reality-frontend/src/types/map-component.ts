import { EasingFunction, TRANSITION_EVENTS, TransitionInterpolator } from 'react-map-gl'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { Feature, Point, FeatureCollection } from 'geojson'

import { ContextMenuProps } from '../components/map/map/ContextMenu'
import { CustomPopupProps } from '../components/map/map/CustomPopup'


export type MapComponentProps = {
  children: ReactNode
  contextMenuProps: ContextMenuProps
  setContextMenuProps: Dispatch<SetStateAction<ContextMenuProps>>
  popupProps: CustomPopupProps
  setPopupProps: Dispatch<SetStateAction<CustomPopupProps>>
}

export type MapViewport = {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
  altitude?: number;
  maxZoom?: number;
  minZoom?: number;
  maxPitch?: number;
  minPitch?: number;
  transitionDuration?: number | 'auto';
  transitionInterpolator?: TransitionInterpolator;
  transitionInterruption?: TRANSITION_EVENTS;
  transitionEasing?: EasingFunction;
}

export type GeoJSONRequestParams = {
  columns: Array<string>
  bounds: Array<number>
  filter?: string
  geom_column?: string
}

export type EstateClusterProperties = {
  cluster: boolean
  cluster_id: number
  point_count: number
  point_count_abbreviated: number
}

export type EstateFeatureProperties = {
  id: string
}


export type EstateCluster = Feature<Point, EstateClusterProperties> & {
  id: number
}

export type EstateFeature = Feature<Point, EstateFeatureProperties>

export type EstateFeatureCollection = FeatureCollection<Point, EstateFeatureProperties>
