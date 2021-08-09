import React, { FunctionComponent, useState } from "react";
import { Formik } from "formik";
import { Button, TextField, Theme, makeStyles, createStyles, Snackbar, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import * as Yup from "yup";

import { } from "src/graphql/queries/generated/graphql";
import { FormikSubmitFunction } from 'src/types'

export type FormModalTemplateProps = {
  isVisible: boolean
  handleClose: () => void
}

type FormValues = {
  value1: string;
  value2: string;
};


const useStyles = makeStyles((theme: Theme) => createStyles({

}));

const FormModalTemplate: FunctionComponent<FormModalTemplateProps> = ({ isVisible, handleClose }) => {
  const classes = useStyles();

  const [responseError, setResponseError] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)

  const initialValues: FormValues = {
    value1: "",
    value2: "",
  };

  const formSchema = Yup.object().shape({
    value1: Yup.string().required('Toto pole je povinné'),
    value2: Yup.string().required('Toto pole je povinné')
  });

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const onFormSubmit: FormikSubmitFunction<FormValues> = async (values, actions) => {
    const { value1, value2 } = values;

    try {
      // const response = await login({
      //   variables: {
      //     email,
      //     password,
      //   },
      // })
    } catch (e) {
      setResponseError(e.message)
      setSnackOpen(true)
    }
  }

  return (
    <Dialog open={isVisible} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={onFormSubmit}
        validationSchema={formSchema}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
            submitForm,
          } = formikProps;

          return (
            <>
              <DialogTitle>Dialog Title</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                  </DialogContentText>
                  <TextField
                    id="value1"
                    onChange={handleChange}
                    value={values.value1}
                    error={touched.value1 && !!errors.value1?.length}
                    helperText={(touched.value1 && errors.value1) ?? ""}
                    margin="dense"
                    label="Value1"
                    fullWidth={true}
                  />
                  <TextField
                    id="value2"
                    onChange={handleChange}
                    value={values.value2}
                    error={touched.value2 && !!errors.value2?.length}
                    helperText={(touched.value2 && errors.value2) ?? ""}
                    label="Value2"
                    margin="dense"
                    fullWidth={true}
                  />

                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    color='primary'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitForm}
                    disabled={isSubmitting}
                    color='primary'
                  >
                    Action
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

FormModalTemplate.defaultProps = {
  isVisible: false
}

export default FormModalTemplate;
