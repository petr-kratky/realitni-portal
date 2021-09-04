import { GeoJsonTypes } from "geojson"
import { Subject } from "rxjs"

import { EstateFeature, EstateFeatureCollection } from "../../types"

export type GeojsonState = {
  featureCollection: EstateFeatureCollection
  updateCounter: number
}

const subject = new Subject<GeojsonState>()

const initialState: GeojsonState = {
  featureCollection: { type: "FeatureCollection", features: [] },
  updateCounter: 0
}

let state = initialState

export const geojsonStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<GeojsonState>>) => subject.subscribe(setState),
  updateFeatures: (featureCollection: EstateFeatureCollection) => {
    state = { ...state, featureCollection }
    subject.next(state)
  },
  requestUpdate: () => {
    state = {
      ...state,
      updateCounter: state.updateCounter++
    }
  },
  // removeFeature: (id: string) => {
  //   const features = state.features.filter(ftr => ftr.properties.id !== id)
  //   state = {
  //     ...state,
  //     features
  //   }
  //   subject.next(state)
  // },
  // addFeature: (id: string, lat: number, lng: number) => {
  //   const feature: EstateFeature = {
  //     type: "Feature",
  //     properties: {
  //       id
  //     },
  //     geometry: {
  //       type: "Point",
  //       coordinates: [lng, lat]
  //     }
  //   }
  //   state = {
  //     ...state,
  //     features: [...state.features, feature]
  //   }
  //   subject.next(state)
  // },
  clear: () => {
    state = initialState
    subject.next(state)
  },
  initialState
}
