import React, { FunctionComponent, useEffect } from "react";
import Link from "next/link";
import { createUseStyles } from "react-jss";
import {
  fields,
  getFormOptions,
} from "src/components/utils/EstateUtils";
import useI18n from "../../lib/hooks/use-i18n";

type TDetailTable = {
  estate: any;
  PlaceholderRender: any; //JSX.Element;
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
  mainItem: {
    flex: "1 0 40%",
    margin: [5, 15, 5, 15],
    borderBottom: "2px dashed rgba(0,0,0,0.1)",
  },
  tableRow: {
    borderBottom: "2px dashed rgba(0,0,0,0.1)",
    padding: "5px 0",
  },
  table: {},
  imageThumb: {
    width: "200px",
    height: "auto",
  },
  blockB: {
    display: "flex",
    flexWrap: "wrap",
  },
  energyLabel: {
    margin: "10px",
    height: "50px",
    "line-height": "50px",
    "vertical-align": "middle",
    "text-align": "center",
    padding: "0 20px",
    color: "#ffffff",
    "background-color": "orange",
    position: "relative",
    display: "inline-block",
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
    margin: 0,
  },
  headline: {
    margin: 0,
  },
  description: {
    // 'max-width': '400px'
  },
  rowData: {
    float: "right",
  },
});

//TO DO add types for new code !!!!
const DetailTable: FunctionComponent<TDetailTable> = ({
  estate,
  PlaceholderRender,
}) => {
  const i18n = useI18n();

  const classes = useStyles();

  // const dataForDetail: any = transformToDetailStructure(estate);
  const fieldsEntries = Object.entries(fields);

  return (
    <>
      {fieldsEntries.map((item) => {
        const [key, values] = item;
        return (
          <>
          <h1>{ i18n.t(`estateDetailHeadlines.${key}`)}</h1>
            <div className={classes.container}>
              {estate !== undefined &&
                values.map((key, i) => {
                  return (
                    <div className={classes.mainItem} key={i}>
                      <span>{i18n.t(`estateProperties.${key}`)}</span> :{" "}
                      <span className={classes.rowData}>
                        {estate[key] ?? PlaceholderRender()}
                      </span>
                    </div>
                  );
                })}
            </div>
          </>
        );
      })}
    </>
  );
};
export default DetailTable;
