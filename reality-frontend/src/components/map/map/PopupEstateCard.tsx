import React, { FunctionComponent } from "react"

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

import { useDeleteEstateMutation, useEstateQuery } from "../../../graphql/queries/generated/graphql"
import snackStore, { SnackState } from "src/store/snack.store"
import { CustomPopupProps } from "./CustomPopup"
import { EstateFeature } from "src/types"
import { features } from "process"

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
    }
  })
)

const PopupEstateCard: FunctionComponent<PopupEstateCardProps> = ({ id, features, setPopupProps, popupProps }) => {
  const classes = useStyles()

  const { data: estateData, loading: estateLoading } = useEstateQuery({ variables: { id } })
  const [deleteEstate, { loading: deleteLoading }] = useDeleteEstateMutation()

  const [snackState, setSnackState] = React.useState<SnackState>(snackStore.initialState)

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false)

  const isMenuOpen = Boolean(menuAnchor)

  React.useEffect(() => {
    const snackStoreSub = snackStore.subscribe(setSnackState)
    return snackStoreSub.unsubscribe()
  }, [])

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

  if (estateData?.estate) {
    const { id, primary_type, secondary_type, city_address, street_address } = estateData.estate

    const fullAddress: string = `${street_address}, ${city_address}`

    return (
      <>
        <ListItem key={id} style={{ width: 350 }} button>
          <ListItemText
            style={{ textTransform: "capitalize" }}
            primary={`${primary_type?.desc_cz} | ${secondary_type?.desc_cz}`}
            secondary={fullAddress}
          />
          <ListItemSecondaryAction>
            <IconButton size='small' onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              keepMounted
              elevation={2}
              open={isMenuOpen}
              onClose={handleMenuClose}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem>
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
  }

  return null
}

export default PopupEstateCard
