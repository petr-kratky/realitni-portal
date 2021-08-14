import React, { FunctionComponent, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button, TextField, Theme, makeStyles, createStyles, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, CircularProgress } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import * as Yup from "yup";

import createEstateModalStore, { CreateEstateModalState } from '../../../store/create-estate-modal.store'
import { useCreateEstateMutation } from "src/graphql/queries/generated/graphql";
import snackStore, { SnackState } from 'src/store/snack.store'
import { FormikSubmitFunction } from '../../../types'


export type CreateEstateFormValues = {
  coordinates: string,
  name?: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({

}));


const CreateEstateModal: FunctionComponent = () => {
  const classes = useStyles();

  const [createEstate] = useCreateEstateMutation()

  const [createEstateModalState, setCreateEstateModalState] = useState<CreateEstateModalState>(createEstateModalStore.initialState)
  const [_, setSnackState] = useState<SnackState>(snackStore.initialState)

  useEffect(() => {
    const createEstateModalStoreSub = createEstateModalStore.subscribe(setCreateEstateModalState)
    const snackStoreSub = snackStore.subscribe(setSnackState)
    return () => { 
      createEstateModalStoreSub.unsubscribe()
      snackStoreSub.unsubscribe()
    }
  }, [])

  
  const formSchema: Yup.SchemaOf<CreateEstateFormValues> = Yup.object().shape({
    name: Yup.string()
      .max(128, (max) => `Název nemovitosti nesmí být delší než ${max} znaků`)
      .trim(),
    coordinates: Yup.string()
      .required('Toto pole je povinné')
  })

  const onFormSubmit: FormikSubmitFunction<CreateEstateFormValues> = async ({ coordinates, name }, actions) => {
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
      createEstateModalStore.close()
      snackStore.toggle('success', 'Nemovitost vytvořena')
    } catch (err) {
      snackStore.toggle('error', err.message)
    }
  }

  return (
    <Dialog open={createEstateModalState.isOpen} onClose={createEstateModalStore.close}>
      <Formik
        initialValues={createEstateModalState.formValues}
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
                    onClick={createEstateModalStore.close}
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
    </Dialog>
  );
};

CreateEstateModal.defaultProps = {
  isVisible: false,
  initialValues: {
    coordinates: "",
    name: ""
  }
}

export default CreateEstateModal;
