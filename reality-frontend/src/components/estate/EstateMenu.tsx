import React from "react"

import {
  createStyles,
  Divider,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Star from "@material-ui/icons/Star"
import StarOutline from "@material-ui/icons/StarOutline"

type ComponentProps = {
  open: boolean
  favorite: boolean
  menuAnchor: null | HTMLElement
  onClose: () => void
  onEditClick: () => void
  onDeleteClick: () => void
  onFavoriteClick: () => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({
  open,
  favorite,
  menuAnchor,
  onClose,
  onEditClick,
  onDeleteClick,
  onFavoriteClick
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true })

  return (
    <Menu
      anchorEl={menuAnchor}
      elevation={2}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      MenuListProps={{ dense: xs ? false : true }}
    >
      <MenuItem onClick={onEditClick}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary='Upravit' />
      </MenuItem>
      <MenuItem divider onClick={onFavoriteClick}>
        <ListItemIcon>{favorite ? <Star /> : <StarOutline />}</ListItemIcon>
        <ListItemText primary='Oblíbené' />
      </MenuItem>
      <MenuItem onClick={onDeleteClick}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary='Smazat' />
      </MenuItem>
    </Menu>
  )
}

export default Component
