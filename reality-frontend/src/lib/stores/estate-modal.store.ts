import { Subject } from "rxjs"

import { EstateFormValues } from "src/components/estate/CreateEstateModal"
import { EstateQuery } from "../../graphql/queries/generated/graphql"

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
    secondary_type_id: "",
    terrace: false,
    parking: false,
    garage: false,
    swimming_pool: false,
    elevator: false,
    cellar: false,
    furnished: false
  },
  editMode: {
    estateId: ""
  }
}

let state = initialState

export const estateModalStore = {
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
  resetState: () => {
    state = initialState
    subject.next(state)
  },
  openCreateMode: (formValues?: Partial<EstateFormValues>) => {
    state = {
      ...state,
      isOpen: true,
      formValues: {
        ...state.formValues,
        ...formValues
      }
    }
    subject.next(state)
  },
  openEditMode: (estateId: string, estate: Partial<EstateQuery["estate"]>) => {
    const formValues = parseEstateFormValues(estate)
		console.log(formValues)
    state = {
      ...state,
      isOpen: true,
      editMode: {
        estateId
      },
      formValues: {
        ...state.formValues,
        ...formValues
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

const parseEstateFormValues = (estate: Partial<EstateQuery["estate"]>): EstateFormValues => {
  return {
    primary_type_id: estate?.primary_type?.id!,
    secondary_type_id: estate?.secondary_type?.id!,
    city_address: estate?.city_address!,
    postal_code: estate?.postal_code!,
    street_address: estate?.street_address!,
    coordinates: `${estate?.latitude!}, ${estate?.longitude!}`,
    name: estate?.name ?? "",
    description: estate?.description ?? "",
    advert_price: estate?.advert_price ?? ("" as unknown as number),
    estimated_price: estate?.estimated_price ?? ("" as unknown as number),
    land_area: estate?.land_area ?? ("" as unknown as number),
    usable_area: estate?.usable_area ?? ("" as unknown as number),
    terrace: estate?.terrace ?? false,
    parking: estate?.parking ?? false,
    garage: estate?.garage ?? false,
    swimming_pool: estate?.swimming_pool ?? false,
    elevator: estate?.elevator ?? false,
    cellar: estate?.cellar ?? false,
    furnished: estate?.furnished ?? false
  }
}
