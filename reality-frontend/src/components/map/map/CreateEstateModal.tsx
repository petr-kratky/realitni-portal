import React, { FunctionComponent, useState } from "react";
import { Formik } from "formik";
import { Button, TextField, Theme, makeStyles, createStyles, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, CircularProgress } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import * as Yup from "yup";

import { useCreateEstateMutation } from "src/graphql/queries/generated/graphql";
import { FormikSubmitFunction } from '../../../types'


type FormValues = {
  coordinates: string,
  name?: string
}


export type CreateEstateModalProps = {
  isVisible: boolean
  handleClose: () => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({

}));


const CreateEstateModal: FunctionComponent<CreateEstateModalProps> = ({ isVisible, handleClose }) => {
  const classes = useStyles();

  const [responseError, setResponseError] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)

  const [createEstate] = useCreateEstateMutation()

  const initialValues: FormValues = {
    coordinates: "",
    name: ""
  }

  const formSchema: Yup.SchemaOf<FormValues> = Yup.object().shape({
    name: Yup.string()
      .max(128, (max) => `Název nemovitosti nesmí být delší než ${max} znaků`)
      .trim(),
    coordinates: Yup.string()
      .required('Toto pole je povinné')
  })

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const onFormSubmit: FormikSubmitFunction<FormValues> = async ({ coordinates, name }, actions) => {
    const coords = coordinates.split(',').map(str => parseFloat(str.trim()))

    if (coords.length !== 2) {
      actions.setFieldError('coordinates', 'Souřadnice nejsou ve spravném formátu')
      return
    }

    const [latitude, longitude] = coords

    if (latitude > 90 || latitude < -90) {
      actions.setFieldError('coordinates', 'Zeměpisná šířka musí být v rozmezí od -90 až 90')
      return
    }

    if (longitude > 180 || longitude < -180) {
      actions.setFieldError('coordinates', 'Zeměpisná délka musí být v rozmezí od -180 do 180')
      return
    }

    try {
      const response = await createEstate({
        variables: { estateInput: { latitude, longitude, name } }
      })

      console.log(response.data?.createEstate)

      handleClose()

    } catch (err) {
      setResponseError(err.message)
      setSnackOpen(true)
    }
  }

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={onFormSubmit}
        validationSchema={formSchema}
        validateOnChange
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleSubmit,
            submitForm
          } = formikProps;

          return (
            <>
              <DialogTitle>Nová nemovitost</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                  </DialogContentText>
                  <TextField
                    id="name"
                    onChange={handleChange}
                    value={values.name}
                    error={touched.name && !!errors.name?.length}
                    helperText={(touched.name && errors.name) ?? ""}
                    margin="dense"
                    label="Název nemovitosti"
                    fullWidth={true}
                  />
                  <TextField
                    id="coordinates"
                    onChange={handleChange}
                    value={values.coordinates}
                    error={touched.coordinates && !!errors.coordinates?.length}
                    helperText={(touched.coordinates && errors.coordinates) ?? "Zadejte zeměpisné souřadnice oddělené čárkou"}
                    label="Souřadnice"
                    placeholder="50.003606517, 14.673597798"
                    margin="dense"
                    fullWidth={true}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color='default'
                  >
                    zavřít
                  </Button>
                  <Button
                    onClick={submitForm}
                    disabled={isSubmitting}
                    color='primary'
                  >
                    vytvořit
                    {isSubmitting && <>&nbsp;<CircularProgress size={20} color="primary" /> </>}
                  </Button>
                </DialogActions>
              </form>
            </>
          );
        }}
      </Formik>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert variant="filled" severity="error" elevation={6} onClose={handleSnackClose}>{responseError}</Alert>
      </Snackbar>
    </Dialog>
  );
};

CreateEstateModal.defaultProps = {
  isVisible: false
}

export default CreateEstateModal;
