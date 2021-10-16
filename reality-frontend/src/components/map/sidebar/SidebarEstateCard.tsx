import React from "react"

import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import { AppState } from "../../../types"
import EstateMenu from "../../estate/EstateMenu"
import DeleteDialogue from "../../utils/DeleteDialogue"
import { estateModalStore, geojsonStore, snackStore } from "../../../lib/stores"
import {
  FavoriteEstatesDocument,
  useAddFavoriteEstateMutation,
  useDeleteEstateMutation,
  useEstateQuery,
  useFavoriteEstatesQuery,
  useRemoveFavoriteEstateMutation
} from "../../../graphql/queries/generated/graphql"
import { formatNumber } from "../../../utils/number-formatter"

type ComponentProps = {
  id: string
}

const CARD_HEIGHT: number = 165
const CARD_HEIGHT_XS: number = 160

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(1, 0),
      position: "relative"
    },
    actionArea: {
      display: "flex",
      alignItems: "flex-start"
    },
    cover: {
      width: 200,
      minWidth: 200,
      height: CARD_HEIGHT,
      [theme.breakpoints.down("xs")]: {
        width: CARD_HEIGHT_XS,
        minWidth: CARD_HEIGHT_XS,
        height: CARD_HEIGHT_XS
      }
    },
    details: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        height: CARD_HEIGHT_XS
      }
    },
    content: {
      flex: "1 0 auto",
      flexDirection: "column",
      overflowY: "scroll",
      height: CARD_HEIGHT,
			paddingBottom: '4px !important'
    },
    header: {
      textTransform: "capitalize",
      fontSize: 18,
      [theme.breakpoints.down("xs")]: {
        fontSize: 16,
        maxWidth: "90%"
      }
    },
    chip: {
      margin: theme.spacing(0.5, 0.5, 0.5, 0)
    },
    menuButton: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1)
    }
  })
)

const Component: React.FunctionComponent<ComponentProps & AppState> = ({ id }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true })

  const { data: estateData, loading: estateLoading } = useEstateQuery({ variables: { id } })
  const { data: favoriteEstatesData } = useFavoriteEstatesQuery()

  const [deleteEstate, { loading: deleteLoading }] = useDeleteEstateMutation()
  const [addFavoriteEstate] = useAddFavoriteEstateMutation()
  const [removeFavoriteEstate] = useRemoveFavoriteEstateMutation()

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  const isMenuOpen = Boolean(menuAnchor)
  const isFavorite = React.useMemo(
    () => favoriteEstatesData?.favoriteEstates.some(fav => fav.id === id),
    [favoriteEstatesData, id]
  )

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const closeMenu = () => {
    setMenuAnchor(null)
  }

  const openDeleteDialogue = () => {
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialogue = () => {
    setDeleteDialogOpen(false)
  }

  const onCardClick = () => {
    window.open(`/estates/${id}`, "_blank")
  }

  const onDelete = async () => {
    try {
      await deleteEstate({ variables: { id } })
      closeDeleteDialogue()
      closeMenu()
      geojsonStore.refetchFeatures()
      snackStore.toggle("success", "Nemovitost odstraněna")
    } catch (err) {
      console.error(`Could not delete estate id ${id}`, err)
      snackStore.toggle("error", "Nemovitost se nepodařilo odstranit")
    }
  }

  const onFavorite = async () => {
    if (isFavorite) {
      try {
        await removeFavoriteEstate({
          variables: { estate_id: id },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to remove estate ${id} from favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepodařilo odstranit ze seznamu oblíbených")
      }
    } else {
      try {
        await addFavoriteEstate({
          variables: { estate_id: id },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to add estate ${id} to favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepodařilo přidat do seznamu oblíbených")
      }
    }
  }

  if (estateData?.estate) {
    const {
      estate: {
        images,
        street_address,
        city_address,
        last_modified_on,
        created_on,
        garage,
        furnished,
        elevator,
        cellar,
        terrace,
        parking,
        swimming_pool,
        estimated_price,
        advert_price,
        usable_area,
        land_area,
        primary_type: { desc_cz: primaryType, id: primaryTypeId },
        secondary_type: { desc_cz: secondarytype, id: secondaryTypeId }
      }
    } = estateData

    const onEdit = () => {
      estateModalStore.openEditMode(id, estateData.estate)
    }

    const fullAddress: string = `${street_address}, ${city_address}`
    const thumbnail = images[0]?.small ?? "/static/images/sidebar/thumbnail-fallback.png"

    const chips: Array<{ prefix?: string; label: string; title: string } | null> = [
      advert_price
        ? {
            prefix: "IC",
            title: "Inzertní cena",
            label: `${formatNumber(advert_price, {
              style: "currency",
              currency: "CZK",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`
          }
        : null,
      estimated_price
        ? {
            prefix: "OC",
            title: "Odhadní cena",
            label: `${formatNumber(estimated_price, {
              style: "currency",
              currency: "CZK",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`
          }
        : null,
      usable_area
        ? {
            prefix: "UP",
            title: "Užitná plocha",
            label: `${formatNumber(usable_area)} m2`
          }
        : null,
      land_area
        ? {
            prefix: "PP",
            title: "Plocha pozemku",
            label: `${formatNumber(land_area)} m2`
          }
        : null,
      garage
        ? {
            title: "Garáž",
            label: "Garáž"
          }
        : null,
      swimming_pool
        ? {
            title: "Bazén",
            label: "Bazén"
          }
        : null,
      parking
        ? {
            title: "Parkování",
            label: "Parkování"
          }
        : null,
      furnished
        ? {
            title: "Vybavení",
            label: "Vybavení"
          }
        : null,
      terrace
        ? {
            title: "Terasa",
            label: "Terasa"
          }
        : null,
      cellar
        ? {
            title: "Sklepení",
            label: "Sklepení"
          }
        : null,
      elevator
        ? {
            title: "Výtah",
            label: "Výtah"
          }
        : null
    ]

    return (
      <Card className={classes.container} variant='outlined'>
        <CardActionArea className={classes.actionArea} onClick={onCardClick}>
          <CardMedia className={classes.cover} image={thumbnail} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant='h6' className={classes.header}>
                {primaryType}, {secondarytype}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {street_address}, {city_address}
              </Typography>
              {chips.map(
                chip =>
                  chip !== null && (
                    <Tooltip title={chip.title}>
                      <Chip
                        className={classes.chip}
                        size='small'
                        avatar={chip.prefix ? <Avatar>{chip.prefix}</Avatar> : <></>}
                        key={chip.label}
                        label={chip.label}
                      />
                    </Tooltip>
                  )
              )}
            </CardContent>
          </div>
        </CardActionArea>
        <Tooltip title='Možnosti'>
          <IconButton className={classes.menuButton} size='small' onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <EstateMenu
          open={isMenuOpen}
          menuAnchor={menuAnchor}
          favorite={!!isFavorite}
          onClose={closeMenu}
          onEditClick={onEdit}
          onDeleteClick={openDeleteDialogue}
          onFavoriteClick={onFavorite}
        />
        <DeleteDialogue
          open={deleteDialogOpen}
          loading={deleteLoading}
          onClose={closeDeleteDialogue}
          onDelete={onDelete}
          title='Smazat nemovitost'
          text={`Opravdu si přejete smazat nemovitost na adrese "${fullAddress}"? Tato akce je nevratná a nemovitost bude permanentně odstraněna společně se všemi přílohami a fotografiemi.`}
        />
      </Card>
    )
  } else {
    return null
  }
}

export default Component
