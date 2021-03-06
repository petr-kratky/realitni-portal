import React from "react"

import { NextPage } from "next"
import { useRouter } from "next/router"
import Head from "next/head"

import {
  Avatar,
  createStyles,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import RoomIcon from "@material-ui/icons/Room"
import HomeIcon from "@material-ui/icons/Home"
import MapIcon from "@material-ui/icons/Map"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import BankIcon from "@material-ui/icons/AccountBalance"
import EditIcon from "@material-ui/icons/Edit"
import CityIcon from "@material-ui/icons/LocationCity"
import ImageLibraryIcon from "@material-ui/icons/PhotoLibrary"
import FileLibraryIcon from "@material-ui/icons/AttachFile"
import DeleteIcon from "@material-ui/icons/Delete"
import {
  Deck,
  DirectionsCar,
  Map,
  LocalParking,
  Pool,
  Star,
  StarOutline,
  SwapVert,
  Weekend,
  ZoomOutMap,
  Info,
  InfoOutlined,
  Add
} from "@material-ui/icons"

import { Photo } from "react-bnb-gallery"

import {
  FavoriteEstatesDocument,
  RecentEstatesDocument,
  useAddFavoriteEstateMutation,
  useAddRecentEstateMutation,
  useDeleteEstateMutation,
  useEstateQuery,
  useFavoriteEstatesQuery,
  useRemoveFavoriteEstateMutation
} from "src/graphql/queries/generated/graphql"
import { formatNumber } from "src/utils/number-formatter"
import ImageCarousel from "src/components/estate/ImageCarousel"
import { AppState } from "src/types"
import { estateModalStore, snackStore } from "src/lib/stores"
import ImageLibrary from "../../components/estate/ImageLibrary"
import FileLibrary from "../../components/estate/FileLibrary"
import DeleteDialogue from "../../components/utils/DeleteDialogue"
import Edit from "@material-ui/icons/Edit"

type ParameterListItemProps = {
  icon: React.ReactNode
  parameter: string
  value: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: "flex",
      flexFlow: "row wrap",
      [theme.breakpoints.up("xl")]: {
        maxWidth: 210 * 2
      }
    },
    listItem: {
      width: 210,
      [theme.breakpoints.down("xs")]: {
        maxWidth: 160
      }
    },
    menuButtonDivider: {
      width: 1,
      height: "60%",
      margin: theme.spacing(0, 0.6),
      backgroundColor: theme.palette.grey[400]
    }
  })
)

const EstatePage: NextPage<AppState> = ({ appState }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const { estate } = router.query

  const { data: estateData } = useEstateQuery({ variables: { id: estate as string } })
  const { data: favoriteEstatesData } = useFavoriteEstatesQuery()

  const [deleteEstate, { loading: deleteLoading }] = useDeleteEstateMutation()
  const [addRecentEstate] = useAddRecentEstateMutation()
  const [addFavoriteEstate] = useAddFavoriteEstateMutation()
  const [removeFavoriteEstate] = useRemoveFavoriteEstateMutation()

  const [imageLibraryOpen, setImageLibraryOpen] = React.useState<boolean>(false)
  const [fileLibraryOpen, setFileLibraryOpen] = React.useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  const isFavorite = React.useMemo(
    () => favoriteEstatesData?.favoriteEstates.some(fav => fav.id === estate),
    [favoriteEstatesData, estate]
  )

  React.useEffect(() => {
    try {
      addRecentEstate({
        variables: { estate_id: estate as string },
        refetchQueries: [{ query: RecentEstatesDocument }]
      })
    } catch (err) {
      console.error(`Could not add estate ${estate} to recently visited!`, err)
    }
  }, [estate])

  const goToLocation = () => {
    router.push(`/map?longitude=${estateData?.estate?.longitude}&latitude=${estateData?.estate?.latitude}&zoom=18`)
  }

  const onDelete = async () => {
    try {
      if (typeof estate === "string") {
        await deleteEstate({ variables: { id: estate } })
        closeDeleteDialogue()
        goToLocation()
        snackStore.toggle("success", "Nemovitost odstran??na")
      }
    } catch (err) {
      console.error(`Could not delete estate id ${estate}`, err)
      snackStore.toggle("error", "Nemovitost se nepoda??ilo odstranit")
    }
  }

  const onFavorite = async () => {
    if (isFavorite) {
      try {
        await removeFavoriteEstate({
          variables: { estate_id: estate as string },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to remove estate ${estate} from favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepoda??ilo odstranit ze seznamu obl??ben??ch")
      }
    } else {
      try {
        await addFavoriteEstate({
          variables: { estate_id: estate as string },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to add estate ${estate} to favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepoda??ilo p??idat do seznamu obl??ben??ch")
      }
    }
  }

  const openImageLibrary = () => {
    setImageLibraryOpen(true)
  }

  const closeImageLibrary = () => {
    setImageLibraryOpen(false)
  }

  const openFileLibrary = () => {
    setFileLibraryOpen(true)
  }

  const closeFileLibrary = () => {
    setFileLibraryOpen(false)
  }

  const openDeleteDialogue = () => {
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialogue = () => {
    setDeleteDialogOpen(false)
  }

  if (estateData?.estate) {
    const {
      id,
      name,
      description,
      created_by: { username: createdBy },
      created_on,
      last_modified_by: { username: lastModifiedBy },
      last_modified_on,
      images,
      files,
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
      secondary_type,
      terrace,
      garage,
      swimming_pool,
      elevator,
      cellar,
      furnished,
      parking
    } = estateData.estate

    const onEstateEditButton = () => {
      estateModalStore.openEditMode(id, estateData.estate)
    }

    const galleryPhotos: Photo[] = estateData.estate.images.map(img => ({
      photo: img.large,
      thumbnail: img.small
    }))

    const address: string = `${street_address}, ${city_address}`

    return (
      <>
        <Head>
          <title>
            {primary_type.desc_cz}, {secondary_type.desc_cz} - {address} | Realitn?? Port??l
          </title>
        </Head>
        <Grid container justifyContent='center'>
          {estateData?.estate && (
            <Grid item xs={12} sm={9} lg={7} xl={6}>
              <Paper style={{ padding: theme.spacing(2) }} variant='outlined'>
                <Grid container direction='row' justifyContent='space-between'>
                  <Grid container item xs={12} direction='column'>
                    <Grid container item direction='row' alignItems='center'>
                      <Tooltip title={isFavorite ? "Odstranit z obl??ben??ch" : "P??idat do obl??ben??ch"}>
                        <IconButton edge='start' onClick={onFavorite}>
                          {isFavorite ? <Star /> : <StarOutline />}
                        </IconButton>
                      </Tooltip>
                      <Typography variant='h4'>
                        {primary_type.desc_cz}, {secondary_type.desc_cz}
                      </Typography>
                    </Grid>
                    <Grid container item direction='row' alignItems='center'>
                      <Tooltip title='Zobrazit na map??'>
                        <IconButton edge='start' onClick={goToLocation}>
                          <Map />
                        </IconButton>
                      </Tooltip>
                      <Typography variant='h6' color='textSecondary'>
                        {street_address}, {city_address}, {postal_code}
                      </Typography>
                    </Grid>
                  </Grid>

                  <ImageLibrary estateId={id} images={images} onClose={closeImageLibrary} open={imageLibraryOpen} />
                  <FileLibrary estateId={id} files={files} onClose={closeFileLibrary} open={fileLibraryOpen} />

                  <Grid item xs={12} container alignItems='center'>
                    <Tooltip title='Upravit'>
                      <IconButton edge='start' onClick={onEstateEditButton}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Fotografie'>
                      <IconButton onClick={openImageLibrary}>
                        <ImageLibraryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='P????lohy'>
                      <IconButton onClick={openFileLibrary}>
                        <FileLibraryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Odstranit'>
                      <IconButton onClick={openDeleteDialogue}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  {!!galleryPhotos.length && <ImageCarousel images={galleryPhotos} />}

                  {!!description && (
                    <Grid item xl={6}>
                      <Typography variant='h5' style={{ margin: "8px 0" }}>
                        Popis nemovitosti
                      </Typography>
                      <Typography variant='body1' paragraph style={{ whiteSpace: "pre-line" }}>
                        {description}
                      </Typography>
                    </Grid>
                  )}

                  <Grid item>
                    <Typography variant='h5'>Parametry</Typography>
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
                          parameter='U??itn?? plocha'
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
                          parameter='Inzertn?? cena'
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
                          parameter='Odhadn?? cena'
                        />
                      )}
                      <ParameterListItem
                        icon={<RoomIcon />}
                        value={`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                        parameter='Sou??adnice'
                      />
                      <ParameterListItem icon={<CityIcon />} value={city_address} parameter='Lokalita' />
                      {terrace && <ParameterListItem icon={<Deck />} value='Terasa' parameter='Ano' />}
                      {garage && <ParameterListItem icon={<DirectionsCar />} value='Gar????' parameter='Ano' />}
                      {swimming_pool && <ParameterListItem icon={<Pool />} value='Baz??n' parameter='Ano' />}
                      {elevator && <ParameterListItem icon={<SwapVert />} value='V??tah' parameter='Ano' />}
                      {cellar && <ParameterListItem icon={<ZoomOutMap />} value='Sklepen??' parameter='Ano' />}
                      {furnished && <ParameterListItem icon={<Weekend />} value='Vybaven??' parameter='Ano' />}
                      {parking && <ParameterListItem icon={<LocalParking />} value='Parkov??n??' parameter='Ano' />}
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
          <DeleteDialogue
            open={deleteDialogOpen}
            loading={deleteLoading}
            onClose={closeDeleteDialogue}
            onDelete={onDelete}
            title='Smazat nemovitost'
            text={`Opravdu si p??ejete smazat nemovitost na adrese "${address}"? Tato akce je nevratn?? a nemovitost bude permanentn?? odstran??na spole??n?? se v??emi p????lohami a fotografiemi.`}
          />
        </Grid>
      </>
    )
  } else {
    return null
  }
}

const ParameterListItem: React.FunctionComponent<ParameterListItemProps> = ({ parameter, value, icon }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))

  return (
    <ListItem disableGutters={xs} classes={{ root: classes.listItem }}>
      {!xs && (
        <ListItemAvatar>
          <Avatar>{icon}</Avatar>
        </ListItemAvatar>
      )}
      <ListItemText primary={value} secondary={parameter} />
    </ListItem>
  )
}

export default EstatePage
