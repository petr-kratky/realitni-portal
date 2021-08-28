import React from "react"

import {
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  makeStyles,
  Theme
} from "@material-ui/core"

type LoadingDialogueProps = {
  title: string
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      width: "100%",
      marginBottom: 16,
      paddingBottom: 6
    }
  })
)

const LoadingDialogue: React.FunctionComponent<LoadingDialogueProps> = ({ open, title }) => {
  const classes = useStyles()

  return (
    <Dialog open={open}>
      <DialogTitle>{title}...</DialogTitle>
      <DialogContent>
        <Grid container justifyContent='center' alignItems='center'>
          <LinearProgress className={classes.progress} style={{}} />
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default LoadingDialogue
