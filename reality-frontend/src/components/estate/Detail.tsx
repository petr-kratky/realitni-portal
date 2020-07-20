import React, { FunctionComponent, useEffect, useState } from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import {
  useEstateFullQuery,
  Estate,
} from "src/graphql/queries/generated/graphql";

import Galery from "./Galery";
import { decodeEstateObject } from "src/lib/data/codebook";
import { DecodedEstate } from "src/types";
import { createUseStyles } from "react-jss";
import { Alert, message } from "antd";

import DetailTable from "./DetailTable";
import DetailHeader from "./DetailHeader";
import EditDetail from "./EditDetail";
import {
  fields
} from "src/components/utils/EstateUtils";

type TDetail = {
  estateId: number;
  PlaceholderRender: any; //JSX.Element;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setVisibilityDetail: any;
  setUpdatedId: any;
  initialValues: any;
  setInitialValues: any;
};
const useStyles = createUseStyles({
  container: {
    padding: 20,
  },
});
const Detail: FunctionComponent<TDetail> = ({
  estateId,
  PlaceholderRender,
  setEditMode,
  editMode,
  setVisibilityDetail,
  setUpdatedId,
  initialValues,
  setInitialValues,
}) => {
  const openNotificationSuccess = (text) => {
    message.success({
      content: <Alert message={text} type="success" />,
      duration: 2,
    });
  };
  const openNotificationError = (text) => {
    message.error({
      content: <Alert message={text} type="error" />,
      duration: 8,
    });
  };

  const router = useRouter();
  const { container } = useStyles();

  if (!estateId)
    return (
      <>
        <h1>Estate doesn't exist</h1>
      </>
    );

  const { data, loading, error, refetch } = useEstateFullQuery({
    variables: { id: +estateId },
  });

  const [estate, setEstate] = useState<DecodedEstate | null>(null);
  const [estateRaw, setEstateRaw] = useState<Estate | undefined>(undefined);
  const [uploadState, setUploadState] = useState<any>();

  // useEffect(() => {
  //   if (estateId) {
  //     refetch()
  //   }
  // }, [estateId]);

  useEffect(() => {
    if (data) {
      setEstateRaw(data.estate as Estate);
      const decodedEstate = decodeEstateObject(data.estate);
      setEstate(decodedEstate);
    }
  }, [data]);

  useEffect(() => {
    if (estateRaw) {
      let values = {
        images: [],
      };
      const {
        defaultProps,
        mainProps,
        secondaryProps,
        extendedEstateProps,
        other,
        seller,
      } = fields;
      const fullDescriptor = defaultProps.concat(
        mainProps,
        secondaryProps,
        extendedEstateProps,
        other,
        seller
      );
      fullDescriptor.push("id");
      fullDescriptor.push("description");
      Object.entries(estateRaw).forEach((item) => {
        const [key, value]: any = item;
        if (fullDescriptor.includes(key)) {
          values[key] = value;
        }
      });
      setInitialValues(values);
    }
  }, [estateRaw]);

  if (error)
    return (
      <>
        <p>Can't get estate detail data. Contact service</p>
      </>
    );
  const childProps = {
    estate,
    estateRaw,
    setEditMode,
    editMode,
    PlaceholderRender,
    initialValues,
    setUploadState,
    uploadState,
    setVisibilityDetail,
    openNotificationSuccess,
    openNotificationError,
    setUpdatedId,
  };

  return data ? (
    <div className={container}>
      {estate?.s3Images && <Galery images={estate?.s3Images} />}
      {editMode && estate && <EditDetail {...childProps} refetch={refetch} />}
      {!editMode && estate && <DetailHeader {...childProps} />}
      {!editMode && estate && <DetailTable {...childProps} />}
    </div>
  ) : null;
};

export default Detail;
