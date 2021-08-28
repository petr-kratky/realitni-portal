import React from "react"
import { useRouter } from "next/router"
import { setCookie } from "nookies"
import { createStyles } from "@material-ui/styles"
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
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

import { useCurrentUserQuery, useLogoutMutation } from "../graphql/queries/generated/graphql"

import LoginForm from "src/components/login/LoginForm"
import SnackBar from "src/components/utils/SnackBar"
import EstateModal from "./estate/CreateEstateModal"
import { setAccessToken } from "src/lib/auth/accessToken"
import estateModalStore from "../store/estate-modal.store"
import { AppState } from "../types"

type LayoutProps = {
  pageProps: any
  drawer: boolean
}

const DRAWER_WIDTH = 240

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
    drawerContainer: {
      overflow: "auto"
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: -DRAWER_WIDTH
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

  const { data: currentUserData, loading: currentUserLoading } = useCurrentUserQuery({ fetchPolicy: "network-only" })
  const [logout, { client }] = useLogoutMutation()

  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(drawer && !sm)

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

  const handleLogout = async () => {
    try {
      await logout()
      setAccessToken("")
      toggleDrawer()
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

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar variant='dense'>
          {currentUserData?.currentUser?.id && (
            <Tooltip title='Nabídka'>
              <IconButton edge='start' color='inherit' onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
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
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitIcon />
            </ListItemIcon>
            <ListItemText primary='Odhlásit' />
          </ListItem>
        </List>
      </Drawer>
      <main className={`${classes.content} ${isDrawerOpen && !sm ? classes.contentShift : ""}`}>
        <Toolbar variant='dense' />
        <EstateModal appState={appState} />
        {!currentUserLoading &&
          (currentUserData?.currentUser?.id ? children : <LoginForm {...pageProps} appState={appState} />)}
        <SnackBar />
      </main>
    </div>
  )
}

export default Layout
