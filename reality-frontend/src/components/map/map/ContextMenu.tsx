import React, { FunctionComponent, useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss'
import { Popup, PopupProps } from 'react-map-gl'
import { MenuList, MenuItem } from '@material-ui/core'

import { copyToClipboard } from 'src/utils/utils';
import createEstateModalStore, { CreateEstateModalState } from 'src/store/create-estate-modal.store'
import snackStore, { SnackState } from 'src/store/snack.store'



export interface ContextMenuProps extends PopupProps {
  isVisible: boolean
  handleClose: () => void
}

const useStyles = createUseStyles({
  popup: {
    '& > .mapboxgl-popup-content': {
      padding: 0,
      cursor: 'default',
      borderRadius: 3,
      overflow: 'hidden',
    },
    '& > .mapboxgl-popup-tip': {
      cursor: 'default',
      borderWidth: '5px !important',
      borderBottomColor: 'transparent'
    }
  }
})

const ContextMenu: FunctionComponent<ContextMenuProps> = (props) => {
  const {
    isVisible,
    longitude,
    latitude,
    handleClose,
  } = props

  const classes = useStyles()

  const [createEstateModalState, setCreateEstateModalState] = useState<CreateEstateModalState>(createEstateModalStore.initialState)
  const [snackState, setSnackState] = useState<SnackState>(snackStore.initialState)

  useEffect(() => {
    const createEstateModalStoreSub = createEstateModalStore.subscribe(setCreateEstateModalState)
    const snackStoreSub = snackStore.subscribe(setSnackState)
    return () => { 
      createEstateModalStoreSub.unsubscribe()
      snackStoreSub.unsubscribe()
    }
  }, [])

  const shortFormatCoords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  const longFormatCoords = `${latitude.toFixed(8)}, ${longitude.toFixed(8)}`


  const onCreateEstate = () => {
    createEstateModalStore.updateFormValues({ coordinates: longFormatCoords })
    createEstateModalStore.open()
    handleClose()
  }

  const onCopyCoords = () => {
    copyToClipboard(longFormatCoords)
    snackStore.toggle('info', 'Souřadnice zkopírovány')
    handleClose()
  }

  return isVisible ? (
    <Popup
      className={classes.popup}
      latitude={latitude}
      longitude={longitude}
      anchor="top-left"
      closeButton={false}
      dynamicPosition={false}
    >
      <MenuList>
        <MenuItem id="coords" dense={true} onClick={onCopyCoords}>{shortFormatCoords}</MenuItem>
        <MenuItem dense={true} onClick={onCreateEstate}>Vytvořit nemovitost</MenuItem>
      </MenuList>
    </Popup>
  ) : null
};

ContextMenu.defaultProps = {
  longitude: 0,
  latitude: 0,
  isVisible: false
}

export default ContextMenu;
