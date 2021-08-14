import { Subject } from 'rxjs'

import { CreateEstateFormValues } from 'src/components/map/map/CreateEstateModal'

export type CreateEstateModalState = {
  formValues: CreateEstateFormValues
  isOpen: boolean
}

const subject = new Subject<CreateEstateModalState>()

const initialState: CreateEstateModalState = {
  formValues: {
    coordinates: "",
    name: ""
  },
  isOpen: false
}

let state = initialState

const createEstateModalStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<CreateEstateModalState>>) => subject.subscribe(setState),
  updateFormValues: (formValues: CreateEstateFormValues) => {
    state = {
      ...state,
      formValues: {
        ...state.formValues,
        ...formValues
      }
    }
    subject.next(state)
  },
  resetFormValues: () => {
    state = {
      ...state,
      formValues: initialState.formValues
    }
    subject.next(state)
  },
  open: () => {
    state = {
      ...state,
      isOpen: true
    }
    subject.next(state)
  },
  close: () => {
    state = {
      ...state,
      isOpen: false
    }
    subject.next(state)
  },
  initialState
}

export default createEstateModalStore