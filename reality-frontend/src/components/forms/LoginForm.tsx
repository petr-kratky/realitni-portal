import React, { FunctionComponent } from "react";
import { Formik, FormikHelpers } from "formik";
import { createUseStyles } from "react-jss";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import * as Yup from "yup";
import TextInput from "./TextInput";
import Button from "./Button";
import { useLoginMutation, MeQuery, MeDocument } from "src/graphql/queries/generated/graphql";
import Router from "next/router";
import { setAccessToken } from "src/lib/user-management/accessToken";

type TSearchFormProps = {};

type FormValues = {
  email: string;
  password: string;
};

type TOnSubmitFunction = (
  values: FormValues,
  actions: FormikHelpers<FormValues>
) => void;

const useStyles = createUseStyles({
  submitButton: {
    "&&": {
      marginTop: 16,
    },
  },
  LoginForm: {
    "& > div": {
      marginTop: 8,
    },
  },
  priceInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    "& > div": {
      width: "47.5%",
    },
  },
});

const LoginForm: FunctionComponent<TSearchFormProps> = (props) => {
  const classes = useStyles();
  const [login] = useLoginMutation();
  
  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const formSchema = Yup.object().shape({
    email: Yup.string(),
    password: Yup.string()
  });

  const onFormSubmit: TOnSubmitFunction = async (values, actions) => {
    const { email, password } = values;
    const response = await login({
      variables: {
        email,
        password,
      }
      ,
      update: (store, { data }) => {
        if (!data) {
          return null;
        }

        store.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login.account,
          },
        });
      },
    });
    console.log(response);
    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }
    // Router.push("/");
  };

  return (
    <div style={{ width: "100%", padding: "24px", boxSizing: "border-box" }}>
      <Formik
        initialValues={initialValues}
        onSubmit={onFormSubmit}
        validationSchema={formSchema}
      >
        {(formikProps) => {
          const {
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            touched,
            submitForm,
          } = formikProps;

          return (
            <form onSubmit={handleSubmit} className={classes.LoginForm}>
              <TextInput
                type="text"
                label="E-mail"
                id="email"
                onBlur={handleBlur}
                placeholder=""
                onChange={handleChange}
                value={values.email}
                error={errors.email}
                touched={touched.email}
              />

              <TextInput
                type="password"
                label="Password"
                id="password"
                onBlur={handleBlur}
                placeholder=""
                onChange={handleChange}
                value={values.password}
                error={errors.password}
                touched={touched.password}
              />
              <Button
                onClick={submitForm}
                disabled={isSubmitting}
                className={classes.submitButton}
              >
                zobrazit
              </Button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
