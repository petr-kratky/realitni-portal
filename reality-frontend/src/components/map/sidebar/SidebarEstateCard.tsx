import React from "react"

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"

import { AppState } from "../../../types"
import { useEstateQuery } from "../../../graphql/queries/generated/graphql"

type ComponentProps = {
  id: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(1, 0),
      position: "relative"
    },
    actionArea: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    cover: {
      width: 200,
      height: 151
    },
    details: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column"
    },
    content: {
      flex: "1 0 auto"
    },
    header: {
      textTransform: "capitalize"
    },
    menuButton: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1)
    }
  })
)

const Component: React.FunctionComponent<ComponentProps & AppState> = ({ id }) => {
  const classes = useStyles()

  const { data, loading } = useEstateQuery({ variables: { id } })

  if (data?.estate) {
    const {
      estate: {
        images,
        street_address,
        city_address,
        postal_code,
        primary_type: { desc_cz: primaryType },
        secondary_type: { desc_cz: secondarytype }
      }
    } = data

    const thumbnail = images[0]?.small ?? "/static/images/sidebar/thumbnail-fallback.png"

    return (
      <Card className={classes.container} variant='outlined'>
        <CardActionArea className={classes.actionArea}>
          <CardMedia className={classes.cover} image={thumbnail} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant='h6' className={classes.header}>
                {primaryType}, {secondarytype}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {street_address}, {city_address}
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
        <Tooltip title='Možnosti'>
          <IconButton className={classes.menuButton} size='small' onClick={() => console.log("you clicked me!")}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Card>
    )
  } else {
    return null
  }
}

export default Component
