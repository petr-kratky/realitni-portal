import { EasingFunction, FlyToInterpolator, TransitionInterpolator } from "react-map-gl"
import { easeCubic } from "d3-ease"
import { Subject } from "rxjs"

type Transition = {
  transitionDuration?: number | "auto"
  transitionInterpolator?: TransitionInterpolator
  transitionEasing?: EasingFunction
}

export type ViewportState = Transition & {
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
}

const transition = {
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeCubic,
  transitionDuration: 1500
}

const subject = new Subject<ViewportState>()

const initialState: ViewportState = {
  width: 0,
  height: 0,
  latitude: 50.035007,
  longitude: 15.318121,
  zoom: 6.5
}

let state = initialState

export const viewportStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<ViewportState>>) => subject.subscribe(setState),
  setViewport: (viewport: ViewportState, fly = false, transitionDuration = transition.transitionDuration) => {
    if (fly) {
      state = {
        ...state,
        ...viewport,
        ...transition,
				transitionDuration
      }
    } else {
      state = {
        ...state,
        ...viewport
      }
    }
    subject.next(state)
  },
  clearViewport: () => {
    state = initialState
    subject.next(state)
  },
  initialState
}
