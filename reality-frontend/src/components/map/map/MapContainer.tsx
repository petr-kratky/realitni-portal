import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { createUseStyles } from 'react-jss'

import CustomPopup, { CustomPopupProps } from './CustomPopup'
import ContextMenu, { ContextMenuProps } from './ContextMenu'
import CreateEstateModal, { CreateEstateModalProps } from './CreateEstateModal';
import RSMap from './RSMap'

type TMapContainerProps = {
  setOnScreenEstates: Dispatch<SetStateAction<string[]>>,
}


const useStyles = makeStyles((theme: Theme) => createStyles({
  mapContainer: {
    height: '100vh',
    width: '100%'
  },
  fabRoot: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(4)
  }
}));


const MapContainer: FunctionComponent<TMapContainerProps> = (props) => {
  const { setOnScreenEstates } = props

  const classes = useStyles()

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>(ContextMenu.defaultProps as ContextMenuProps)
  const [popupProps, setPopupProps] = useState<CustomPopupProps>(CustomPopup.defaultProps as CustomPopupProps)
  const [createEstateModalProps, setCreateEstateModalProps] = useState<CreateEstateModalProps>(CreateEstateModal.defaultProps as CreateEstateModalProps)

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })

  const toggleCreateEstateModal = (isVisible: boolean): void => setCreateEstateModalProps({ ...createEstateModalProps, isVisible })

  return process.browser ? (
    <div className={classes.mapContainer}>
      <RSMap
        contextMenuProps={contextMenuProps}
        popupProps={popupProps}
        setContextMenuProps={setContextMenuProps}
        setPopupProps={setPopupProps}
        setOnScreenEstates={setOnScreenEstates}
      >
        {popupProps.features && <CustomPopup {...popupProps} handleClose={_handlePopupClose} />}
        {contextMenuProps.isVisible && <ContextMenu {...contextMenuProps} handleClose={_handleContextMenuClose} />}
      </RSMap>
      {createEstateModalProps.isVisible &&
        <CreateEstateModal {...createEstateModalProps} handleClose={() => toggleCreateEstateModal(false)} />
      }
      <Fab color="primary" onClick={() => toggleCreateEstateModal(true)} classes={{ root: classes.fabRoot }}>
        <AddIcon />
      </Fab>
    </div>
  ) : null
}

export default MapContainer
