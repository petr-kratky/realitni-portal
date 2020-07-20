import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { createUseStyles } from 'react-jss'

import CustomPopup, { CustomPopupProps } from './CustomPopup'
import ContextMenu, { ContextMenuProps } from './ContextMenu'
import RSMap from './RSMap'

type TMapContainerProps = {
  setOnScreenEstates: Dispatch<SetStateAction<number[]>>,
}


const useStyles = createUseStyles({
  mapContainer: {
    height: '100vh',
    width: '100%'
  }
})


const MapContainer: FunctionComponent<TMapContainerProps> = (props) => {
  const { setOnScreenEstates } = props

  const classes = useStyles()

  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>(ContextMenu.defaultProps as ContextMenuProps)
  const [popupProps, setPopupProps] = useState<CustomPopupProps>(CustomPopup.defaultProps as CustomPopupProps)

  const _handleContextMenuClose = (): void => setContextMenuProps({ ...contextMenuProps, isVisible: false })

  const _handlePopupClose = (): void => setPopupProps({ ...popupProps, isVisible: false })


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
    </div>
  ) : null
}

export default MapContainer
