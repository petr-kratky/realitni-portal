import React, { FunctionComponent } from "react"

import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { estateModalStore, snackStore } from "src/lib/stores"
import { CustomPopupProps } from "./CustomPopup"
import { EstateFeature } from "src/types"

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

  const onDeleteConfirmation = async () => {
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
      snackStore.toggle("success", "Nemovitost odstraněna")
    } catch (err) {
      console.error(`Could not delete estate id ${id}`, err)
      snackStore.toggle("error", "Nemovitost se nepodařilo smazat")
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
            <Menu
              anchorEl={menuAnchor}
              keepMounted
              elevation={2}
              open={isMenuOpen}
              onClose={handleMenuClose}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={onEditButton}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary='Upravit' />
              </MenuItem>
              <MenuItem onClick={handleDeleteDialogOpen}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Smazat' />
              </MenuItem>
            </Menu>
          </ListItemSecondaryAction>
        </ListItem>
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
          <DialogTitle>Smazat nemovitost</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Opravdu si přejete smazat nemovitost na adrese {fullAddress}? Tato akce je nevratná a nemovitost bude
              permanentně odstraněna.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color='default' onClick={handleDeleteDialogClose}>
              zavřít
            </Button>
            <Button color='secondary' onClick={onDeleteConfirmation} disabled={deleteLoading}>
              smazat
              {deleteLoading && (
                <>
                  &nbsp;
                  <CircularProgress size={20} color='primary' />{" "}
                </>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  } else {
    return null
  }
}

export default PopupEstateCard
