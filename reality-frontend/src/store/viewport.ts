import { Subject } from 'rxjs'

export type CachedViewport = {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

const subject = new Subject<CachedViewport>()

const initialState: CachedViewport = {
  width: 0,
  height: 0,
  latitude: 50.035007,
  longitude: 15.318121,
  zoom: 6.5,
}

let state = initialState

const viewportStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<CachedViewport>>) => subject.subscribe(setState),
  setViewport: (viewport: CachedViewport) => subject.next({
    ...state,
    ...viewport
  }),
  clearViewport: () => subject.next(initialState),
  initialState
}

export default viewportStore