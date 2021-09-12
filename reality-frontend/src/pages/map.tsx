import React from "react"
import { ParsedUrlQuery } from "querystring"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { makeStyles, useMediaQuery, useTheme, Drawer, Toolbar, createStyles, Theme } from "@material-ui/core"

import MapContainer from "../components/map/map/MapContainer"
import EstatesSidebar from "../components/map/sidebar/EstatesSidebar"
import { filterObject, isUndef, pushViewportToUrl } from "src/utils/utils"
import { viewportStore } from "src/lib/stores"
import { AppState } from "src/types"

type QueryViewport = {
  zoom?: number
  longitude?: number
  latitude?: number
}

interface MapPageProps {
  queryViewport: QueryViewport
}

const DRAWER_WIDTH = 600

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    },
    drawerPaper: {
      backgroundColor: theme.palette.grey[50],
      padding: theme.spacing(2),
      width: DRAWER_WIDTH
    },
    content: {
      flexGrow: 1,
      [theme.breakpoints.up("md")]: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        marginRight: -DRAWER_WIDTH
      }
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginRight: 0
    }
  })
)

const MapPage: NextPage<MapPageProps & AppState> = ({ appState }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.down("sm"))

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true)

  React.useEffect(() => {
    const initViewport = { ...appState.viewport, ...getQueryViewport(router.query) }
    viewportStore.setViewport(initViewport)
    pushViewportToUrl(router, initViewport)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className={classes.root}>
      <Head>
        <title>Realitní Portál | Mapa</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <div className={`${classes.content} ${sidebarOpen ? classes.contentShift : ""}`}>
        <MapContainer appState={appState} />
      </div>
      <Drawer
        anchor='right'
        variant='persistent'
        open={sidebarOpen}
        onClose={toggleSidebar}
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar variant='dense' />
        <EstatesSidebar appState={appState} />
      </Drawer>
    </div>
  )
}

function getQueryViewport(query: ParsedUrlQuery): QueryViewport {
  const { latitude: qLatitude, longitude: qLongitude, zoom: qZoom } = query

  const [latitude, longitude, zoom]: Array<number | undefined> = [qLatitude, qLongitude, qZoom]
    .map(value => (isUndef(value) ? NaN : Number(value)))
    .map(value => (isNaN(value) ? undefined : value))

  const viewport: QueryViewport = { longitude, latitude, zoom }
  const filteredViewport = filterObject<QueryViewport, number | undefined>(viewport, value => !isUndef(value))

  return filteredViewport
}

export default MapPage
