import { Subject } from "rxjs"

import { EstateFeatureCollection } from "../../types"

export type GeojsonFilter = {
  primary_type: string
  secondary_type: string
  usable_area: string
}

export type GeojsonState = {
  featureCollection: EstateFeatureCollection
  refetchCounter: number
  filter: GeojsonFilter
}

const subject = new Subject<GeojsonState>()

const initialState: GeojsonState = {
  featureCollection: { type: "FeatureCollection", features: [] },
  refetchCounter: 0,
  filter: {
    primary_type: "",
    secondary_type: "",
    usable_area: ""
  }
}

let state = initialState

export const geojsonStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<GeojsonState>>) => subject.subscribe(setState),
  setFeatures: (featureCollection: EstateFeatureCollection) => {
    state = { ...state, featureCollection }
    subject.next(state)
  },
  setFilter: (filter: GeojsonFilter) => {
    state = { ...state, filter }
    subject.next(state)
  },
  refetchFeatures: () => {
    state = {
      ...state,
      refetchCounter: state.refetchCounter++
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
