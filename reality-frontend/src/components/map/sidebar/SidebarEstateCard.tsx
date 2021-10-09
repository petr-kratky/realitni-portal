import React from "react"

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import { AppState } from "../../../types"
import EstateMenu from "../../estate/EstateMenu"
import DeleteDialogue from "../../utils/DeleteDialogue"
import { estateModalStore, geojsonStore, snackStore } from "../../../lib/stores"
import { FavoriteEstatesDocument, useAddFavoriteEstateMutation, useDeleteEstateMutation, useEstateQuery, useFavoriteEstatesQuery, useRemoveFavoriteEstateMutation } from "../../../graphql/queries/generated/graphql"

type ComponentProps = {
  id: string
}

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
      height: 151
    },
    details: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column"
    },
    content: {
      flex: "1 0 auto"
    },
    header: {
      textTransform: "capitalize"
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

  const { data: estateData, loading: estateLoading } = useEstateQuery({ variables: { id } })
  const { data: favoriteEstatesData } = useFavoriteEstatesQuery()

  const [deleteEstate, { loading: deleteLoading }] = useDeleteEstateMutation()
  const [addFavoriteEstate] = useAddFavoriteEstateMutation()
  const [removeFavoriteEstate] = useRemoveFavoriteEstateMutation()

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [estateTab, setEstateTab] = React.useState<null | Window>(null)
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
    if (estateTab && !estateTab.closed) {
      estateTab.focus()
    } else {
      const estateWindow = window.open(`/estates/${id}`)
      setEstateTab(estateWindow)
    }
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
        latitude,
        longitude,
        description,
        advert_price,
        estimated_price,
        land_area,
        usable_area,
        name,
        street_address,
        city_address,
        postal_code,
        primary_type: { desc_cz: primaryType, id: primaryTypeId },
        secondary_type: { desc_cz: secondarytype, id: secondaryTypeId }
      }
    } = estateData

    const onEdit = () => {
      estateModalStore.openEditMode(id, {
        primary_type_id: primaryTypeId,
        secondary_type_id: secondaryTypeId,
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

    const fullAddress: string = `${street_address}, ${city_address}`
    const thumbnail = images[0]?.small ?? "/static/images/sidebar/thumbnail-fallback.png"

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
