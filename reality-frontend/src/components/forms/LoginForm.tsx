import React, { FunctionComponent, useState } from "react";
import { Formik } from "formik";
import { Button, TextField, Theme, makeStyles, createStyles, Snackbar, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import * as Yup from "yup";

import { useLoginMutation, CurrentUserDocument, CurrentUserQuery } from "src/graphql/queries/generated/graphql";
import { setAccessToken } from "src/lib/user-management/accessToken";
import { useRouter } from "next/router";
import { FormikSubmitFunction } from "../../types";

type TSearchFormProps = {};

type FormValues = {
  email: string;
  password: string;
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  loginFormContainer: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

const LoginForm: FunctionComponent<TSearchFormProps> = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const [login] = useLoginMutation();

  const [loginError, setLoginError] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const formSchema = Yup.object().shape({
    email: Yup.string().required('Toto pole je povinné'),
    password: Yup.string().required('Toto pole je povinné')
  });

  const handleSnackClose = () => {
    setSnackOpen(false)
  }

  const onFormSubmit: FormikSubmitFunction<FormValues> = async (values, actions) => {
    const { email, password } = values;

    try {
      const response = await login({
        variables: {
          email,
          password,
        },
        update: (store, { data }) => {
          if (!data) {
            return null;
          }
          store.writeQuery<CurrentUserQuery>({
            query: CurrentUserDocument,
            data: {
              currentUser: data.login.account,
            },
          });
        },
      });

      if (response?.data) {
        setAccessToken(response.data.login.accessToken);
        router.push('/map');
      }
    } catch (e) {
      setLoginError(e.message)
      setSnackOpen(true)
    }
  }

  return (
    <div className={classes.loginFormContainer}>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert variant="filled" severity="error" elevation={6} onClose={handleSnackClose}>{loginError}</Alert>
      </Snackbar>
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
            <form onSubmit={handleSubmit} className={classes.loginForm}>
              <TextField
                id="email"
                onChange={handleChange}
                value={values.email}
                error={touched.email && !!errors.email?.length}
                helperText={(touched.email && errors.email) ?? ""}
                label="E-mail"
                variant="outlined"
              />
              <TextField
                id="password"
                onChange={handleChange}
                value={values.password}
                error={touched.password && !!errors.password?.length}
                helperText={(touched.password && errors.password) ?? ""}
                label="Heslo"
                variant="outlined"
                type="password"
                autoComplete="current-password"
              />
              <Button
                onClick={submitForm}
                disabled={isSubmitting}
                color='primary'
                variant='contained'
              >
                Přihlásit
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
