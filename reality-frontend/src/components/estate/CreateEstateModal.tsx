import React, { FunctionComponent, useEffect } from "react"
import { Formik } from "formik"
import * as Yup from "yup"

import {
  Button,
  TextField,
  Theme,
  makeStyles,
  createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  DialogContentText
} from "@material-ui/core"

import {
  CreateEstateMutationVariables,
  EstateDocument,
  EstateWithoutMediaDocument,
  useCreateEstateMutation,
  useEstateQuery,
  useEstateTypesQuery,
  useUpdateEstateMutation
} from "src/graphql/queries/generated/graphql"
import { estateModalStore, geojsonStore, snackStore } from "src/lib/stores"
import { AppState, FormikSubmitFunction } from "../../types"
import { removeEmptyStrings } from "src/utils/utils"
import { geocodeLocation } from "../../lib/api/geocode"

export type EstateFormValues = {
  coordinates: string
  name?: string
  description?: string
  advert_price?: number
  estimated_price?: number
  street_address: string
  city_address: string
  postal_code: string
  usable_area?: number
  land_area?: number
  primary_type_id: string
  secondary_type_id: string
  terrace?: boolean
  parking?: boolean
  garage?: boolean
  swimming_pool?: boolean
  elevator?: boolean
  cellar?: boolean
  furnished?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemRoot: {
      textTransform: "capitalize"
    },
    selectRoot: {
      textTransform: "capitalize"
    },
    selectLabel: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(0, 1)
    },
    smallField: {
      minWidth: "100%"
    },
    formLabel: {
      marginTop: theme.spacing(2),
      marginBottom: -theme.spacing(1),
      display: "block"
    },
    errorLabel: {
      color: theme.palette.secondary.main
    },
    checkbox: {
      width: 125
    }
  })
)

const EstateModal: FunctionComponent<AppState> = ({ appState }) => {
  const classes = useStyles()
  const theme = useTheme()

  const isXs = useMediaQuery(theme.breakpoints.down("xs"))

  const { data: estateData } = useEstateQuery({
    variables: { id: appState.estateModal.editMode.estateId },
    skip: !appState.estateModal.editMode.estateId
  })

  const {
    data: estateTypesData,
    loading: estateTypesLoading,
    error: estateTypesError,
    refetch: estateTypesRefetch
  } = useEstateTypesQuery()

  const [createEstate] = useCreateEstateMutation()
  const [updateEstate] = useUpdateEstateMutation()

  useEffect(() => {
    if (appState.estateModal.isOpen && estateTypesError) {
      estateTypesRefetch()
    }
  }, [appState.estateModal.isOpen])

  const formSchema: Yup.SchemaOf<EstateFormValues> = Yup.object().shape({
    name: Yup.string()
      .max(128, max => `Název nemovitosti nesmí být delší než ${max} znaků`)
      .trim(),
    coordinates: Yup.string().required("Toto pole je povinné"),
    description: Yup.string()
      .max(4096, max => `Popis nemovitosti nesmí být delší než ${max} znaků`)
      .trim(),
    advert_price: Yup.number().positive(),
    estimated_price: Yup.number().positive(),
    street_address: Yup.string().required("Toto pole je povinné"),
    city_address: Yup.string().required("Toto pole je povinné"),
    postal_code: Yup.string()
      .length(6, "Zadejte platné PSČ ve formátu s mezerou za prvními třemi číslicemi")
      .matches(/(\d{3} \d{2})/g, "Zadejte platné PSČ ve formátu s mezerou za prvními třemi číslicemi")
      .required("Toto pole je povinné"),
    land_area: Yup.number().positive(),
    usable_area: Yup.number().positive(),
    primary_type_id: Yup.string().required("Toto pole je povinné"),
    secondary_type_id: Yup.string().required("Toto pole je povinné"),
    terrace: Yup.bool(),
    parking: Yup.bool(),
    garage: Yup.bool(),
    swimming_pool: Yup.bool(),
    elevator: Yup.bool(),
    cellar: Yup.bool(),
    furnished: Yup.bool()
  })

  const handleClose = (): void => {
    estateModalStore.resetState()
  }

  const onFormSubmit: FormikSubmitFunction<EstateFormValues> = async ({ coordinates, ...args }, actions) => {
    const coords = coordinates.split(",").map(str => parseFloat(str.trim()))
    if (coords.length !== 2) {
      actions.setFieldError("coordinates", "Souřadnice nejsou ve spravném formátu")
      return
    }
    const [latitude, longitude] = coords
    if (latitude > 90 || latitude < -90) {
      actions.setFieldError("coordinates", "Zeměpisná šířka musí být v rozmezí od -90 až 90")
      return
    }
    if (longitude > 180 || longitude < -180) {
      actions.setFieldError("coordinates", "Zeměpisná délka musí být v rozmezí od -180 do 180")
      return
    }
    const { primary_type_id, secondary_type_id, ...cleanArgs } = removeEmptyStrings(args)
    const variables: CreateEstateMutationVariables = {
      // @ts-ignore
      estateInput: {
        primary_type_id: parseInt(primary_type_id!),
        secondary_type_id: parseInt(secondary_type_id!),
        latitude,
        longitude,
        ...cleanArgs
      }
    }
    try {
      if (appState.estateModal.editMode.estateId) {
        const response = await updateEstate({
          variables: { id: appState.estateModal.editMode.estateId, estateInput: variables.estateInput },
          refetchQueries: [
            { query: EstateDocument, variables: { id: appState.estateModal.editMode.estateId } },
            { query: EstateWithoutMediaDocument, variables: { id: appState.estateModal.editMode.estateId } }
          ]
        })
        if (response.data) {
          geojsonStore.refetchFeatures()
          snackStore.toggle("success", "Nemovitost uložena")
        }
      } else {
        const response = await createEstate({ variables })
        if (response.data) {
          geojsonStore.refetchFeatures()
          snackStore.toggle("success", "Nemovitost vytvořena")
        }
      }
      handleClose()
    } catch (err: any) {
      snackStore.toggle("error", "Nemovitost se nepodařilo uložit")
    }
  }

  return (
    <Dialog scroll='paper' open={appState.estateModal.isOpen} onClose={handleClose} fullScreen={isXs}>
      <Formik
        initialValues={appState.estateModal.formValues}
        onSubmit={onFormSubmit}
        validationSchema={formSchema}
        validateOnChange
      >
        {formikProps => {
          const { values, errors, touched, isSubmitting, handleChange, handleSubmit, submitForm, setFieldValue } =
            formikProps

          if (values.primary_type_id === "" && values.secondary_type_id !== "") {
            setFieldValue("secondary_type_id", "")
          }

          const onAddressGeocode = async (): Promise<void> => {
            const composedAddress = `${values.street_address} ${values.city_address} ${values.postal_code}`
            const geocodeResults = await geocodeLocation({ address: composedAddress })
            if (!geocodeResults?.results.length) {
              snackStore.toggle("error", `Pro zadanou adresu nebyly nalezeny žádné souřadnice`)
              setFieldValue("coordinates", "")
            } else {
              const { lat, lng } = geocodeResults.results[0].geometry.location
              setFieldValue("coordinates", `${lat}, ${lng}`)
            }
          }

          return (
            <>
              <DialogTitle>
                {appState.estateModal.editMode.estateId ? "Upravit nemovitost" : "Nová nemovitost"}
              </DialogTitle>
              <DialogContent dividers>
                {appState.estateModal.editMode.estateId && estateData?.estate && (
                  <>
                    <DialogContentText>
                      Vytvořil uživatel <b>{estateData.estate.created_by.username}</b> dne{" "}
                      <b>{new Date(estateData.estate.created_on).toLocaleDateString()}</b> v{" "}
                      <b>{new Date(estateData.estate.created_on).toLocaleTimeString().slice(0, -3)}</b>.
                    </DialogContentText>
                    <DialogContentText>
                      Naposledy upravil uživatel <b>{estateData.estate.last_modified_by.username}</b> dne{" "}
                      <b>{new Date(estateData.estate.last_modified_on).toLocaleDateString()}</b> v{" "}
                      <b>{new Date(estateData.estate.last_modified_on).toLocaleTimeString().slice(0, -3)}</b>.
                    </DialogContentText>
                  </>
                )}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Název
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id='name'
                        onChange={handleChange}
                        value={values.name}
                        error={touched.name && !!errors.name?.length}
                        helperText={(touched.name && errors.name) ?? ""}
                        margin='none'
                        label='Název nemovitosti'
                        fullWidth
                        variant='outlined'
                        size='small'
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Poloha
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id='coordinates'
                        onChange={handleChange}
                        value={values.coordinates}
                        error={touched.coordinates && !!errors.coordinates?.length}
                        helperText={
                          (touched.coordinates && errors.coordinates) ?? "Zadejte zeměpisné souřadnice oddělené čárkou"
                        }
                        label='Souřadnice'
                        placeholder='50.003606517, 14.673597798'
                        margin='none'
                        fullWidth={true}
                        variant='outlined'
                        size='small'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='street_address'
                        onChange={handleChange}
                        value={values.street_address}
                        error={touched.street_address && !!errors.street_address?.length}
                        helperText={(touched.street_address && errors.street_address) ?? ""}
                        label='Ulice, č.p.'
                        margin='none'
                        autoComplete='off'
                        fullWidth={true}
                        variant='outlined'
                        size='small'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='city_address'
                        onChange={handleChange}
                        value={values.city_address}
                        error={touched.city_address && !!errors.city_address?.length}
                        helperText={(touched.city_address && errors.city_address) ?? ""}
                        label='Město'
                        margin='none'
                        autoComplete='off'
                        fullWidth={true}
                        variant='outlined'
                        size='small'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='postal_code'
                        onChange={handleChange}
                        value={values.postal_code}
                        error={touched.postal_code && !!errors.postal_code?.length}
                        helperText={(touched.postal_code && errors.postal_code) ?? ""}
                        label='PSČ'
                        margin='none'
                        autoComplete='off'
                        fullWidth={true}
                        variant='outlined'
                        size='small'
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={onAddressGeocode} color='default' size='small'>
                        Doplnit souřadnice
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Kategorie
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.smallField}>
                        <InputLabel
                          className={classes.selectLabel}
                          variant='outlined'
                          margin='dense'
                          id='primary_type_id-label'
                        >
                          Typ nemovitosti
                        </InputLabel>
                        <Select
                          name='primary_type_id'
                          labelId='primary_type_id-label'
                          onChange={handleChange}
                          value={values.primary_type_id}
                          error={touched.primary_type_id && !!errors.primary_type_id?.length}
                          classes={{ root: classes.menuItemRoot }}
                          margin='dense'
                          variant='outlined'
                        >
                          {estateTypesData?.estatePrimaryTypes.map(({ id, desc_cz }) => (
                            <MenuItem key={id} classes={{ root: classes.menuItemRoot }} value={id}>
                              {desc_cz}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText error={!!touched.primary_type_id && !!errors.primary_type_id}>
                          {(touched.primary_type_id && errors.primary_type_id) ?? ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.smallField}>
                        <InputLabel
                          className={classes.selectLabel}
                          variant='outlined'
                          margin='dense'
                          id='secondary_type_id-label'
                        >
                          Podtyp nemovitosti
                        </InputLabel>
                        <Select
                          name='secondary_type_id'
                          labelId='secondary_type_id-label'
                          onChange={handleChange}
                          value={values.secondary_type_id}
                          error={touched.secondary_type_id && !!errors.secondary_type_id?.length}
                          classes={{ root: classes.menuItemRoot }}
                          disabled={!values.primary_type_id}
                          margin='dense'
                          variant='outlined'
                        >
                          {values.primary_type_id
                            ? estateTypesData?.estatePrimaryTypes
                                .find(pType => pType.id === values.primary_type_id)
                                ?.secondary_types.map(({ id, desc_cz }) => (
                                  <MenuItem key={id} classes={{ root: classes.menuItemRoot }} value={id}>
                                    {desc_cz}
                                  </MenuItem>
                                ))
                            : null}
                        </Select>
                        <FormHelperText error={!!touched.secondary_type_id && !!errors.secondary_type_id}>
                          {(touched.secondary_type_id && errors.secondary_type_id) ?? "Zvolte nejprve typ nemovitosti"}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Cena
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='advert_price'
                        onChange={handleChange}
                        value={values.advert_price}
                        error={touched.advert_price && !!errors.advert_price?.length}
                        helperText={(touched.advert_price && errors.advert_price) ?? ""}
                        className={classes.smallField}
                        label='Inzertní cena'
                        type='number'
                        margin='none'
                        variant='outlined'
                        size='small'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>Kč</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='estimated_price'
                        name='estimated_price'
                        onChange={handleChange}
                        value={values.estimated_price}
                        error={touched.estimated_price && !!errors.estimated_price?.length}
                        helperText={(touched.estimated_price && errors.estimated_price) ?? ""}
                        className={classes.smallField}
                        label='Odhadovaná cena'
                        type='number'
                        margin='none'
                        variant='outlined'
                        size='small'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>Kč</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Plocha
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='usable_area'
                        onChange={handleChange}
                        value={values.usable_area}
                        error={touched.usable_area && !!errors.usable_area?.length}
                        helperText={(touched.usable_area && errors.usable_area) ?? ""}
                        className={classes.smallField}
                        label='Užitná plocha'
                        type='number'
                        margin='none'
                        variant='outlined'
                        size='small'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>m2</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id='land_area'
                        onChange={handleChange}
                        value={values.land_area}
                        error={touched.land_area && !!errors.land_area?.length}
                        helperText={(touched.land_area && errors.land_area) ?? ""}
                        className={classes.smallField}
                        label='Plocha pozemku'
                        type='number'
                        margin='none'
                        variant='outlined'
                        size='small'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>m2</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Doplňky
                      </Typography>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='terrace'
                              onChange={handleChange}
                              value={values.terrace}
                              checked={!!values.terrace}
                              color='primary'
                            />
                          }
                          label='Terasa'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='parking'
                              onChange={handleChange}
                              value={values.parking}
                              checked={!!values.parking}
                              color='primary'
                            />
                          }
                          label='Parkování'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='garage'
                              onChange={handleChange}
                              value={values.garage}
                              checked={!!values.garage}
                              color='primary'
                            />
                          }
                          label='Garáž'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='swimming_pool'
                              onChange={handleChange}
                              value={values.swimming_pool}
                              checked={!!values.swimming_pool}
                              color='primary'
                            />
                          }
                          label='Bazén'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='furnished'
                              onChange={handleChange}
                              value={values.furnished}
                              checked={!!values.furnished}
                              color='primary'
                            />
                          }
                          label='Vybavení'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='elevator'
                              onChange={handleChange}
                              value={values.elevator}
                              checked={!!values.elevator}
                              color='primary'
                            />
                          }
                          label='Výtah'
                        />
                      </Grid>
                      <Grid item className={classes.checkbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id='cellar'
                              onChange={handleChange}
                              value={values.cellar}
                              checked={!!values.cellar}
                              color='primary'
                            />
                          }
                          label='Sklepení'
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='subtitle2' className={classes.formLabel}>
                        Popis
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id='description'
                        onChange={handleChange}
                        value={values.description}
                        error={touched.description && !!errors.description?.length}
                        helperText={(touched.description && errors.description) ?? ""}
                        margin='none'
                        label='Popis nemovitosti'
                        variant='outlined'
                        size='small'
                        multiline
                        fullWidth
                        rows={values.description?.length ? 10 : 4}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color='default'>
                  zavřít
                </Button>
                <Button onClick={submitForm} disabled={isSubmitting} color='primary'>
                  {appState.estateModal.editMode.estateId ? "uložit změny" : "vytvořit"}
                  {isSubmitting && (
                    <>
                      &nbsp;
                      <CircularProgress size={20} color='primary' />{" "}
                    </>
                  )}
                </Button>
              </DialogActions>
            </>
          )
        }}
      </Formik>
    </Dialog>
  )
}

export default EstateModal
