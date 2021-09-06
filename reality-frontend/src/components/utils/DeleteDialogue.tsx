import React from "react"

import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme
} from "@material-ui/core"

type ComponentProps = {
  loading: boolean
  open: boolean
  title: string
  text: string
  onDelete: () => void
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({ loading, open, title, text, onDelete, onClose }) => {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={onClose} keepMounted={false}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='default' onClick={onClose}>
          zavřít
        </Button>
        <Button color='secondary' onClick={onDelete} disabled={loading}>
          smazat
          {loading && (
            <>
              &nbsp;&nbsp;
              <CircularProgress size={20} color='primary' />{" "}
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Component
