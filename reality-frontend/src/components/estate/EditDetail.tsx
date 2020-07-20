import React, { FunctionComponent, useEffect, useState, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { fields, getFormOptions } from "src/components/utils/EstateUtils";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import DetailHeader from "./DetailHeader";
import { Input, InputNumber, Select, Form, Spin, Alert } from "antd";
import ESTATE_MUTATION from "../../graphql/queries/user-management/estate/update";
import { useMutation } from "@apollo/react-hooks";
import { EstateInput } from "../../types/estate.input";
import FieldUpload from "../../lib/upload/package/components/FieldUpload";
import { useUploadApollo } from "src/lib/upload/package/components/useUploadApollo";
import { fileUpload } from "src/lib/upload/package/graphql/upload.mutation";
import useI18n from "../../lib/hooks/use-i18n";

const { Option } = Select;
const { TextArea } = Input;

type TDetailTable = {
  estate: any;
  estateRaw: any;
  setEditMode: any;
  PlaceholderRender: any;
  editMode: any;
  initialValues: any;
  setUploadState: any;
  uploadState: any;
  setVisibilityDetail: any;
  openNotificationSuccess: any;
  openNotificationError: any;
  refetch: any;
  setUpdatedId: any;
};

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    "& span": {
      color: "#858585",
    },
  },
  blockB: {
    display: "flex",
    flexWrap: "wrap",
    // "& span": {
    //   color: "#858585",
    // },
  },
  mainItem: {
    flex: "1 0 40%",
    margin: "10px",
    // borderBottom: "1px dashed rgba(0,0,0,0.2)",
  },
  price: {
    "flex-grow": "1",
    margin: 0,
  },
  headline: {
    margin: 0,
  },
  description: {
    // 'max-width': '400px'
  },
  errorMessage: {
    color: "#ff0000",
    fontSize: 12,
    paddingTop: 2,
  },
});

//TO DO add types for new code !!!!
const EditDetail: FunctionComponent<TDetailTable> = (props) => {
  const {
    estate,
    initialValues,
    setEditMode,
    setUploadState,
    uploadState,
    openNotificationSuccess,
    openNotificationError,
    setUpdatedId,
    refetch,
  } = props;

  const [skipImageUpload, setSkipImageUpload] = useState<boolean>();
  const { blockB, mainItem, container, errorMessage } = useStyles();
  const [estateUpdate, { data, error }] = useMutation(ESTATE_MUTATION);
  const [uploadFiles, mutationStatus, progress, abort] = useUploadApollo(
    fileUpload
  );

  const formSchema = Yup.object().shape({
    localityLatitude: Yup.number().min(2, "required filed").required(), // "Vyžadované pole - zeměpisná šířka").required(),
    localityLongitude: Yup.number().min(2, "required filed").required(), //"Vyžadované pole - zeměpisná délka").required(),
    // advertType: Yup.string(),
    // advertSubtype: Yup.string(),
    // advertFunction: Yup.string(),
    // building_type: Yup.string(),
    // ownership: Yup.string(),
    // price_from: Yup.number(),
    // price_to: Yup.number(),
    // floor_number: Yup.number().lessThan(500, "Musí být menší než 500"),
    // usable_area: Yup.number(),
  });

  // const typeDescriptor = useMemo(
  //   () => Object.entries(initialValues).map(([key, val]) => [key, typeof val]),
  //   [initialValues]
  // );

  useEffect(() => {
    if ((data || error) && (mutationStatus.loading || skipImageUpload)) {
      if (!data?.update?.status || error) {
        setUploadState("UPLOAD-DATA-FAIL");
        openNotificationError(
          `ERROR: ${!data?.update?.error} ${error?.message}`
        );
      }
    }
    if (!data && !mutationStatus.loading && !skipImageUpload) {
      mutationStatus.error && setUploadState("UPLOAD-IMAGES-FAIL");
    }
    if (data?.update.status && (!mutationStatus.loading || skipImageUpload)) {
      setEditMode(false);
      setUploadState("UPLOADED-ALL");
      openNotificationSuccess("Estate UPDATED successfuly");
      setUpdatedId(estate.id);
      refetch();
    }
    !mutationStatus.loading &&
      !mutationStatus.error &&
      !skipImageUpload &&
      setUpdatedId(estate.id);
  }, [data, mutationStatus, skipImageUpload, error]);

  const getSavedOptions = (optionByKey, key) => {
    const val = optionByKey.filter((item) => {
      if (+item.value == +key) {
        return true;
      } else {
        return false;
      }
    });
    return val[0];
  };

  const onFormSubmit: any = async (values, actions) => {
    console.log("values", values);
    // IMAGE upload >>>
    const fileInput = values?.images;
    if (fileInput.length) {
      uploadFiles({
        variables: {
          id: +values.id,
          fileInput: fileInput,
        },
      });
    } else {
      setSkipImageUpload(true);
    }
    delete values["images"];
    // <<< upload
    const typeControled = Object.entries(values).map((item) => {
      const [key, val] = item as any;
      return (EstateInput[key] === "number" || EstateInput[key] === "float") &&
        val
        ? [key, +val]
        : [key, val];
    });
    const typeControlledValues = Object.fromEntries(typeControled);
    delete typeControlledValues.images;
    estateUpdate({ variables: { estate: typeControlledValues } });
    setUploadState("START");
  };

  const renderInput: any = (
    key,
    values,
    types,
    onInputChange,
    onInputNumberChange,
    setFieldTouched
  ) => {
    const type = () => {
      if (["sellPrice", "advertPrice"].includes(key)) return "price";
      return types[key];
    };

    switch (type()) {
      case "number":
      case "float":
        return (
          <InputNumber
            value={values[key] ?? null}
            style={{ width: "100%" }}
            id={key}
            key={`input-${key}`}
            onChange={onInputNumberChange(key)}
            onBlur={() => setFieldTouched(key, true)}
          />
        );
        break;
      case "string":
        return (
          <Input
            id={key}
            key={`input-${key}`}
            onChange={onInputChange(key)}
            onBlur={() => setFieldTouched(key, true)}
            value={values[key] ?? null}
            placeholder="wait for fill"
          />
        );
        break;
      case "price":
        return (
          <InputNumber
            value={values[key] ?? null}
            style={{ width: "100%" }}
            id={key}
            key={`input-${key}`}
            formatter={(value) =>
              value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? ""
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") ?? ""}
            onChange={onInputNumberChange(key)}
            onBlur={() => setFieldTouched(key, true)}
          />
        );
        break;
    }
  };

  const renderField: any = (
    setFieldTouched,
    touched,
    errors,
    optionsArr,
    key,
    setFieldValue,
    onInputChange,
    onInputNumberChange,
    values,
    types
  ) => {
    const defaultValue = Object.keys(optionsArr).includes(key)
      ? getSavedOptions(optionsArr[key], values[key])
      : null;
    return (
      <>
        {Object.keys(optionsArr).includes(key) ? (
          <Select
            value={defaultValue?.value ?? null}
            key={`select-${key}`}
            style={{ width: "100%" }}
            onChange={(clickedValue) => {
              setFieldValue(key, clickedValue);
            }}
            onBlur={() => {
              console.log("blured (key) >", key);
              setFieldTouched(key, true);
            }}
            onFocus={() => {
              console.log("onFocus (key) >", key);
              setFieldTouched(key, true);
            }}
          >
            {Object.values(optionsArr[key]).map((val) => {
              let locVal = val as any;
              return (
                <Option
                  key={`option-${key}-${locVal.value}`}
                  value={locVal.value}
                >
                  {locVal.label}
                </Option>
              );
            })}
          </Select>
        ) : (
          renderInput(
            key,
            values,
            types,
            onInputChange,
            onInputNumberChange,
            setFieldTouched
          )
        )}
        {errors[key] && touched[key] ? (
          <div className={errorMessage}>{errors[key]}</div>
        ) : null}
      </>
    );
  };

  return initialValues ? (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onFormSubmit}
        validationSchema={formSchema}
        enableReinitialize={true}
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

          const i18n = useI18n();

          const fieldsEntries = Object.entries(fields);
          const onInputChange = (key) => ({ target: { value } }) =>
            setFieldValue(key, value);
          const onInputNumberChange = (key) => (value) =>
            setFieldValue(key, value);
          const onBlur = (key) => setFieldTouched(key, true);

          const options = getFormOptions(
            values.advertType ? values.advertType.toString() : "1"
          );
          const images: any = values.images ?? false;
          return (
            <>
              <form onSubmit={handleSubmit}>
                {uploadState == "UPLOADED-ALL" && uploadState == "START" && (
                  <Spin tip="Loading...">
                    <Alert
                      message={`Alert message title ${uploadState}`}
                      description="Further details about the context of this alert."
                      type="info"
                    />
                  </Spin>
                )}
                <DetailHeader
                  {...props}
                  isImages={images.length > 0}
                  refetch={refetch}
                />
                <FieldUpload
                  setFieldValue={setFieldValue}
                  images={values.images}
                />
                {images &&
                  images.map((file, i) => {
                    const { name, type, size } = file;
                    return (
                      <li key={i}>
                        {`File:${name} Type:${type} Size:${size} bytes`}{" "}
                      </li>
                    );
                  })}
                Celkem nahráno:{" "}
                {Math.round((progress.loaded * 100) / progress.total)} <br />
                {mutationStatus.loading && (
                  <button type="button" onClick={abort}>
                    Zrušit nahrávání
                  </button>
                )}
                <TextArea
                  key="description"
                  onChange={onInputChange("description")}
                  onBlur={onBlur}
                  value={values.description ?? ""}
                  rows={4}
                />
                {fieldsEntries.map((item) => {
                  const [key, estateProps] = item;
                  return (
                    <>
                      <h1>{i18n.t(`estateDetailHeadlines.${key}`)}</h1>
                      <div className={container}>
                        {estate !== undefined &&
                          estateProps.map((key, i) => {
                            return (
                              <div className={mainItem} key={i}>
                                <span key={`${i}-span`}>{i18n.t(`estateProperties.${key}`)}</span> :{" "}
                                {renderField(
                                  setFieldTouched,
                                  touched,
                                  errors,
                                  options,
                                  key,
                                  setFieldValue,
                                  onInputChange,
                                  onInputNumberChange,
                                  values,
                                  EstateInput
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </>
                  );
                })}
              </form>
            </>
          );
        }}
      </Formik>
    </>
  ) : null;
};
export default EditDetail;
