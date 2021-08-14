import { ApolloProvider } from "@apollo/react-common";
import { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { createStyles, ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Tab, Tabs, Theme, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import ExitIcon from "@material-ui/icons/ExitToApp";

import { withApolloClient } from "../graphql/apollo-client/withApolloClient";
import { useCurrentUserQuery, useLogoutMutation } from "../graphql/queries/generated/graphql";
import { IAppRoot } from "../types";

import { theme } from '../lib/styles/mui-theme'
import LoginForm from "src/components/forms/LoginForm";
import SnackBar from "src/components/utils/SnackBar";
import { useRouter } from "next/router";

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
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
    },
  }),
);


function Layout({ children, pageProps }) {
  const classes = useStyles()
  const router = useRouter()

  const { data: currentUserData, loading: currentUserLoading } = useCurrentUserQuery({ fetchPolicy: "network-only" })
  const [logout] = useLogoutMutation()

  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false)

  const navigationOptions = [
    {
      text: "Vyhledat",
      icon: <SearchIcon />,
      onClick: () => console.log('vyhledat')
    },
    {
      text: "Přidat nemovitost",
      icon: <AddIcon />,
      onClick: () => console.log('vytvořit nemovitost')
    }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      router.reload()
      setDrawerOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          {currentUserData?.currentUser?.id &&
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          }
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="temporary"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        {/* <Toolbar variant="dense" /> */}
        <List>
          {navigationOptions.map(({ text, onClick, icon }) =>
            <ListItem button onClick={onClick} key={text} >
              <ListItemIcon >{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          )}
          <Divider />
          <ListItem button onClick={handleLogout} >
            <ListItemIcon ><ExitIcon /></ListItemIcon>
            <ListItemText primary="Odhlásit" />
          </ListItem>
        </List>
      </Drawer>
      <main className={`${classes.content} ${isDrawerOpen ? classes.contentShift : ''}`}>
        <Toolbar variant="dense" />
        {!currentUserLoading && (currentUserData?.currentUser?.id ? children : <LoginForm {...pageProps} />)}
        <SnackBar />
      </main>
    </div>
  );
}

// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
function Application({ Component, apolloClient, pageProps }: AppProps & IAppRoot) {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default withApolloClient(Application);
