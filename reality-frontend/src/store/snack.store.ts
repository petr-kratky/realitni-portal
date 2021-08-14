import { Subject } from 'rxjs'

type SnackType = 'error' | 'warning' | 'info' | 'success'

export type SnackState = {
  type: SnackType
  message: string
  isOpen: boolean
}

const subject = new Subject<SnackState>()

const initialState: SnackState = {
  type: 'error',
  message: '',
  isOpen: false
}

let state = initialState

const snackStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<SnackState>>) => subject.subscribe(setState),
  toggle: (type: SnackType, message: string) => {
    state = {
      isOpen: true,
      type,
      message
    }
    subject.next(state)
  },
  handleClose: () => {
    state = {
      ...state,
      isOpen: false
    }
    subject.next(state)
  },
  initialState
}

export default snackStore