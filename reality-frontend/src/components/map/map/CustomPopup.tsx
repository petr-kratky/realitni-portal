import React from "react"
import { Popup, PopupProps } from "react-map-gl"
import InfiniteScroll from "react-infinite-scroll-component"

import { EstateFeature } from "../../../types"
import PopupEstateCard from "./PopupEstateCard"
import {
  CircularProgress,
  createStyles,
  Divider,
  Grid,
  List,
  makeStyles,
  Theme,
  Typography,
  useTheme
} from "@material-ui/core"

export interface CustomPopupProps extends PopupProps {
  markerId: string
  longitude: number
  latitude: number
  isVisible: boolean
  features: Array<EstateFeature>
  popupProps?: CustomPopupProps
  setPopupProps?: React.Dispatch<React.SetStateAction<CustomPopupProps>>
  handleClose?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes content": {
      from: { transform: "scale(0)" },
      to: { transform: "scale(1)" }
    },
    "@keyframes tip": {
      "0%": { transform: "translateX(15px) scale(0)" },
      "15%": { transform: "translateX(15px) scale(0)" },
      "100%": { transform: "translateX(0) scale(1)" }
    },
    popup: {
      "& > .mapboxgl-popup-content, & > .mapboxgl-popup-tip": {
        animationDuration: "300ms",
        animationTimingFunction: "cubic-bezier(.16,1.32,.59,1.09)"
      },
      "& > .mapboxgl-popup-content": {
        animationName: "$content",
        padding: 0,
        cursor: "default",
        borderRadius: 5
      },
      "& > .mapboxgl-popup-tip": {
        animationName: "$tip",
        margin: -1,
        cursor: "default"
      }
    }
  })
)

const CustomPopup: React.FunctionComponent<CustomPopupProps> = ({
  isVisible,
  longitude,
  latitude,
  handleClose,
  features,
  setPopupProps,
  popupProps
}) => {
  const classes = useStyles()

  const [visibleFeatures, setVisibleFeatures] = React.useState<EstateFeature[]>(features.slice(0, 4))

  const displayMoreFeatures = () => {
    setVisibleFeatures(features.slice(0, visibleFeatures.length + 4))
  }

  React.useEffect(() => {
    setVisibleFeatures(features.slice(0, 4))
  }, [features])

  return isVisible ? (
    <Popup
      className={`${classes.popup}`}
      latitude={latitude}
      longitude={longitude}
      closeButton={false}
      captureScroll={true}
      anchor='left'
      closeOnClick={false}
      dynamicPosition={false}
      onClose={handleClose}
    >
      <Grid container direction='column' alignItems='center'>
        <List>
          <InfiniteScroll
            hasMore={features.length > visibleFeatures.length}
            next={displayMoreFeatures}
            dataLength={visibleFeatures.length}
            loader={<Typography>Načítám...</Typography>}
            scrollThreshold={0.8}
            style={{ maxHeight: 280 }}
            height={"100%"}
          >
            {visibleFeatures.map(({ properties: { id } }, index, array) => (
              <React.Fragment key={id}>
                <PopupEstateCard id={id} popupProps={popupProps!} setPopupProps={setPopupProps!} features={array} />
                {index !== array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </InfiniteScroll>
        </List>
      </Grid>
    </Popup>
  ) : null
}

CustomPopup.defaultProps = {
  markerId: "",
  longitude: 0,
  latitude: 0,
  isVisible: false,
  features: []
}

export default CustomPopup
