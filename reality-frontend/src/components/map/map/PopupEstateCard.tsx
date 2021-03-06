import React, { FunctionComponent } from "react"

import {
  createStyles,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import {
  FavoriteEstatesDocument,
  useAddFavoriteEstateMutation,
  useDeleteEstateMutation,
  useEstateWithoutMediaQuery,
  useFavoriteEstatesQuery,
  useRemoveFavoriteEstateMutation
} from "../../../graphql/queries/generated/graphql"
import { estateModalStore, geojsonStore, snackStore } from "src/lib/stores"
import { CustomPopupProps } from "./CustomPopup"
import { EstateFeature } from "src/types"
import DeleteDialogue from "../../utils/DeleteDialogue"
import EstateMenu from "../../estate/EstateMenu"
import { Star, StarOutline } from "@material-ui/icons"

type PopupEstateCardProps = {
  id: string
  features: Array<EstateFeature>
  popupProps: CustomPopupProps
  setPopupProps: React.Dispatch<React.SetStateAction<CustomPopupProps>>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardHeaderTitle: {
      textTransform: "capitalize"
    },
    link: {
      color: "inherit"
    }
  })
)

const PopupEstateCard: FunctionComponent<PopupEstateCardProps> = ({ id, features, setPopupProps, popupProps }) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true })

  const { data: estateData, loading: estateLoading } = useEstateWithoutMediaQuery({ variables: { id } })
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
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
        snackStore.toggle("error", "Nemovitost se nepoda??ilo odstranit ze seznamu obl??ben??ch")
      }
    } else {
      try {
        await addFavoriteEstate({
          variables: { estate_id: id },
          refetchQueries: [{ query: FavoriteEstatesDocument }]
        })
      } catch (err) {
        console.log(`Failed to add estate ${id} to favorites`, err)
        snackStore.toggle("error", "Nemovitost se nepoda??ilo p??idat do seznamu obl??ben??ch")
      }
    }
  }

  const onDelete = async () => {
    try {
      await deleteEstate({ variables: { id } })
      handleDeleteDialogClose()
      handleMenuClose()
      const updatedFeatures = features.filter(f => f.properties.id !== id)
      if (features.length === 1) {
        setPopupProps({ ...popupProps, features: updatedFeatures, isVisible: false })
      } else {
        const updatedFeatures = features.filter(f => f.properties.id !== id)
        setPopupProps({ ...popupProps, features: updatedFeatures })
      }
      geojsonStore.refetchFeatures()
      snackStore.toggle("success", "Nemovitost odstran??na")
    } catch (err) {
      console.error(`Could not delete estate id ${id}`, err)
      snackStore.toggle("error", "Nemovitost se nepoda??ilo odstranit")
    }
  }

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  const handleItemClick = () => {
    const estateWindow = window.open(`/estates/${id}`, "_blank")
  }

  if (estateData?.estate) {
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
    const fullAddress: string = `${street_address}, ${city_address}`

    const onEditButton = () => {
      estateModalStore.openEditMode(id, estateData.estate)
    }

    return (
      <>
        <ListItem style={{ width: xs ? "100%" : 350 }} button onClick={handleItemClick}>
          <ListItemText primary={`${primary_type?.desc_cz} | ${secondary_type?.desc_cz}`} secondary={fullAddress} />
          <ListItemSecondaryAction>
            <Tooltip title='Mo??nosti'>
              <IconButton size='small' edge='end' onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <EstateMenu
              open={isMenuOpen}
              menuAnchor={menuAnchor}
              favorite={!!isFavorite}
              onClose={handleMenuClose}
              onEditClick={onEditButton}
              onDeleteClick={handleDeleteDialogOpen}
              onFavoriteClick={onFavorite}
            />
            <DeleteDialogue
              open={deleteDialogOpen}
              loading={deleteLoading}
              onClose={handleDeleteDialogClose}
              onDelete={onDelete}
              title='Smazat nemovitost'
              text={`Opravdu si p??ejete smazat nemovitost na adrese "${fullAddress}"? Tato akce je nevratn?? a nemovitost bude permanentn?? odstran??na spole??n?? se v??emi p????lohami a fotografiemi.`}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </>
    )
  } else {
    return null
  }
}

export default PopupEstateCard
