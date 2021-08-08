import React, {
  CSSProperties,
  FunctionComponent,
} from "react";
import { createUseStyles } from "react-jss";

import { useEstateQuery } from "src/graphql/queries/generated/graphql";
import { Typography } from "@material-ui/core";

type TEstateCardProps = {
  id: string;
};

const useStyles = createUseStyles({
  container: {
    padding: 5,
    backgroundColor: "#fff",
    // borderRadius: 5,
    transition: "border-color 400ms",
    "&:hover": {
      backgroundColor: "#d9d9d9",
      cursor: "pointer",
    },
  },
  containerActive: {
    extend: "container",
    backgroundColor: "#d9d9d9",
  },
  subContainer: {
    display: "flex",
  },
  detailsContainer: {
    marginLeft: 8,
  },
  advertFunction: {
    fontWeight: 600,
  },
  addressField: {
    fontSize: 14,
  },
  priceField: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  advert: {
    extend: "priceField",
    backgroundColor: "#f0f5ff",
  },
  sell: {
    extend: "priceField",
    backgroundColor: "#f6ffed",
  },
  advertActive: {
    extend: "priceField",
    backgroundColor: "#d9d9d9",
  },
  sellActive: {
    extend: "priceField",
    backgroundColor: "#d9d9d9",
  },
  thumbnail: {
    minHeight: 100,
    minWidth: 100,
    maxHeight: 100,
    maxWidth: 100,
    objectFit: "cover",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: ["center", "center"],
  },
  separator: {
    height: 1,
    backgroundColor: "#d1d1d1",
    margin: [0, 8],
  },
});

const EstateCard: FunctionComponent<TEstateCardProps> = ({ id }) => {
  const classes = useStyles();

  const { data, loading, refetch } = useEstateQuery({ variables: { id } })

  const onCardClick = () => { };

  if (data?.estate) {
    const { id, name, longitude, latitude } = data.estate

    return (
      <div
        className={classes.container}
        key={id}
        onClick={onCardClick}
      >
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="subtitle2">{id}</Typography>
        <Typography variant="body1">longitude: {longitude}</Typography>
        <Typography variant="body1">latitude: {latitude}</Typography>
      </div>
    )
  } else {
    return null
  }
}

export default EstateCard;
