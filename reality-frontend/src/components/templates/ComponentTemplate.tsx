import React from "react"

import { createStyles, makeStyles, Theme } from "@material-ui/core"

type ComponentProps = {}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({}) => {
  const classes = useStyles()

  return (
    <div>
      <span>I am a Component!</span>
    </div>
  )
}

export default Component
