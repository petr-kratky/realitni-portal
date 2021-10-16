import React, { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import { createStyles, Fab, makeStyles, NoSsr, Theme, Tooltip, useMediaQuery, useTheme } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import { estateModalStore } from "src/lib/stores"
import CustomPopup, { CustomPopupProps } from "./CustomPopup"
import ContextMenu, { ContextMenuProps } from "./ContextMenu"
import RSMap from "./MapComponent"
import { AppState } from "src/types"
import Search from "@material-ui/icons/Search"

type MapContainerProps = {
  toggleSidebar: () => void
}

const TOP_OFFSET = 2
const RIGHT_OFFSET = 2

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      height: "calc(100vh - 48px)",
      width: "100%",
      position: "relative"
    },
    searchFab: {
      position: "absolute",
      top: theme.spacing(TOP_OFFSET),
      right: theme.spacing(RIGHT_OFFSET)
    }
  })
)

const MapContainer: FunctionComponent<MapContainerProps & AppState> = ({ appState, toggleSidebar }) => {
  const classes = useStyles()
  const theme = useTheme()

  const sm = useMediaQuery(theme.breakpoints.down("sm"))

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>(
    ContextMenu.defaultProps as ContextMenuProps
  )
  const [popupProps, setPopupProps] = useState<CustomPopupProps>(CustomPopup.defaultProps as CustomPopupProps)

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })

  return (
    <div className={classes.mapContainer}>
      <NoSsr>
        <RSMap
          appState={appState}
          contextMenuProps={contextMenuProps}
          popupProps={popupProps}
          setContextMenuProps={setContextMenuProps}
          setPopupProps={setPopupProps}
        >
          {popupProps.features && (
            <CustomPopup
              {...popupProps}
              handleClose={_handlePopupClose}
              popupProps={popupProps}
              setPopupProps={setPopupProps}
            />
          )}
          {contextMenuProps.isVisible && (
            <ContextMenu {...contextMenuProps} appState={appState} handleClose={_handleContextMenuClose} />
          )}
        </RSMap>
      </NoSsr>
      <Tooltip title='Vyhledávání'>
        <Fab
          variant='extended'
          color='default'
          size={sm ? "medium" : "large"}
          onClick={toggleSidebar}
          classes={{ root: classes.searchFab }}
        >
          <Search />
        </Fab>
      </Tooltip>
    </div>
  )
}

export default MapContainer
