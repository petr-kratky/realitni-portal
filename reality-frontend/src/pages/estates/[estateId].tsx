import React from "react"

import { NextPage } from "next"
import { useRouter } from "next/router"

import {
  Avatar,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme
} from "@material-ui/core"
import RoomIcon from "@material-ui/icons/Room"
import HomeIcon from "@material-ui/icons/Home"
import MapIcon from "@material-ui/icons/Map"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import BankIcon from "@material-ui/icons/AccountBalance"
import EditIcon from "@material-ui/icons/Edit"

import { Photo } from "react-bnb-gallery"

import { useEstateQuery } from "src/graphql/queries/generated/graphql"
import { capitalize } from "src/utils/capitalize"
import { formatNumber } from "src/utils/number-formatter"
import ImageCarousel from "src/components/estate/ImageCarousel"
import { AppState } from "src/types"
import estateModalStore from "src/store/estate-modal.store"

type ParameterListItemProps = {
  icon: React.ReactNode
  parameter: string
  value: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: "flex",
      flexFlow: "row wrap"
    },
    listItem: {
      width: 230
    }
  })
)

const EstatePage: NextPage<AppState> = ({ appState }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const { estateId } = router.query

  const {
    data: estateData,
    loading: estateLoading,
    error: estateError
  } = useEstateQuery({ variables: { id: estateId as string } })

  if (estateLoading) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <CircularProgress color='primary' size={50} />
      </Grid>
    )
  } else if (estateError) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <Typography variant='h4'>{estateError.message}</Typography>
      </Grid>
    )
  } else if (estateData?.estate) {
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

    const onEstateEditButton = () => {
      estateModalStore.openEditMode(id, {
        primary_type_id: primary_type.id,
        secondary_type_id: secondary_type.id,
        coordinates: `${latitude}, ${longitude}`,
        name: name ?? '',
        description: description ?? '',
        advert_price: advert_price ?? ("" as unknown as number),
        estimated_price: estimated_price ?? ("" as unknown as number),
        land_area: land_area ?? ("" as unknown as number),
        usable_area: usable_area ?? ("" as unknown as number),
        city_address,
        postal_code,
        street_address
      })
    }

    const images: Photo[] = estateData.estate.images.map(img => ({
      photo: img.large,
      thumbnail: img.small
    }))

    return (
      <Grid container justifyContent='center'>
        {estateData?.estate && (
          <Grid item xs={12} sm={9} lg={7} xl={6}>
            <Paper style={{ padding: theme.spacing(2) }} variant='outlined'>
              <Grid container direction='row'>
                <Grid item xs={10}>
                  <Typography variant='h4'>
                    {capitalize(primary_type.desc_cz)}, {secondary_type.desc_cz}
                  </Typography>
                  <Typography variant='h6' color='textSecondary'>
                    {street_address}, {city_address}, {postal_code}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <IconButton onClick={onEstateEditButton}>
                    <EditIcon />
                  </IconButton>
                </Grid>

                {!!images.length && <ImageCarousel images={images} registerResizeListenerTrigger={estateData} />}

                {!!description && (
                  <Grid item md={6}>
                    <Typography variant='h6'>Popis</Typography>
                    <Typography variant='body1' paragraph style={{ whiteSpace: "pre-line" }}>
                      {description}
                    </Typography>
                  </Grid>
                )}

                <Grid item md={6}>
                  <Typography variant='h6'>Parametry</Typography>
                  <List dense classes={{ root: classes.list }}>
                    {land_area && (
                      <ParameterListItem
                        icon={<MapIcon />}
                        value={`${formatNumber(land_area)} m2`}
                        parameter='Plocha pozemku'
                      />
                    )}
                    {usable_area && (
                      <ParameterListItem
                        icon={<HomeIcon />}
                        value={`${formatNumber(usable_area)} m2`}
                        parameter='Užitná plocha'
                      />
                    )}
                    {advert_price && (
                      <ParameterListItem
                        icon={<MoneyIcon />}
                        value={formatNumber(advert_price, {
                          style: "currency",
                          currency: "CZK",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                        parameter='Inzertní cena'
                      />
                    )}
                    {estimated_price && (
                      <ParameterListItem
                        icon={<BankIcon />}
                        value={formatNumber(estimated_price, {
                          style: "currency",
                          currency: "CZK",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                        parameter='Odhadní cena'
                      />
                    )}
                    <ParameterListItem
                      icon={<RoomIcon />}
                      value={`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}
                      parameter='Souřadnice'
                    />
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

const ParameterListItem: React.FunctionComponent<ParameterListItemProps> = ({ parameter, value, icon }) => {
  const classes = useStyles()

  return (
    <ListItem classes={{ root: classes.listItem }}>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={value} secondary={parameter} />
    </ListItem>
  )
}

export default EstatePage
