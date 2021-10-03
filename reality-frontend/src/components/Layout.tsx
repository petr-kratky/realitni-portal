import React from "react"
import { useRouter } from "next/router"
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
  ListSubheader,
  makeStyles,
  Menu,
  NoSsr,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import {
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Home,
  History,
  ExitToApp,
  Menu as MenuIcon,
  Search,
  Add,
  Map
} from "@material-ui/icons"

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

type LayoutProps = {
  pageProps: any
}

const DRAWER_WIDTH = 280

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    title: {
      flexGrow: 1
    },
    nestedListItem: {
      paddingLeft: theme.spacing(4)
    },
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0
    },
    drawerPaper: {
      width: DRAWER_WIDTH
    },
    content: {
      flexGrow: 1
    }
  })
)

const Layout: React.FunctionComponent<AppState & LayoutProps> = ({ children, pageProps, appState }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true })

  const { data: currentUserData, refetch: refetchCurrentUser } = useCurrentUserQuery({
    fetchPolicy: "network-only"
  })
  const [logout, { client }] = useLogoutMutation()

  const isAuth = !!currentUserData?.currentUser?.id

  const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false)
  const [isRecentOpen, setRecentOpen] = React.useState<boolean>(true)
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null)
  const [recentsMenuAnchor, setRecentsMenuAnchor] = React.useState<null | HTMLElement>(null)

  const isProfileMenuOpen = Boolean(profileMenuAnchor)
  const isRecentsMenuOpen = Boolean(recentsMenuAnchor)

  const navigationOptions = [
    {
      text: "Vyhledat",
      icon: <Search />,
      onClick: () => {
        toggleDrawer()
        console.log("vyhledat")
      }
    },
    {
      text: "Mapa",
      icon: <Map />,
      onClick: () => {
        toggleDrawer()
        if (router.pathname !== "/map") router.push("/map")
      }
    },
    {
      text: "Přidat nemovitost",
      icon: <Add />,
      onClick: () => {
        toggleDrawer()
        estateModalStore.openCreateMode()
      }
    }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      setAccessToken("")
      await client!.resetStore()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleDrawer = () => {
    refetchCurrentUser()
    setDrawerOpen(!isDrawerOpen)
  }

  const toggleRecent = () => {
    refetchCurrentUser()
    setRecentOpen(!isRecentOpen)
  }

  const openProfileMenu = event => {
    setProfileMenuAnchor(event.currentTarget)
  }

  const closeProfileMenu = () => {
    setProfileMenuAnchor(null)
  }

  const openRecentsMenu = async event => {
    refetchCurrentUser()
    setRecentsMenuAnchor(event.currentTarget)
  }

  const closeRecentsMenu = () => {
    setRecentsMenuAnchor(null)
  }

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar variant='dense'>
          {isAuth && (
            <Tooltip title='Nabídka'>
              <IconButton edge='start' color='inherit' onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          <Typography variant='h6' className={classes.title}>
            Realitní portál
          </Typography>
          {isAuth && (
            <>
              <Tooltip title='Historie'>
                <IconButton onClick={openRecentsMenu} color='inherit'>
                  <History />
                </IconButton>
              </Tooltip>
              <Tooltip title='Uživatel'>
                <IconButton onClick={openProfileMenu} color='inherit' edge='end'>
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>
      {isAuth && (
        <Drawer
          anchor='left'
          variant='temporary'
          open={isDrawerOpen}
          onClose={toggleDrawer}
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
            <ListItem button onClick={toggleRecent}>
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText primary='Historie' />
              {isRecentOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <NoSsr>
              <Collapse in={isRecentOpen}>
                <List dense component='div' disablePadding>
                  {currentUserData.currentUser?.recent_estates
                    ?.map(estate => <RecentEstateCard key={estate.id} id={estate.id} />)
                    .reverse()}
                </List>
              </Collapse>
            </NoSsr>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary='Odhlásit' />
            </ListItem>
          </List>
        </Drawer>
      )}
      <main className={classes.content}>
        <Toolbar variant='dense' />
        <EstateModal appState={appState} />
        {isAuth ? children : <LoginForm {...pageProps} appState={appState} />}
        <SnackBar />
        {isAuth && (
          <>
            <ProfileMenu
              menuAnchor={profileMenuAnchor}
              open={isProfileMenuOpen}
              user={currentUserData?.currentUser?.username ?? "undefined"}
              onClose={closeProfileMenu}
              onLogout={handleLogout}
            />
            <RecentsMenu
              menuAnchor={recentsMenuAnchor}
              open={isRecentsMenuOpen}
              recents={currentUserData?.currentUser?.recent_estates?.map(({ id }) => id) ?? []}
              onClose={closeRecentsMenu}
            />
          </>
        )}
      </main>
    </div>
  )
}

const ProfileMenu: React.FunctionComponent<{
  open: boolean
  user: string
  menuAnchor: null | HTMLElement
  onClose: () => void
  onLogout: () => void
}> = ({ open, menuAnchor, user, onClose, onLogout }) => {
  React.useEffect(() => onClose, []) // Ensure the menu is closed if user logs in again
  return (
    <Menu
      anchorEl={menuAnchor}
      elevation={2}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: -58, horizontal: "left" }}
      MenuListProps={{ dense: true }}
    >
      <ListItem>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={<Typography variant='subtitle2'>{user}</Typography>} />
      </ListItem>
      <ListItem>
        <ListItemText primary={<Divider />} />
      </ListItem>
      <ListItem button onClick={onLogout}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary='Odhlásit' />
      </ListItem>
    </Menu>
  )
}

const RecentsMenu: React.FunctionComponent<{
  open: boolean
  recents: Array<string>
  menuAnchor: null | HTMLElement
  onClose: () => void
}> = ({ open, menuAnchor, recents, onClose }) => {
  React.useEffect(() => onClose, []) // Ensure the menu is closed if user logs in again
  return (
    <Menu
      anchorEl={menuAnchor}
      elevation={2}
      open={open}
      onClose={onClose}
      transformOrigin={{ vertical: -62, horizontal: "left" }}
      MenuListProps={{ dense: true }}
    >
      <ListSubheader>Poslední zobrazené</ListSubheader>
      {recents.map(id => <RecentEstateCard key={id} id={id} />).reverse()}
      {!recents.length && (
        <ListItem>
          <Typography variant='caption' color='textSecondary'>
            Dosud jste nezobrazil(a) žádnou nemovitost.
          </Typography>
        </ListItem>
      )}
    </Menu>
  )
}

const RecentEstateCard: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const classes = useStyles()

  const { data: estateData } = useEstateWithoutMediaQuery({ variables: { id } })

  const onClick = (id: string) => () => {
    window.open(`/estates/${id}`, "_blank")
  }

  if (estateData?.estate) {
    const { primary_type, secondary_type, street_address, city_address } = estateData.estate
    return (
      <ListItem button className={classes.nestedListItem} onClick={onClick(id)}>
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
