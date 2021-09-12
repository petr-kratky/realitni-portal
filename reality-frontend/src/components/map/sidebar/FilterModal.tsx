import React, { useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  createStyles,
  makeStyles,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Checkbox,
  ListItemText,
  CircularProgress
} from "@material-ui/core"

import { AppState } from "../../../types"
import { useEstateTypesQuery } from "../../../graphql/queries/generated/graphql"
import { geojsonStore } from "../../../lib/stores"

type ComponentProps = {
  open: boolean
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categoryLabel: {
      marginBottom: -theme.spacing(0.5),
      display: "block"
    },
    selectLabel: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(0, 1)
    },
    selectDefaultOption: {
      fontStyle: "italic"
    }
  })
)

const Component: React.FunctionComponent<ComponentProps & AppState> = ({
  open,
  onClose,
  appState: {
    geojson: { filter }
  }
}) => {
  const classes = useStyles()

  const { data: estateTypesData } = useEstateTypesQuery()

  const upperRangeSchema = (field: string) =>
    Yup.number().when(`${field}_from`, from =>
      from
        ? Yup.number().min(from, "Musí být větší než spodní hranice")
        : Yup.number().min(0, "Nesmí být záporné číslo")
    )

  const initialValues = useMemo(
    () => ({
      primary_type: filter.primary_type,
      secondary_type: filter.secondary_type,
      advert_price_from: filter.advert_price.split(",")[0] ?? "",
      advert_price_to: filter.advert_price.split(",")[1] ?? "",
      estimated_price_from: filter.estimated_price.split(",")[0] ?? "",
      estimated_price_to: filter.estimated_price.split(",")[1] ?? "",
      usable_area_from: filter.usable_area.split(",")[0] ?? "",
      usable_area_to: filter.usable_area.split(",")[1] ?? "",
      land_area_from: filter.land_area.split(",")[0] ?? "",
      land_area_to: filter.land_area.split(",")[1] ?? ""
    }),
    [filter]
  )

  const formik = useFormik({
    initialValues,
    onSubmit: async values => {
      geojsonStore.setFilter({
        primary_type: values.primary_type,
        secondary_type: values.secondary_type,
        advert_price: `${values.advert_price_from},${values.advert_price_to}`,
        estimated_price: `${values.estimated_price_from},${values.estimated_price_to}`,
        usable_area: `${values.usable_area_from},${values.usable_area_to}`,
        land_area: `${values.land_area_from},${values.land_area_to}`
      })
    },
    validationSchema: Yup.object().shape({
      primary_type: Yup.string(),
      advert_price_to: upperRangeSchema("advert_price"),
      estimated_price_to: upperRangeSchema("estimated_price"),
      usable_area_to: upperRangeSchema("usable_area"),
      land_area_to: upperRangeSchema("land_area")
    })
  })

  React.useEffect(() => {
    formik.setFieldValue("secondary_type", [])
  }, [formik.values.primary_type])

  React.useEffect(() => {
    formik.setValues(initialValues)
  }, [filter])

  const renderSelectedSecondaryTypes = (selected: string[]) => {
    return selected
      .map(id => {
        const type = estateTypesData?.estateSecondaryTypes.find(type => type.id === id)
        return type?.desc_cz
      })
      .join(", ")
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async () => {
    await formik.submitForm()
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Filtrovat nemovitosti</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='subtitle2' className={classes.categoryLabel}>
              Kategorie
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel className={classes.selectLabel} variant='outlined' margin='dense' id='primary-type-label'>
                Typ nemovitosti
              </InputLabel>
              <Select
                name='primary_type'
                labelId='primary-type-label'
                onChange={formik.handleChange}
                value={formik.values.primary_type}
                margin='dense'
                variant='outlined'
              >
                <MenuItem value='' className={classes.selectDefaultOption}>
                  Nerozhoduje
                </MenuItem>
                {estateTypesData?.estatePrimaryTypes.map(({ id, desc_cz }) => (
                  <MenuItem key={id} value={id}>
                    {desc_cz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {formik.values.primary_type && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel className={classes.selectLabel} variant='outlined' margin='dense' id='secondary-type-label'>
                  Podtyp nemovitosti
                </InputLabel>
                <Select
                  multiple
                  value={formik.values.secondary_type}
                  name='secondary_type'
                  labelId='secondary-type-label'
                  onChange={formik.handleChange}
                  margin='dense'
                  variant='outlined'
                  disabled={!formik.values.primary_type}
                  MenuProps={{ variant: "menu", style: { maxHeight: 400 } }}
                  // @ts-ignore
                  renderValue={renderSelectedSecondaryTypes}
                >
                  {formik.values.primary_type
                    ? estateTypesData?.estatePrimaryTypes
                        .find(pType => pType.id === formik.values.primary_type)
                        ?.secondary_types.map(({ id, desc_cz }) => (
                          <MenuItem key={id} value={id}>
                            {/* @ts-ignore */}
                            <Checkbox size='small' checked={formik.values.secondary_type.indexOf(id) > -1} />
                            <ListItemText primary={desc_cz} />
                          </MenuItem>
                        ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
          )}
          <RangeInput formik={formik} field='advert_price' title='Inzertní cena' units='Kč' />
          <RangeInput formik={formik} field='estimated_price' title='Odhadní cena' units='Kč' />
          <RangeInput formik={formik} field='usable_area' title='Užitná plocha' units='m2' />
          <RangeInput formik={formik} field='land_area' title='Plocha pozemku' units='m2' />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>zavřít</Button>
        <Button color='primary' onClick={handleSubmit} disabled={formik.isSubmitting}>
          aplikovat
          {formik.isSubmitting && (
            <>
              &nbsp;&nbsp;
              <CircularProgress size={20} color='primary' />{" "}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

type RangeInputProps = {
  formik: any
  field: string
  title: string
  units?: string
}

const RangeInput: React.FunctionComponent<RangeInputProps> = ({ formik, field, title, units = "" }) => {
  const classes = useStyles()
  const from = `${field}_from`
  const to = `${field}_to`
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Typography variant='subtitle2' className={classes.categoryLabel}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id={from}
          onChange={formik.handleChange}
          value={formik.values[from]}
          error={formik.touched[from] && !!formik.errors[from]?.length}
          helperText={(formik.touched[from] && formik.errors[from]) ?? ""}
          fullWidth
          label='Od'
          type='number'
          margin='none'
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: units ? <InputAdornment position='start'>{units}</InputAdornment> : null
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id={to}
          onChange={formik.handleChange}
          value={formik.values[to]}
          error={formik.touched[to] && !!formik.errors[to]?.length}
          helperText={(formik.touched[to] && formik.errors[to]) ?? ""}
          fullWidth
          label='Do'
          type='number'
          margin='none'
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: units ? <InputAdornment position='start'>{units}</InputAdornment> : null
          }}
        />
      </Grid>
    </React.Fragment>
  )
}

export default Component
