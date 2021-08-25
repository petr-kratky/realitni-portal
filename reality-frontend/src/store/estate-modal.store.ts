import { Subject } from "rxjs"

import { EstateFormValues } from "src/components/map/map/CreateEstateModal"

export type EstateModalState = {
  formValues: EstateFormValues
  isOpen: boolean
  editMode: {
    estateId: string
  }
}

const subject = new Subject<EstateModalState>()

const initialState: EstateModalState = {
  isOpen: false,
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
  editMode: {
    estateId: ""
  },
}

let state = initialState

const estateModalStore = {
  subscribe: (setState: React.Dispatch<React.SetStateAction<EstateModalState>>) => subject.subscribe(setState),
  updateFormValues: (formValues: Partial<EstateFormValues>) => {
    state = {
      ...state,
      formValues: {
        ...state.formValues,
        ...formValues
      }
    }
    subject.next(state)
  },
  // resetFormValues: () => {
  //   state = {
  //     ...state,
  //     formValues: initialState.formValues
  //   }
  //   subject.next(state)
  // },
  resetState: () => {
    state = initialState
    subject.next(state)
  },
  openCreateMode: () => {
    state = {
      ...state,
      isOpen: true
    }
    subject.next(state)
  },
  openEditMode: (estateId: string, formValues: EstateFormValues) => {
    state = {
      ...state,
      isOpen: true,
      formValues,
      editMode: {
        estateId
      }
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

export default estateModalStore
