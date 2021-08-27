import React, { ChangeEventHandler, FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';
import { Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { createUseStyles } from 'react-jss'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Bounds, fitBounds, FittedBounds } from 'viewport-mercator-project'
import * as Yup from 'yup'
import * as d3 from 'd3-ease'

import TextInput from '../../forms/TextInput'
import SelectInput, { ISelectInputProps, TSelectOption } from '../../forms/SelectInput'
import Button from '../../forms/Button'
import { getSubtypeOptions, useCodebook } from '../../../lib/data/codebook'
import { SET_FILTERS, SET_VIEWPORT } from '../../../graphql/apollo-client/client-cache/mutations'
import {
  CachedFiltersData,
  CachedFiltersInput,
  CachedViewportData,
  CachedViewportInput,
  LocalQueryResult
} from '../../../types'
import { FILTERS_QUERY, VIEWPORT_QUERY } from '../../../graphql/apollo-client/client-cache/queries'
import { geocodeLocation, pushViewportToUrl } from '../../../utils/utils'
import viewportStore, { CachedViewport } from 'src/store/viewport.store';
import { FlyToInterpolator } from 'react-map-gl';


type TSearchFormProps = {}

type FormValues = {
  address: string
  advertType: string
  advertSubtype: string
  advertFunction: string
  building_type: string
  ownership: string
  price_from: string
  price_to: string
  floor_number: string
  usable_area: string
}

type TOnSubmitFunction = (values: FormValues, actions: FormikHelpers<FormValues>) => void

const useStyles = createUseStyles({
  submitButton: {
    '&&': {
      marginTop: 16
    }
  },
  searchForm: {
    '& > div': {
      marginTop: 8
    }
  },
  priceInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      width: '47.5%'
    }
  }
})

const SearchForm: FunctionComponent<TSearchFormProps> = (props) => {
  const [setCachedFilters] = useMutation<CachedFiltersData, CachedFiltersInput>(SET_FILTERS)

  const { data: { cachedFilters } } = useQuery(FILTERS_QUERY) as LocalQueryResult<CachedFiltersData>

  const [viewportState, setViewportState] = useState<CachedViewport>(viewportStore.initialState)

  useEffect(() => {
    const subs = viewportStore.subscribe(setViewportState)
    return () => subs.unsubscribe()
  }, [])

  const router = useRouter()
  const client = useApolloClient()
  const classes = useStyles()
  const codebook = useCodebook()

  const initialValues: FormValues = {
    address: '', ...cachedFilters
  }

  const formSchema = Yup.object().shape({
    address: Yup.string()
      .max(120, 'Nesmí být delší než 120 znaků'),
    advertType: Yup.string(),
    advertSubtype: Yup.string(),
    advertFunction: Yup.string(),
    building_type: Yup.string(),
    ownership: Yup.string(),
    price_from: Yup.number(),
    price_to: Yup.number(),
    floor_number: Yup.number()
      .lessThan(500, 'Musí být menší než 500'),
    usable_area: Yup.number()
      .integer('Musí být celé kladné číslo'),

  })

  const selectOptionsFactory = (codebookProp: string): TSelectOption[] =>
    Object.entries(codebook[codebookProp])
      .map(entry => ({ label: entry[1], value: entry[0] }))
      .concat([{ label: 'Nerozhoduje', value: '' }])

  const [
    advertTypeOptions,
    advertFunctionOptions,
    ownershipOptions
  ] = ['advertType', 'advertFunction', 'ownership'].map(field => selectOptionsFactory(field))

  const generateAdvertSubtypeOptions = (selectedAdvertType: string): TSelectOption[] => {
    const advertSubtypeOptions = selectOptionsFactory('advertSubtype')
    if (selectedAdvertType.length) {
      return advertSubtypeOptions
        .filter(rec => getSubtypeOptions(selectedAdvertType).includes(rec.label))
        .concat({ label: 'Nerozhoduje', value: '' })
    } else {
      return advertSubtypeOptions
    }
  }

  const checkPriceInput = (dirtyPriceTo: string, dirtyPriceFrom: string, actions: FormikHelpers<FormValues>): boolean => {
    const [priceTo, priceFrom] = [dirtyPriceTo, dirtyPriceFrom].map(price => price.split(' ').join(''))
    if (!(priceTo === '' || priceFrom === '')) {
      if (parseInt(priceFrom) > parseInt(priceTo)) {
        actions.setFieldError('price_from', '"Cena od" musí být menší než "Cena do"')
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const onFormSubmit: TOnSubmitFunction = async (values, actions) => {
    const { address, price_to, price_from, ...newFilters } = values
    // Check validity of price filters
    const isPriceFilterValid = checkPriceInput(price_to, price_from, actions)
    // Submit form
    if (isPriceFilterValid) {
      await handleAddressSearch(address)
      await setCachedFilters({ variables: { cachedFilters: { price_from, price_to, ...newFilters } } })
      // Reset address field upon form submit
      actions.setFieldValue('address', '')
      actions.setSubmitting(false)
    }
  }

  const handleAddressSearch = async (address: string) => {
    if (!address.length) return

    const locationData: any = await geocodeLocation(address)

    if (!locationData.results.length) {
      console.error(`No geocoding result for address "${address}"`)
      return
    }

    const { width, height } = viewportState

    const { northeast, southwest } = locationData.results[0].geometry.viewport
    const bounds: Bounds = [[northeast.lng, northeast.lat], [southwest.lng, southwest.lat]]
    const fittedBounds: FittedBounds = fitBounds({ bounds, width, height })
    const newViewport = { width, height, ...fittedBounds }

    viewportStore.setViewport({
      ...newViewport,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeSin
    } as any)
    
    await pushViewportToUrl(router, newViewport)
  }

  return (
    <div style={{ width: '100%', padding: '24px', boxSizing: 'border-box' }}>
      <Formik initialValues={initialValues} onSubmit={onFormSubmit} validationSchema={formSchema}>
        {formikProps => {
          const {
            values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue,
            setFieldTouched, touched, submitForm
          } = formikProps

          const setAdvertTypeFieldValue: ISelectInputProps['setFieldValue'] = (...args) => {
            setFieldValue('advertSubtype', '', false)
            setFieldValue(...args)
          }

          const handlePriceFieldChange: ChangeEventHandler<HTMLInputElement> = ({ target: { id, value } }) => {
            if (value[0] !== "0" && (/\d/g.test(value[value.length - 1]) || !value.length)) {
              const formattedValue = value.split(' ').join('').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
              setFieldValue(id, formattedValue)
            }
          }

          return (
            <form onSubmit={handleSubmit} className={classes.searchForm}>
              <TextInput
                type="text" label="Adresa" id="address" onBlur={handleBlur} placeholder="Adresa nemovitosti"
                onChange={handleChange} value={values.address} error={errors.address} touched={touched.address}
              />
              <SelectInput
                id="advertFunction" label="Typ nabídky" setFieldValue={setFieldValue}
                value={values.advertFunction} options={advertFunctionOptions} error={errors.advertFunction}
                setFieldTouched={setFieldTouched} touched={touched.advertFunction}
              />
              <SelectInput
                id="advertType" label="Typ nemovitosti" setFieldValue={setAdvertTypeFieldValue}
                value={values.advertType}
                options={advertTypeOptions} error={errors.advertType} setFieldTouched={setFieldTouched}
                touched={touched.advertType}
              />
              <SelectInput
                id="advertSubtype" label="Podtyp nemovitosti" setFieldValue={setFieldValue}
                value={values.advertSubtype}
                options={generateAdvertSubtypeOptions(values.advertType)} error={errors.advertSubtype}
                setFieldTouched={setFieldTouched} touched={touched.advertSubtype} disabled={!values.advertType}
              />
              <SelectInput
                id="ownership" label="Vlastnictví" setFieldValue={setFieldValue} value={values.ownership}
                options={ownershipOptions} error={errors.ownership} setFieldTouched={setFieldTouched}
                touched={touched.ownership}
              />
              <div className={classes.priceInputContainer}>
                <TextInput
                  id="price_from" label="Cena od" type="text" onBlur={handleBlur} placeholder="Nerozhoduje"
                  onChange={handlePriceFieldChange} value={values.price_from} error={errors.price_from}
                  touched={touched.price_from}
                />
                <TextInput
                  id="price_to" label="Cena do" type="text" onBlur={handleBlur} placeholder="Nerozhoduje"
                  onChange={handlePriceFieldChange} value={values.price_to} error={errors.price_to}
                  touched={touched.price_to}
                />
              </div>
              <Button onClick={submitForm} disabled={isSubmitting} className={classes.submitButton}>zobrazit</Button>
              {/*<p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(values, null, 2)}</p>*/}
            </form>
          )
        }}
      </Formik>
    </div>
  )
};

export default SearchForm;
