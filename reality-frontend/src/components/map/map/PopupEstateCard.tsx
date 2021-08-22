import React, { FunctionComponent } from "react"

import { useEstateQuery } from "../../../graphql/queries/generated/graphql"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
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

type PopupEstateCardProps = {
  id: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardHeaderTitle: {
      textTransform: "capitalize"
    }
  })
)

const PopupEstateCard: FunctionComponent<PopupEstateCardProps> = ({ id }) => {
  const classes = useStyles()

  const { data, loading } = useEstateQuery({ variables: { id } })

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchor)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  if (data?.estate) {
    const {
      id,
      name,
      description,
      latitude,
      longitude,
      created_by,
      primary_type,
      secondary_type,
      city_address,
      street_address,
      postal_code,
      advert_price,
      estimated_price,
      land_area,
      usable_area
    } = data.estate

    return (
      <ListItem key={id} style={{ width: 350 }} button>
        <ListItemText
          style={{ textTransform: "capitalize" }}
          primary={`${primary_type?.desc_cz} | ${secondary_type?.desc_cz}`}
          secondary={`${street_address}, ${city_address}`}
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
            <MenuItem>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary='Smazat' />
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return null
}

export default PopupEstateCard
