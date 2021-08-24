import React from "react"

import { NextPage } from "next"
import { useRouter } from "next/router"

import {
  Avatar,
  Button,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme
} from "@material-ui/core"
import RoomIcon from "@material-ui/icons/Room"
import HomeIcon from "@material-ui/icons/Home"
import MapIcon from "@material-ui/icons/Map"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import BankIcon from "@material-ui/icons/AccountBalance"
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeftRounded"
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRightRounded"

import { useEstateQuery } from "src/graphql/queries/generated/graphql"
import { capitalize } from "src/utils/capitalize"
import { formatNumber } from "src/utils/number-formatter"

import ReactBnbGallery, { Props, Photo } from "react-bnb-gallery"
import "react-bnb-gallery/dist/style.css"

type ParameterListItemProps = {
  icon: React.ReactNode
  parameter: string
  value: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: "flex",
      flexFlow: "row wrap"
    },
    listItem: {
      width: 230
    },
    carouselArrowRoot: {
      backgroundColor: theme.palette.background.paper,
      "&:hover": {
        backgroundColor: theme.palette.background.paper
      }
    },
    carouselArrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      margin: theme.spacing(0, 2),
      boxShadow: theme.shadows[2],
      "&.left": {
        left: 0
      },
      "&.right": {
        right: 0
      }
    },
    carouselContainer: {
      position: "relative"
    },
    carouselImage: {
      width: "auto",
      maxWidth: "100%",
      cursor: "pointer",
      borderRadius: theme.shape.borderRadius
      // boxShadow: theme.shadows[3]
    }
  })
)

const Estate: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const { estateId } = router.query

  const [galleryOpen, setGalleryOpen] = React.useState<boolean>(false)
  const [currentImage, setCurrentImage] = React.useState<number>(0)

  const {
    data: estateData,
    loading: estateLoading,
    error: estateError
  } = useEstateQuery({ variables: { id: estateId as string } })

  React.useEffect(() => {
    adjustCarouselHeight()
    window.addEventListener("resize", adjustCarouselHeight)
  }, [])

  const adjustCarouselHeight = () => {
    const carouselContainer = document.getElementById("carousel-container")
    const carouselImage = document.getElementById("carousel-image")
    if (carouselContainer && carouselImage) {
      const calcualtedHeight = (carouselContainer.offsetWidth / 1.5).toString() + "px"
      carouselContainer.style.minHeight = calcualtedHeight
      carouselImage.style.maxHeight = calcualtedHeight
    }
  }

  if (estateLoading) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <CircularProgress color='primary' size={50} />
      </Grid>
    )
  } else if (estateError) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <Typography variant='h4'>{estateError.message}</Typography>
      </Grid>
    )
  } else if (estateData?.estate) {
    const {
      id,
      name,
      description,
      created_by,
      latitude,
      longitude,
      land_area,
      usable_area,
      advert_price,
      estimated_price,
      street_address,
      city_address,
      postal_code,
      primary_type,
      secondary_type
    } = estateData.estate

    const images: Photo[] = [
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1591105299-tfzdwhhniv.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1591105304-iecdowkfvc.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1591105325-bolkotaqbc.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065102-gelfqddtqm.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065103-zlgxvsjzdt.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065108-urqhdtofkq.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065067-pdlugqlazo.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1591105325-bolkotaqbc.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065102-gelfqddtqm.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065103-zlgxvsjzdt.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065108-urqhdtofkq.jpg"
      },
      {
        photo:
          "https://www.bezrealitky.cz/media/cache/record_main/data/record/images/591k/591897/1580065067-pdlugqlazo.jpg"
      }
    ]

    const galleryProps: Props = {
      photos: images,
      show: galleryOpen,
      activePhotoIndex: currentImage,
      onClose: () => setGalleryOpen(false),
      opacity: 0.85,
      phrases: {
        showPhotoList: "Zobrazit náhledy",
        hidePhotoList: "Skrýt náhledy"
      }
    }

    const onPrevImage = () => {
      if (currentImage === 0) {
        setCurrentImage(images.length - 1)
      } else {
        setCurrentImage(currentImage - 1)
      }
    }

    const onNextImage = () => {
      if (currentImage === images.length - 1) {
        setCurrentImage(0)
      } else {
        setCurrentImage(currentImage + 1)
      }
    }

    return (
      <Grid container justifyContent='center'>
        {estateData?.estate && (
          <Grid item xs={12} sm={8} lg={7} xl={6}>
            <Paper style={{ padding: theme.spacing(2) }} variant='outlined'>
              <ReactBnbGallery {...galleryProps} />

              <Grid container direction='row'>
                <Grid item xs={12}>
                  <Typography variant='h4'>
                    {capitalize(primary_type.desc_cz)}, {secondary_type.desc_cz}
                  </Typography>
                  <Typography variant='h6' color='textSecondary' paragraph>
                    {street_address}, {city_address}, {postal_code}
                  </Typography>
                </Grid>

                <Grid
                  item
                  container
                  sm={12}
                  justifyContent='center'
                  alignItems='center'
                  id='carousel-container'
                  className={classes.carouselContainer}
                >
                  <IconButton
                    onClick={onPrevImage}
                    // disabled={currentImage === 0}
                    classes={{ root: classes.carouselArrowRoot }}
                    className={`${classes.carouselArrow} left `}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                  <Grid item>
                    <img
                      onClick={() => setGalleryOpen(true)}
                      src={images[currentImage].photo}
                      alt=''
                      id='carousel-image'
                      className={classes.carouselImage}
                    />
                  </Grid>
                  <IconButton
                    onClick={onNextImage}
                    // disabled={currentImage === images.length - 1}
                    classes={{ root: classes.carouselArrowRoot }}
                    className={`${classes.carouselArrow} right`}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                </Grid>

                <Grid item md={6}>
                  <Typography variant='h6'>Popis</Typography>
                  <Typography variant='body1' paragraph style={{ whiteSpace: "pre-line" }}>
                    {description}
                  </Typography>
                </Grid>

                <Grid item md={6}>
                  <Typography variant='h6'>Parametry</Typography>
                  <List dense classes={{ root: classes.list }}>
                    {land_area && (
                      <ParameterListItem
                        icon={<MapIcon />}
                        value={`${formatNumber(land_area)} m2`}
                        parameter='Plocha pozemku'
                      />
                    )}
                    {usable_area && (
                      <ParameterListItem
                        icon={<HomeIcon />}
                        value={`${formatNumber(usable_area)} m2`}
                        parameter='Užitná plocha'
                      />
                    )}
                    {advert_price && (
                      <ParameterListItem
                        icon={<MoneyIcon />}
                        value={formatNumber(advert_price, {
                          style: "currency",
                          currency: "CZK",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                        parameter='Inzertní cena'
                      />
                    )}
                    {estimated_price && (
                      <ParameterListItem
                        icon={<BankIcon />}
                        value={formatNumber(estimated_price, {
                          style: "currency",
                          currency: "CZK",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                        parameter='Odhadní cena'
                      />
                    )}
                    <ParameterListItem
                      icon={<RoomIcon />}
                      value={`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}
                      parameter='Souřadnice'
                    />
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

const ParameterListItem: React.FunctionComponent<ParameterListItemProps> = ({ parameter, value, icon }) => {
  const classes = useStyles()

  return (
    <ListItem classes={{ root: classes.listItem }}>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={value} secondary={parameter} />
    </ListItem>
  )
}

export default Estate
