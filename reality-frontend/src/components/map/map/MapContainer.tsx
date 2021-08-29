import React, { Dispatch, FunctionComponent, SetStateAction, useState } from "react"
import { createStyles, Fab, makeStyles, Theme, Tooltip } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import estateModalStore from "../../../store/estate-modal.store"
import CustomPopup, { CustomPopupProps } from "./CustomPopup"
import ContextMenu, { ContextMenuProps } from "./ContextMenu"
import RSMap from "./RSMap"
import { AppState } from "src/types"

type MapContainerProps = {
  setOnScreenEstates: Dispatch<SetStateAction<string[]>>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      height: "calc(100vh - 48px)",
      width: "100%"
    },
    fabRoot: {
      position: "fixed",
      bottom: theme.spacing(5),
      right: theme.spacing(4)
    }
  })
)

const MapContainer: FunctionComponent<MapContainerProps & AppState> = ({ setOnScreenEstates, appState }) => {
  const classes = useStyles()

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>(
    ContextMenu.defaultProps as ContextMenuProps
  )
  const [popupProps, setPopupProps] = useState<CustomPopupProps>(CustomPopup.defaultProps as CustomPopupProps)

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })

  // console.log('createEstateModalState', createEstateModalState)

  return (
    <div className={classes.mapContainer}>
      <RSMap
        contextMenuProps={contextMenuProps}
        popupProps={popupProps}
        setContextMenuProps={setContextMenuProps}
        setPopupProps={setPopupProps}
        setOnScreenEstates={setOnScreenEstates}
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
        <Fab color='primary' onClick={estateModalStore.openCreateMode} classes={{ root: classes.fabRoot }}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  )
}

export default MapContainer
