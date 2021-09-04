import React, { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import { createStyles, Fab, makeStyles, Theme, Tooltip } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import { estateModalStore } from "src/lib/stores"
import CustomPopup, { CustomPopupProps } from "./CustomPopup"
import ContextMenu, { ContextMenuProps } from "./ContextMenu"
import RSMap from "./RSMap"
import { AppState } from "src/types"

type MapContainerProps = {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      height: "calc(100vh - 48px)",
      width: "100%",
      position: "relative"
    },
    fabRoot: {
      position: "absolute",
      bottom: theme.spacing(5),
      right: theme.spacing(4)
    }
  })
)

const MapContainer: FunctionComponent<MapContainerProps & AppState> = ({ appState }) => {
  const classes = useStyles()

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>(
    ContextMenu.defaultProps as ContextMenuProps
  )
  const [popupProps, setPopupProps] = useState<CustomPopupProps>(CustomPopup.defaultProps as CustomPopupProps)

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })

  return (
    <div className={classes.mapContainer}>
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
      <Tooltip title='Přidat nemovitost'>
        <Fab color='primary' onClick={() => estateModalStore.openCreateMode()} classes={{ root: classes.fabRoot }}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  )
}

export default MapContainer
