import React from "react"

import { Button, createStyles, Grid, IconButton, makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core"
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeftRounded"
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRightRounded"

import ReactBnbGallery, { Props, Photo } from "react-bnb-gallery"
import "react-bnb-gallery/dist/style.css"

type ImageCarouselProps = {
  registerResizeListenerTrigger: any
  images: Photo[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    carouselButton: {
      position: "absolute",
      bottom: 0,
      left: "50%",
      margin: theme.spacing(5, 0),
      transform: "translate(-50%, 50%)",
      boxShadow: theme.shadows[1]
    },
    carouselButtonRoot: {
      padding: theme.spacing(0.5, 2),
      transition: theme.transitions.create(["opacity"]),
      backgroundColor: theme.palette.background.paper,
      opacity: 0.9,
      "&:hover": {
        backgroundColor: theme.palette.background.paper,
        opacity: 1
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: theme.typography.fontSize - 2,
        lineHeight: "unset",
        margin: theme.spacing(4, 0)
      }
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
      position: "relative",
      margin: theme.spacing(2, 0)
    },
    carouselImage: {
      // width: "auto", // autosize
      maxWidth: "100%",
      minHeight: "100%", // cover
      minWidth: "100%", // cover
      cursor: "pointer",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      objectFit: "cover"
    }
  })
)

const ImageCarousel: React.FunctionComponent<ImageCarouselProps> = ({ registerResizeListenerTrigger, images }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))

  const [galleryOpen, setGalleryOpen] = React.useState<boolean>(false)
  const [currentImage, setCurrentImage] = React.useState<number>(0)

  React.useEffect(() => {
    adjustCarouselHeight()
    window.addEventListener("resize", adjustCarouselHeight)
  }, [registerResizeListenerTrigger])

  const adjustCarouselHeight = () => {
    const carouselContainer = document.getElementById("carousel-container")
    const carouselImage = document.getElementById("carousel-image")
    if (carouselContainer && carouselImage) {
      const calcualtedHeight = (carouselContainer.offsetWidth / 1.5).toString() + "px"
      carouselContainer.style.minHeight = calcualtedHeight
      carouselContainer.style.maxHeight = calcualtedHeight
      carouselImage.style.maxHeight = calcualtedHeight
    }
  }

  const reactBnbGalleryProps: Props = {
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

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'ArrowLeft') onPrevImage()
    if (event.key === 'ArrowRight') onNextImage()
  }

  return (
    <>
      <ReactBnbGallery {...reactBnbGalleryProps} />
      <Grid
        item
        container
        sm={12}
        justifyContent='center'
        alignItems='center'
        id='carousel-container'
        className={classes.carouselContainer}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <Button
          size='small'
          disableRipple
          onClick={() => setGalleryOpen(true)}
          classes={{ root: classes.carouselButtonRoot }}
          className={classes.carouselButton}
        >
          zobrazit všechny fotografie ({images.length})
        </Button>
        <IconButton
          onClick={onPrevImage}
          // disabled={currentImage === 0}
          size={xs ? "small" : "medium"}
          classes={{ root: classes.carouselArrowRoot }}
          className={`${classes.carouselArrow} left `}
        >
          <ArrowLeftIcon />
        </IconButton>
        {/* autosize */}
        {/* <Grid item> */}
        <img
          onClick={() => setGalleryOpen(true)}
          src={images[currentImage].photo ?? ''}
          alt=''
          id='carousel-image'
          className={classes.carouselImage}
        />
        {/* autosize */}
        {/* </Grid> */}
        <IconButton
          onClick={onNextImage}
          // disabled={currentImage === images.length - 1}
          size={xs ? "small" : "medium"}
          classes={{ root: classes.carouselArrowRoot }}
          className={`${classes.carouselArrow} right`}
        >
          <ArrowRightIcon />
        </IconButton>
      </Grid>
    </>
  )
}

export default ImageCarousel
