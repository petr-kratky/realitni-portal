import { FormikHelpers } from "formik";

export type FormikSubmitFunction<FormValues> = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => void;