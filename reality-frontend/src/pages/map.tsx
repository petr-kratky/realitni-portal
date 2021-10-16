import React from "react"
import { NextPage } from "next"
import Head from "next/head"
import { makeStyles, useMediaQuery, useTheme, Drawer, Toolbar, createStyles, Theme, NoSsr } from "@material-ui/core"

import MapContainer from "../components/map/map/MapContainer"
import EstatesSidebar from "../components/map/sidebar/EstatesSidebar"
import { AppState } from "src/types"

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
      padding: theme.spacing(0, 2, 2),
      width: DRAWER_WIDTH,
      [theme.breakpoints.down("sm")]: {
        width: "600px"
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%"
      }
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

const MapPage: NextPage<AppState> = ({ appState }) => {
  const classes = useStyles()
  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true })

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!sm) {
      setSidebarOpen(true)
    }
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <>
      <Head>
        <title>Mapa | Realitní Portál</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.13.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <div className={classes.root}>
        <div className={`${classes.content} ${sidebarOpen ? classes.contentShift : ""}`}>
          <MapContainer appState={appState} toggleSidebar={toggleSidebar} />
        </div>
        <NoSsr>
          <Drawer
            anchor='right'
            variant={sm ? "temporary" : "persistent"}
            open={sidebarOpen}
            onClose={toggleSidebar}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
          >
            {!sm && <Toolbar variant='dense' />}
            <EstatesSidebar toggle={toggleSidebar} appState={appState} />
          </Drawer>
        </NoSsr>
      </div>
    </>
  )
}

export default MapPage
