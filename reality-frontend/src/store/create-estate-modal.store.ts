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
    name: "",
    advert_price: "" as unknown as number,
    estimated_price: "" as unknown as number,
    city_address: "",
    street_address: "",
    land_area: "" as unknown as number,
    usable_area: "" as unknown as number,
    postal_code: "",
    description: "",
    primary_type_id: "",
    secondary_type_id: ""
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