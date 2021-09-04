import { Subject } from 'rxjs'

export type ViewportState = {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

const subject = new Subject<ViewportState>()

const initialState: ViewportState = {
  width: 0,
  height: 0,
  latitude: 50.035007,
  longitude: 15.318121,
  zoom: 6.5,
}

let state = initialState

export const viewportStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<ViewportState>>) => subject.subscribe(setState),
  setViewport: (viewport: ViewportState) => {
    state = {
      ...state,
      ...viewport
    }
    subject.next(state)
  },
  clearViewport: () => {
    state = initialState
    subject.next(state)
  },
  initialState
}
