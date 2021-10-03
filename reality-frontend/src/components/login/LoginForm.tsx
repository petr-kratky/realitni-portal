import React, { FunctionComponent } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import Head from "next/head"
import { useRouter } from "next/router"

import { Button, TextField, Theme, makeStyles, createStyles } from "@material-ui/core"

import { useLoginMutation, CurrentUserDocument, CurrentUserQuery } from "src/graphql/queries/generated/graphql"
import { setAccessToken } from "src/lib/auth/accessToken"
import { snackStore } from "src/lib/stores"
import { AppState, FormikSubmitFunction } from "../../types"

type LoginFormProps = AppState & {}

type FormValues = {
  email: string
  password: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginFormContainer: {
      display: "flex",
      height: "calc(100vh - 48px)",
			flexDirection: 'column',
      justifyContent: "center",
      alignItems: "center"
    },
    loginForm: {
      display: "flex",
      flexDirection: "column",
      "& > *": {
        margin: theme.spacing(1)
      }
    }
  })
)

const LoginForm: FunctionComponent<LoginFormProps> = ({ appState }) => {
  const classes = useStyles()

  const [login] = useLoginMutation()

  const initialValues: FormValues = {
    email: "",
    password: ""
  }

  const formSchema = Yup.object().shape({
    email: Yup.string().required("Toto pole je povinné"),
    password: Yup.string().required("Toto pole je povinné")
  })

  const onFormSubmit: FormikSubmitFunction<FormValues> = async (values, actions) => {
    const { email, password } = values

    try {
      await login({
        variables: {
          email,
          password
        },
        update: (proxy, { data }) => {
          if (!data) {
            return null
          }
          // Access token must be set before store update
          // to make it available before the original component renders
          setAccessToken(data.login.accessToken)
          proxy.writeQuery<CurrentUserQuery>({
            query: CurrentUserDocument,
            data: {
              currentUser: data.login.account
            }
          })
        }
      })
    } catch (err) {
      // @ts-ignore
      snackStore.toggle("error", err.message)
    }
  }

  return (
    <>
			<Head>
				<title>Přihlášení | Realitní Portál</title>
			</Head>
      <div className={classes.loginFormContainer}>
        <Formik initialValues={initialValues} onSubmit={onFormSubmit} validationSchema={formSchema}>
          {formikProps => {
            const { values, errors, touched, handleChange, handleSubmit, isSubmitting, submitForm } = formikProps

            return (
              <form onSubmit={handleSubmit} className={classes.loginForm}>
                <TextField
                  id='email'
                  onChange={handleChange}
                  value={values.email}
                  error={touched.email && !!errors.email?.length}
                  helperText={(touched.email && errors.email) ?? ""}
                  label='E-mail'
                  variant='outlined'
                />
                <TextField
                  id='password'
                  onChange={handleChange}
                  value={values.password}
                  error={touched.password && !!errors.password?.length}
                  helperText={(touched.password && errors.password) ?? ""}
                  label='Heslo'
                  variant='outlined'
                  type='password'
                  autoComplete='current-password'
                />
                <Button onClick={submitForm} disabled={isSubmitting} color='primary' variant='contained'>
                  Přihlásit
                </Button>
              </form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}

export default LoginForm
