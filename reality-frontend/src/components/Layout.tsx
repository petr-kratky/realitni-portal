import React from "react"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { createStyles } from "@material-ui/styles"
import {
  AppBar,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  NoSsr,
  Theme,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"
import AddIcon from "@material-ui/icons/Add"
import ExitIcon from "@material-ui/icons/ExitToApp"
import MapIcon from "@material-ui/icons/Map"

import {
  useCurrentUserQuery,
  useEstateWithoutMediaQuery,
  useLogoutMutation
} from "../graphql/queries/generated/graphql"

import LoginForm from "src/components/login/LoginForm"
import SnackBar from "src/components/utils/SnackBar"
import EstateModal from "./estate/CreateEstateModal"
import { setAccessToken } from "src/lib/auth/accessToken"
import { estateModalStore } from "src/lib/stores"
import { AppState } from "../types"
import { AccessTime, ExpandLess, ExpandMore, Home } from "@material-ui/icons"

type LayoutProps = {
  pageProps: any
  drawer: boolean
}

const DRAWER_WIDTH = 260

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    },
    drawerPaper: {
      width: DRAWER_WIDTH
    },
    nestedListItem: {
      paddingLeft: theme.spacing(4)
    },
    content: {
      flexGrow: 1,
      [theme.breakpoints.up("md")]: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -DRAWER_WIDTH
      }
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }
  })
)

const Layout: React.FunctionComponent<AppState & LayoutProps> = ({ children, pageProps, appState, drawer }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true })

  const { data: currentUserData, loading: currentUserLoading } = useCurrentUserQuery({
    fetchPolicy: "network-only",
    pollInterval: 1000 * 5
  })
  const [logout, { client }] = useLogoutMutation()

  const isAuth = !!currentUserData?.currentUser?.id

  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(drawer && !sm)
  const [isRecentOpen, setRecentOpen] = React.useState<boolean>(true)

  React.useEffect(() => {
    setCookie(null, "drawer", `${isDrawerOpen}`)
  }, [isDrawerOpen])

  const navigationOptions = [
    {
      text: "Vyhledat",
      icon: <SearchIcon />,
      onClick: () => console.log("vyhledat")
    },
    {
      text: "Mapa",
      icon: <MapIcon />,
      onClick: () => {
        closeDrawer()
        if (router.pathname !== "/map") router.push("/map")
      }
    },
    {
      text: "Přidat nemovitost",
      icon: <AddIcon />,
      onClick: () => {
        closeDrawer()
        estateModalStore.openCreateMode()
      }
    }
  ]

  const onEstateClick = (id: string) => () => {
    window.open(`/estates/${id}`, "_blank")
  }

  const handleLogout = async () => {
    try {
      await logout()
      setAccessToken("")
      await client!.resetStore()
    } catch (err) {
      console.log(err)
    }
  }

  const closeDrawer = () => {
    if (sm) {
      setDrawerOpen(false)
    }
  }

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  const toggleRecent = () => {
    setRecentOpen(!isRecentOpen)
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar variant='dense'>
          {currentUserData?.currentUser?.id && (
            <Tooltip title='Nabídka' enterDelay={1250}>
              <IconButton edge='start' color='inherit' onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      {isAuth && (
        <Drawer
          anchor='left'
          variant={sm ? "temporary" : "persistent"}
          open={isDrawerOpen}
          onClose={toggleDrawer}
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
        >
          {!sm && <Toolbar variant='dense' />}
          <List>
            {navigationOptions.map(({ text, onClick, icon }) => (
              <ListItem button onClick={onClick} key={text}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={toggleRecent}>
              <ListItemIcon>
                <AccessTime />
              </ListItemIcon>
              <ListItemText primary='Historie' />
              {isRecentOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <NoSsr>
              <Collapse in={isRecentOpen}>
                <List component='div' disablePadding>
                  {currentUserData.currentUser?.recent_estates
                    ?.map(estate => <RecentEstateCard id={estate.id} onClick={onEstateClick} />)
                    .reverse()
                    .splice(0, 5)}
                </List>
              </Collapse>
            </NoSsr>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitIcon />
              </ListItemIcon>
              <ListItemText primary='Odhlásit' />
            </ListItem>
          </List>
        </Drawer>
      )}
      <main className={`${classes.content} ${isDrawerOpen && !sm ? classes.contentShift : ""}`}>
        <Toolbar variant='dense' />
        <EstateModal appState={appState} />
        {isAuth ? children : <LoginForm {...pageProps} appState={appState} />}
        <SnackBar />
      </main>
    </div>
  )
}

const RecentEstateCard: React.FunctionComponent<{
  id: string
  onClick: (id: string) => () => void
}> = ({ id, onClick }) => {
  const classes = useStyles()
  const {
    data: estateData,
    loading: estateLoading,
    error: estateError
  } = useEstateWithoutMediaQuery({ variables: { id } })

  if (estateData?.estate) {
    const { primary_type, secondary_type, street_address, city_address } = estateData.estate
    return (
      <ListItem button key={id} className={classes.nestedListItem} onClick={onClick(id)}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText
          primary={`${primary_type.desc_cz}, ${secondary_type.desc_cz}`}
          secondary={`${street_address}, ${city_address}`}
          primaryTypographyProps={{ noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItem>
    )
  } else {
    return null
  }
}

export default Layout
