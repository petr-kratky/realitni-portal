import React from "react"
import { Popup, PopupProps } from "react-map-gl"
import InfiniteScroll from "react-infinite-scroll-component"

import { EstateFeature } from "../../../types"
import PopupEstateCard from "./PopupEstateCard"
import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
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
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true })

  const [visibleFeatures, setVisibleFeatures] = React.useState<EstateFeature[]>(features.slice(0, xs ? 25 : 4))
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isVisible) {
      setTimeout(() => setModalOpen(true), 50)
    } else {
      setModalOpen(false)
    }
  }, [isVisible])

  React.useEffect(() => {
    setVisibleFeatures(features.slice(0, xs ? 25 : 4))
  }, [features])

  const displayMoreFeatures = () => {
    setVisibleFeatures(features.slice(0, visibleFeatures.length + 4))
  }

  const onClose = () => {
    // @ts-ignore
    setPopupProps({ ...popupProps, isVisible: false })
  }

  return (
    <>
      {isVisible && !xs && (
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
      )}
      {xs && (
        <Dialog fullScreen keepMounted={false} open={isModalOpen} onClose={onClose}>
          <DialogTitle>Nemovitosti v lokalitě ({features.length})</DialogTitle>
          <DialogContent dividers>
            <List>
              {visibleFeatures.map(({ properties: { id } }, index, array) => (
                <React.Fragment key={id}>
                  <PopupEstateCard id={id} popupProps={popupProps!} setPopupProps={setPopupProps!} features={array} />
                  {index !== array.length - 1 && <Divider />}
                  {xs && index === visibleFeatures.length - 1 && visibleFeatures.length < features.length && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
            </List>
            {visibleFeatures.length < features.length && (
              <DialogContentText align='center' variant='body2' style={{ marginTop: 12 }}>
                Zobrazeno pouze prvních 25 nemovitostí. Zužte prosím vybraný shluk nemovistí přiblížením na konkrétní
                místo na mapě.
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={onClose}>
              zavřít
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

CustomPopup.defaultProps = {
  markerId: "",
  longitude: 0,
  latitude: 0,
  isVisible: false,
  features: []
}

export default CustomPopup
