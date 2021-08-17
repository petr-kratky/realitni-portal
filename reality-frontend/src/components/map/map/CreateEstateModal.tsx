import React, { FunctionComponent, useState, useEffect } from "react"
import { Formik } from "formik"
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
  DialogContentText,
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
  useMediaQuery
} from "@material-ui/core"
import * as Yup from "yup"

import createEstateModalStore, { CreateEstateModalState } from "../../../store/create-estate-modal.store"
import { useCreateEstateMutation, useEstateTypesQuery } from "src/graphql/queries/generated/graphql"
import snackStore, { SnackState } from "src/store/snack.store"
import { FormikSubmitFunction } from "../../../types"
import { parseIntParam, removeEmptyStrings } from "src/utils/utils"

export type CreateEstateFormValues = {
  coordinates: string
  name?: string
  description?: string
  advert_price?: number
  estimated_price?: number
  street_address?: string
  city_address?: string
  postal_code?: string
  usable_area?: number
  land_area?: number
  primary_type_id?: string
  secondary_type_id?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemRoot: {
      textTransform: "capitalize"
    },
    selectRoot: {
      textTransform: "capitalize"
    },
    smallField: {
      // margin: theme.spacing(1, 0.5, 0.5, 0.5),
      minWidth: "100%"
    },
    formLabel: {
      marginTop: theme.spacing(2),
      marginBottom: -theme.spacing(1),
      display: "block"
    }
  })
)

const CreateEstateModal: FunctionComponent = () => {
  const classes = useStyles()
  const theme = useTheme()

  const isXs = useMediaQuery(theme.breakpoints.down("xs"))

  const {
    data: estateTypesData,
    loading: estateTypesLoading,
    error: estateTypesError,
    refetch: estateTypesRefetch
  } = useEstateTypesQuery()

  const [createEstate] = useCreateEstateMutation()

  const [createEstateModalState, setCreateEstateModalState] = useState<CreateEstateModalState>(
    createEstateModalStore.initialState
  )
  const [_, setSnackState] = useState<SnackState>(snackStore.initialState)

  useEffect(() => {
    const createEstateModalStoreSub = createEstateModalStore.subscribe(setCreateEstateModalState)
    const snackStoreSub = snackStore.subscribe(setSnackState)
    return () => {
      createEstateModalStoreSub.unsubscribe()
      snackStoreSub.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (createEstateModalState.isOpen && estateTypesError) {
      estateTypesRefetch()
    }
  }, [createEstateModalState.isOpen])

  const formSchema: Yup.SchemaOf<CreateEstateFormValues> = Yup.object().shape({
    name: Yup.string()
      .max(128, max => `Název nemovitosti nesmí být delší než ${max} znaků`)
      .trim(),
    coordinates: Yup.string().required("Toto pole je povinné"),
    description: Yup.string().max(4096).trim(),
    advert_price: Yup.number().positive(),
    estimated_price: Yup.number().positive(),
    street_address: Yup.string(),
    city_address: Yup.string(),
    postal_code: Yup.string()
      .length(5)
      .matches(/(\d{5})/g),
    land_area: Yup.number().positive(),
    usable_area: Yup.number().positive(),
    primary_type_id: Yup.string(),
    secondary_type_id: Yup.string()
  })

  const onFormSubmit: FormikSubmitFunction<CreateEstateFormValues> = async ({ coordinates, ...args }, actions) => {
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
    try {
      const response = await createEstate({
        variables: {
          estateInput: {
            primary_type_id: parseIntParam(primary_type_id),
            secondary_type_id: parseIntParam(secondary_type_id),
            latitude,
            longitude,
            ...cleanArgs
          }
        }
      })
      console.log(response.data?.createEstate)
      createEstateModalStore.close()
      snackStore.toggle("success", "Nemovitost vytvořena!")
    } catch (err) {
      // @ts-ignore
      snackStore.toggle("error", err.message)
    }
  }

  return (
    <Dialog
      scroll='paper'
      open={createEstateModalState.isOpen}
      onClose={createEstateModalStore.close}
      fullScreen={isXs}
    >
      <Formik
        initialValues={createEstateModalState.formValues}
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

          return (
            <>
              <DialogTitle>Nová nemovitost</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                  <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                  </DialogContentText>

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
                      />
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
                        <InputLabel id='primary_type_id-label'>Typ nemovitosti</InputLabel>
                        <Select
                          name='primary_type_id'
                          labelId='primary_type_id-label'
                          onChange={handleChange}
                          value={values.primary_type_id}
                          error={touched.primary_type_id && !!errors.primary_type_id?.length}
                          classes={{ root: classes.menuItemRoot }}
                          margin='none'
                        >
                          <MenuItem classes={{ root: classes.menuItemRoot }} value={""}>
                            &nbsp;
                          </MenuItem>
                          {estateTypesData?.estatePrimaryTypes.map(({ id, desc_cz }) => (
                            <MenuItem key={id} classes={{ root: classes.menuItemRoot }} value={id}>
                              {desc_cz}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{(touched.primary_type_id && errors.primary_type_id) ?? ""}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.smallField}>
                        <InputLabel id='secondary_type_id-label'>Podtyp nemovitosti</InputLabel>
                        <Select
                          name='secondary_type_id'
                          labelId='secondary_type_id-label'
                          onChange={handleChange}
                          value={values.secondary_type_id}
                          error={touched.secondary_type_id && !!errors.secondary_type_id?.length}
                          classes={{ root: classes.menuItemRoot }}
                          disabled={!values.primary_type_id}
                          margin='none'
                        >
                          <MenuItem classes={{ root: classes.menuItemRoot }} value={""}>
                            &nbsp;
                          </MenuItem>
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
                        <FormHelperText>
                          <span>Zvolte nejprve typ nemovitosti</span>
                          <span>{(touched.secondary_type_id && errors.secondary_type_id) ?? ""}</span>
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
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>m2</InputAdornment>
                        }}
                      />
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
                        multiline
                        fullWidth
                        rows={6}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={createEstateModalStore.close} color='default'>
                    zavřít
                  </Button>
                  <Button onClick={submitForm} disabled={isSubmitting} color='primary'>
                    vytvořit
                    {isSubmitting && (
                      <>
                        &nbsp;
                        <CircularProgress size={20} color='primary' />{" "}
                      </>
                    )}
                  </Button>
                </DialogActions>
              </form>
            </>
          )
        }}
      </Formik>
    </Dialog>
  )
}

export default CreateEstateModal
