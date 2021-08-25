import React, { useState } from "react"
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
  Toolbar
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"
import AddIcon from "@material-ui/icons/Add"
import ExitIcon from "@material-ui/icons/ExitToApp"

import { useCurrentUserQuery, useLogoutMutation } from "../graphql/queries/generated/graphql"

import LoginForm from "src/components/login/LoginForm"
import SnackBar from "src/components/utils/SnackBar"
import { setAccessToken } from "src/lib/auth/accessToken"

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
      flexGrow: 1
      // transition: theme.transitions.create('margin', {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      // marginLeft: -drawerWidth,
    },
    contentShift: {
      // transition: theme.transitions.create('margin', {
      //   easing: theme.transitions.easing.easeOut,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
      // marginLeft: 0,
    }
  })
)

function Layout({ children, pageProps }) {
  const classes = useStyles()

  const { data: currentUserData, loading: currentUserLoading } = useCurrentUserQuery({ fetchPolicy: "network-only" })
  const [logout, { client }] = useLogoutMutation()

  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false)

  const navigationOptions = [
    {
      text: "Vyhledat",
      icon: <SearchIcon />,
      onClick: () => console.log("vyhledat")
    },
    {
      text: "Přidat nemovitost",
      icon: <AddIcon />,
      onClick: () => console.log("vytvořit nemovitost")
    }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      setAccessToken("")
      setDrawerOpen(false)
      await client!.resetStore()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar variant='dense'>
          {currentUserData?.currentUser?.id && (
            <IconButton edge='start' color='inherit' onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor='left'
        variant='temporary'
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
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
      <main className={`${classes.content} ${isDrawerOpen ? classes.contentShift : ""}`}>
        <Toolbar variant='dense' />
        {!currentUserLoading && (currentUserData?.currentUser?.id ? children : <LoginForm {...pageProps} />)}
        <SnackBar />
      </main>
    </div>
  )
}

export default Layout