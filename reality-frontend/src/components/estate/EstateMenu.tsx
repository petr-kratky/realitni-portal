import React from "react"

import { createStyles, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, Theme } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

type ComponentProps = {
  open: boolean
  menuAnchor: null | HTMLElement
  onClose: () => void
  onEditClick: () => void
  onDeleteClick: () => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({
  open,
  menuAnchor,
  onClose,
  onEditClick,
  onDeleteClick
}) => {
  const classes = useStyles()

  return (
    <Menu
      anchorEl={menuAnchor}
      elevation={2}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      MenuListProps={{ dense: true }}
    >
      <MenuItem onClick={onEditClick}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary='Upravit' />
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
