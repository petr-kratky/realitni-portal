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
import { Star, StarOutline } from "@material-ui/icons"

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
    menuButtonDivider: {
      width: 1,
      height: "60%",
      margin: theme.spacing(0, 0.5),
      backgroundColor: theme.palette.grey[400]
    }
  })
)

const EstatePage: NextPage<AppState> = ({ appState }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const { estate } = router.query

  const {
    data: estateData,
    loading: estateLoading,
    error: estateError
  } = useEstateQuery({ variables: { id: estate as string } })
  const {
    data: favoriteEstatesData,
    loading: favoriteEstatesLoading,
    error: favoriteEstatesError
  } = useFavoriteEstatesQuery()

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

  const onDelete = async () => {
    try {
      if (typeof estate === "string") {
        await deleteEstate({ variables: { id: estate } })
        closeDeleteDialogue()
        router.push(`/map?longitude=${estateData?.estate?.longitude}&latitude=${estateData?.estate?.latitude}&zoom=17`)
        snackStore.toggle("success", "Nemovitost odstraněna")
      }
    } catch (err) {
      console.error(`Could not delete estate id ${estate}`, err)
      snackStore.toggle("error", "Nemovitost se nepodařilo odstranit")
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
        snackStore.toggle("error", "Nemovitost se nepodařilo odstranit ze seznamu oblíbených")
      }
    } else {
      try {
        await addFavoriteEstate({
          variables: { estate_id: estate as string },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to add estate ${estate} to favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepodařilo přidat do seznamu oblíbených")
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
      created_by,
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
      secondary_type
    } = estateData.estate

    const onEstateEditButton = () => {
      estateModalStore.openEditMode(id, {
        primary_type_id: primary_type.id,
        secondary_type_id: secondary_type.id,
        coordinates: `${latitude}, ${longitude}`,
        name: name ?? "",
        description: description ?? "",
        advert_price: advert_price ?? ("" as unknown as number),
        estimated_price: estimated_price ?? ("" as unknown as number),
        land_area: land_area ?? ("" as unknown as number),
        usable_area: usable_area ?? ("" as unknown as number),
        city_address,
        postal_code,
        street_address
      })
    }

    const galleryPhotos: Photo[] = estateData.estate.images.map(img => ({
      photo: img.large,
      thumbnail: img.small
    }))

    const fullAddress: string = `${street_address}, ${city_address}`

    return (
      <>
        <Head>
          <title>
            {primary_type.desc_cz}, {secondary_type.desc_cz} - {fullAddress} | Realitní Portál
          </title>
        </Head>
        <Grid container justifyContent='center'>
          {estateData?.estate && (
            <Grid item xs={12} sm={9} lg={7} xl={6}>
              <Paper style={{ padding: theme.spacing(2) }} variant='outlined'>
                <Grid container direction='row'>
                  <Grid container item xs={12} direction='column'>
                    <Grid container item direction='row' alignItems='center'>
                      <Tooltip title={isFavorite ? "Odstranit z oblíbených" : "Přidat do oblíbených"}>
                        <IconButton edge='start' onClick={onFavorite}>
                          {isFavorite ? <Star /> : <StarOutline />}
                        </IconButton>
                      </Tooltip>
                      <Typography variant='h4'>
                        {primary_type.desc_cz}, {secondary_type.desc_cz}
                      </Typography>
                    </Grid>
                    <Typography variant='h6' color='textSecondary'>
                      {street_address}, {city_address}, {postal_code}
                    </Typography>
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
                    <Tooltip title='Přílohy'>
                      <IconButton onClick={openFileLibrary}>
                        <FileLibraryIcon />
                      </IconButton>
                    </Tooltip>
                    <div className={classes.menuButtonDivider} />
                    <Tooltip title='Odstranit'>
                      <IconButton onClick={openDeleteDialogue}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  {!!galleryPhotos.length && <ImageCarousel images={galleryPhotos} />}

                  {!!description && (
                    <Grid item md={6}>
                      <Typography variant='h6'>Popis</Typography>
                      <Typography variant='body1' paragraph style={{ whiteSpace: "pre-line" }}>
                        {description}
                      </Typography>
                    </Grid>
                  )}

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
                      <ParameterListItem icon={<CityIcon />} value={city_address} parameter='Lokalita' />
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
            text={`Opravdu si přejete smazat nemovitost na adrese "${fullAddress}"? Tato akce je nevratná a nemovitost bude permanentně odstraněna společně se všemi přílohami a fotografiemi.`}
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

  return (
    <ListItem classes={{ root: classes.listItem }}>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={value} secondary={parameter} />
    </ListItem>
  )
}

export default EstatePage
