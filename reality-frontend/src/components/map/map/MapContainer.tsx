import React, { Dispatch, FunctionComponent, SetStateAction, useState, useEffect } from 'react';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import createEstateModalStore, { CreateEstateModalState } from '../../../store/create-estate-modal.store'
import CustomPopup, { CustomPopupProps } from './CustomPopup'
import ContextMenu, { ContextMenuProps } from './ContextMenu'
import CreateEstateModal from './CreateEstateModal';
import RSMap from './RSMap'

type TMapContainerProps = {
  setOnScreenEstates: Dispatch<SetStateAction<string[]>>,
}


const useStyles = makeStyles((theme: Theme) => createStyles({
  mapContainer: {
    height: 'calc(100vh - 48px)',
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

  const [_, setCreateEstateModalState] = useState<CreateEstateModalState>(createEstateModalStore.initialState)

  useEffect(() => {
    const subs = createEstateModalStore.subscribe(setCreateEstateModalState)
    return () => subs.unsubscribe()
  }, [])

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })

  // console.log('createEstateModalState', createEstateModalState)

  return process.browser ? (
    <div className={classes.mapContainer}>
      <RSMap
        contextMenuProps={contextMenuProps}
        popupProps={popupProps}
        setContextMenuProps={setContextMenuProps}
        setPopupProps={setPopupProps}
        setOnScreenEstates={setOnScreenEstates}
      >
        {popupProps.features &&
          <CustomPopup {...popupProps}
            handleClose={_handlePopupClose}
          />
        }
        {contextMenuProps.isVisible &&
          <ContextMenu
            {...contextMenuProps}
            handleClose={_handleContextMenuClose}
          />
        }
      </RSMap>
      <CreateEstateModal />
      <Fab
        color="primary"
        onClick={createEstateModalStore.open}
        classes={{ root: classes.fabRoot }}
      >
        <AddIcon />
      </Fab>
    </div>
  ) : null
}

export default MapContainer
