import React, { FunctionComponent, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Form, Alert, message } from "antd";
import FileList from "./FileList";
import {
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";

import ESTATE_MUTATION_DELETE from "../../graphql/queries/user-management/estate/delete";

import {
  EditOutlined,
  FolderAddOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

type TDetailTable = {
  estate: any;
  PlaceholderRender: any; //JSX.Element;
  setEditMode: any;
  editMode: any;
  submitForm?: any;
  isSubmitting?: any;
  isImages?: boolean;
  setVisibilityDetail: any;
  openNotificationSuccess: any;
  openNotificationError: any;
  refetch?: any;
  setUpdatedId: any;
};

const useStyles = createUseStyles({
  mainItem: {
    "flex-grow": "1",
    margin: [10, 0, 0, 0],
    "& > *": {
      // margin: "3px",
    },
  },
  imageThumb: {
    width: "200px",
    height: "auto",
  },
  secondColor: {
    color: "#858585",
    fontSize: "large",
  },
  blockB: {
    display: "flex",
    flexWrap: "wrap",
    "& span": {
      color: "#858585",
    },
  },
  energyLabel: {
    // margin: "10px",
    height: "50px",
    "line-height": "50px",
    "vertical-align": "middle",
    "text-align": "center",
    padding: "0 20px",
    color: "#ffffff",
    "background-color": "orange",
    position: "relative",
    display: "inline-block",
    float: "right",
    "&:before": {
      position: "absolute",
      left: "-30px",
      content: '" "',
      width: "0px",
      height: "0px",
      "border-style": "solid",
      "border-width": "25px  30px 25px 0",
      "border-color": "transparent orange transparent transparent",
    },
  },
  blockA: {
    margin: "10px",
  },
  price: {
    "flex-grow": "1",
  },
  yinyang: {
    margin: "32px",
    position: "relative",
    width: "400px",
    height: "250px",
    "background-color": "#222",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: " 0",
      background: " #eee",
      border: "18px solid red",
      "border-radius": "100%",
      width: "12px",
      height: "12px",
      "box-sizing": "content-box",
    },
    "&:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      background: "red",
      border: "18px dashed rgba(0,0,0,0.2)",
      "border-radius": "100%",
      width: "12px",
      height: "12px",
      "box-sizing": "content-box",
    },
  },
  headline: {
    fontSize: "large",
    // "flex-grow": "1",
  },
  description: {},
  address: {
    // color: "rgba(24, 144, 255, 0.8) !important",
    // color: '#1890FF'
  },
  primaryButton: {
    "& span": {
      color: "#FFF",
      padding: "5px",
    },
  },
  colorButton: {
    "& span": {
      color: "#FFF",
    },
  },
  actionButtons: {
    float: "right",
  },
});

//TO DO add types for new code !!!!
const DetailHeader: FunctionComponent<TDetailTable> = ({
  estate,
  PlaceholderRender,
  setEditMode,
  editMode,
  submitForm,
  isSubmitting,
  isImages,
  setVisibilityDetail,
  openNotificationSuccess,
  openNotificationError,
  refetch,
  setUpdatedId,
}) => {
  // TODO: Move functionality to GraphQL server
  // const deleteImages = async (id) => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.MEDIA_SERVER_HOST}/${id}/images/delete`
  //     );
  //     const data = await res.json();
  //     setIsImageDeleted(true);
  //   } catch (err) {
  //     setIsImageDeletedError(true);
  //   }
  // };
  const deleteAll = async (id) => {
    estateDelete({ variables: { id: +id } });
  };
  // const [dataForDetail, setDataForDetail] = useState<any>(null);
  // const [isImageDeleted, setIsImageDeleted] = useState<any>(null);
  // const [isImageDeletedError, setIsImageDeletedError] = useState<any>(null);

  const [estateDelete, { data, loading }] = useMutation(ESTATE_MUTATION_DELETE);
  const {
    blockB,
    mainItem,
    headline,
    address,
    energyLabel,
    description,
    primaryButton,
    actionButtons,
    colorButton,
  } = useStyles();

  useEffect(() => {
    if (!loading && data?.delete) {
      openNotificationSuccess("Estate was deleted successfuly");
      setVisibilityDetail(false);
    }
  }, [loading]);
  // useEffect(() => {
  //   if (isImageDeleted) {
  //     openNotificationSuccess("Images deleted successfuly");
  //     setUpdatedId(estate.id);
  //     setEditMode(false);
  //     refetch();
  //   }
  // }, [isImageDeleted]);

  return (
    <>
      {/* {isImageDeletedError && <Alert message="Error" type="error" showIcon />} */}
      {estate !== undefined && (
        <>
          <div className={blockB}>
            <div className={mainItem}>
              {editMode && (
                <>
                  {/* <Button
                    onClick={() => deleteImages(estate.id)}
                    type="primary"
                    danger
                    className={colorButton}
                  >
                    <DeleteOutlined />
                    DELETE files
                  </Button> */}

                  <Button
                    onClick={() => deleteAll(estate.id)}
                    className={colorButton}
                    type="primary"
                    danger
                  >
                    <DeleteOutlined />
                    DELETE all
                  </Button>
                </>
              )}
              {!editMode && <FileList files={estate?.s3Files} />}
            </div>
            <div className={mainItem}>
              <div className={actionButtons}>
                {!editMode && (
                  <>
                    <Button
                      onClick={(e) => {
                        setEditMode(true);
                      }}
                      icon={<EditOutlined />}
                    >
                      Upravit
                    </Button>
                    <Button icon={<FolderAddOutlined />}>
                      Přidat do kolekce
                    </Button>
                    <Button icon={<PrinterOutlined />}>Tisknout</Button>
                  </>
                )}

                {editMode && (
                  <>
                    <button
                      onClick={submitForm}
                      className={`ant-btn ant-btn-primary ${primaryButton}`}
                      type="submit"
                    >
                      {isImages ? (
                        <>
                          <UploadOutlined /> Upload images &{" "}
                        </>
                      ) : null}
                      <SaveOutlined />
                      Save changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={blockB}>
            <div className={mainItem}>
            {estate?.advertFunction &&
              estate?.advertType &&
              estate?.advertSubtype ? (
                <p className={headline}>
                  {estate.advertFunction}, z kategorie {estate.advertType}{" "}
                  {estate.advertSubtype}
                  <br />
                  <span className={address}>
                    {estate.fullAddress}
                  </span>
                </p>
              ) : (
                <></>
                // <p className={headline}>
                //   <span className={address}>
                //     Na adrese: {PlaceholderRender()}{" "}
                //   </span>
                // </p>
              )}
              {/* <p className={headline}>
                <span>{"advert price: "}</span>
                {estate.advertPrice
                  ?.toString()
                  .replace(/(?=(\d{3})+(?!\d))/g, " ") ??
                  PlaceholderRender()}{" "}
                {estate.advertPriceCurrency} {estate.advertPriceUnit}
                <br />
                <span>{"sell price: "}</span>
                {estate.sellPrice
                  ?.toString()
                  .replace(/(?=(\d{3})+(?!\d))/g, " ") ??
                  PlaceholderRender()}{" "}
                {estate.advertPriceCurrency} {estate.advertPriceUnit}
                {!estate.sellPrice && PlaceholderRender()}
              </p> */}
            </div>
            <div className={mainItem}>
              <div className={energyLabel}>
                {estate.energyEfficiencyRating ?? PlaceholderRender()}
              </div>
            </div>
          </div>

          {!editMode && <p className={description}>{estate.description}</p>}
        </>
      )}
    </>
  )
};
export default DetailHeader;
