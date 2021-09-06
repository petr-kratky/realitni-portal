import React, { FunctionComponent } from "react"

import {
  createStyles,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Tooltip
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

import { useDeleteEstateMutation, useEstateWithoutMediaQuery } from "../../../graphql/queries/generated/graphql"
import { estateModalStore, geojsonStore, snackStore } from "src/lib/stores"
import { CustomPopupProps } from "./CustomPopup"
import { EstateFeature } from "src/types"
import DeleteDialogue from "../../utils/DeleteDialogue"
import EstateMenu from "../../estate/EstateMenu"

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

  const { data: estateData, loading: estateLoading } = useEstateWithoutMediaQuery({ variables: { id } })
  const [deleteEstate, { loading: deleteLoading }] = useDeleteEstateMutation()

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [estateTab, setEstateTab] = React.useState<null | Window>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  const isMenuOpen = Boolean(menuAnchor)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
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
      geojsonStore.requestUpdate()
      snackStore.toggle("success", "Nemovitost odstraněna")
    } catch (err) {
      console.error(`Could not delete estate id ${id}`, err)
      snackStore.toggle("error", "Nemovitost se nepodařilo odstranit")
    }
  }

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

  const handleItemClick = () => {
    if (estateTab && !estateTab.closed) {
      estateTab.focus()
    } else {
      const estateWindow = window.open(`/estates/${id}`)
      setEstateTab(estateWindow)
    }
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

    return (
      <>
        <ListItem style={{ width: 350 }} button onClick={handleItemClick}>
          <ListItemText
            style={{ textTransform: "capitalize" }}
            primary={`${primary_type?.desc_cz} | ${secondary_type?.desc_cz}`}
            secondary={fullAddress}
          />
          <ListItemSecondaryAction>
            <Tooltip title='Možnosti'>
              <IconButton size='small' onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <EstateMenu
              open={isMenuOpen}
              menuAnchor={menuAnchor}
              onClose={handleMenuClose}
              onEditClick={onEditButton}
              onDeleteClick={handleDeleteDialogOpen}
            />
            <DeleteDialogue
              open={deleteDialogOpen}
              loading={deleteLoading}
              onClose={handleDeleteDialogClose}
              onDelete={onDelete}
              title='Smazat nemovitost'
              text={`Opravdu si přejete smazat nemovitost na adrese "${fullAddress}"? Tato akce je nevratná a nemovitost bude permanentně odstraněna.`}
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
