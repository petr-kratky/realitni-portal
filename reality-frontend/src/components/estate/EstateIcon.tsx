import React from "react"

import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { Home, Landscape, Apartment, NotListedLocation, Business } from "@material-ui/icons"

type ComponentProps = {
  primaryType: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const Component: React.FunctionComponent<ComponentProps> = ({ primaryType }) => {
  const classes = useStyles()

  switch (primaryType) {
    case "1":
      return <Home />
    case "2":
      return <Landscape />
    case "3":
      return <Business />
    case "4":
      return <NotListedLocation />
    case "5":
      return <Apartment />
    default:
      return <Home />
  }
}

export default Component
