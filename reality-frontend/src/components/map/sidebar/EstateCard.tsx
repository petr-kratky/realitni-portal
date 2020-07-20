import React, {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "@apollo/react-hooks";
import { createUseStyles } from "react-jss";

import ESTATE_QUERY, {
  EstateData,
  EstateVars,
} from "../../../graphql/queries/estate/estateById";
import { decodeEstateObject } from "../../../lib/data/codebook";
import { DecodedEstate } from "../../../types";

type TEstateCardProps = {
  id: number;
  style: CSSProperties;
  onLoad: () => void;
  setVisibilityDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusedEstate: React.Dispatch<React.SetStateAction<number | null>>;
  focusedEstate: number | null;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  updatedId: any;
  setUpdatedId: any;
  PlaceholderRender: any;
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

const EstateCard: FunctionComponent<TEstateCardProps> = ({
  id,
  onLoad,
  style,
  setVisibilityDetail,
  setFocusedEstate,
  focusedEstate,
  setEditMode,
  updatedId,
  setUpdatedId,
  PlaceholderRender,
}) => {
  const classes = useStyles();

  const { data, loading, refetch } = useQuery<EstateData, EstateVars>(
    ESTATE_QUERY,
    { variables: { id } }
  );

  const [estate, setEstate] = useState<DecodedEstate | null>(null);
  const [active, setActive] = useState<boolean>(false);

  const estateTab = useRef<Window>();

  useEffect(() => {
    if (+updatedId === id) {
      refetch();
      setUpdatedId(-1);
    }
  }, [updatedId]);

  useEffect(() => {
    if (focusedEstate) {
      if (+focusedEstate === id) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [focusedEstate]);

  useEffect(() => {
    if (data?.estate) {
      const decodedEstate: DecodedEstate = decodeEstateObject(data?.estate);
      setEstate(decodedEstate);
    }
  }, [data]);

  const onCardClick = () => {
    setVisibilityDetail(true);
    if (estate) setFocusedEstate(estate.id);
    setEditMode(false);
    refetch();
    // if (estate) {
    //   if (estateTab.current && !estateTab.current.closed) {
    //     window.open('javascript:;', `estate-${estate.id}`)
    //   } else {
    //     estateTab.current = window.open(`/estate/${estate.id}`, `estate-${estate.id}`) as Window
    //   }
    // }
  };

  return estate ? (
    <div
      className={active ? classes.containerActive : classes.container}
      key={estate.id}
      style={style}
      onClick={onCardClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        if (focusedEstate) {
          if (+focusedEstate !== id) {
            setActive(false);
          }
        }else {
          setActive(false);
        }
      }}
    >
      <div className={classes.subContainer} key={`${estate.id}-sub-1`}>
        <img
          src={estate.s3Images[0] ?? "/images/sidebar/thumbnail-fallback.png"}
          className={classes.thumbnail}
          onLoad={onLoad}
          onError={onLoad}
        />
        <div className={classes.detailsContainer}>
          <div className={classes.advertFunction}>{estate.advertFunction}</div>
          <div>
            <span>{estate.advertType}</span>
            {estate.advertType && (estate.advertSubtype ?? "") && (
              <span> | </span>
            )}
            <span>{estate.advertSubtype}</span>
          </div>
          <div>
            <span className={classes.addressField}>
              {estate.fullAddress.replace(/(^ulice )|(^, )|(okres )/g, "")}
            </span>
          </div>
        </div>
      </div>
      <div className={classes.subContainer} key={`${estate.id}-sub-2`}>
        <div className={active ? classes.advertActive : classes.advert}>
          {estate.advertPrice?.toString().replace(/(?=(\d{3})+(?!\d))/g, " ") ??
            PlaceholderRender()}
          {estate.advertPrice && ` ${estate.advertPriceCurrency}`}
        </div>
        <div className={active ? classes.sellActive : classes.sell}>
          {estate.sellPrice?.toString().replace(/(?=(\d{3})+(?!\d))/g, " ") ??
            PlaceholderRender()}
          {estate.sellPrice && ` ${estate.advertPriceCurrency}`}
        </div>
      </div>
    </div>
  ) : null;
};

export default EstateCard;
