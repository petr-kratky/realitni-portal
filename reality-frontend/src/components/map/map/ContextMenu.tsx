import React, { FunctionComponent } from 'react';
import { createUseStyles } from 'react-jss'
import { Popup, PopupProps } from 'react-map-gl'
import ContextMenuButton from './ContextMenuButton'


export interface ContextMenuProps extends PopupProps {
  isVisible: boolean
  handleClose?: () => void
}

const useStyles = createUseStyles({
  popup: {
    '& > .mapboxgl-popup-content': {
      padding: 0,
      cursor: 'default',
      borderRadius: 8,
      overflow: 'hidden',
    },
    '& > .mapboxgl-popup-tip': {
      cursor: 'default',
      borderWidth: '0px !important'
    }
  },
  popupContent: {
    '& div:last-child': {
      borderBottom: 'none'
    }
  }
})

const ContextMenu: FunctionComponent<ContextMenuProps> = (props) => {
  const { isVisible, longitude, latitude, handleClose } = props

  const classes = useStyles()

  return isVisible ? (
    <Popup
      className={classes.popup}
      latitude={latitude}
      longitude={longitude}
      anchor="top-left"
      onClose={handleClose}
      closeButton={false}
      dynamicPosition={false}
    >
      <div className={classes.popupContent}>
        <ContextMenuButton>Vytvořit nemovitost</ContextMenuButton>
        <ContextMenuButton>Zobrazit kruh</ContextMenuButton>
        <ContextMenuButton>Vyhledat adresu</ContextMenuButton>
      </div>
    </Popup>
  ) : null
};

ContextMenu.defaultProps = {
  longitude: 0,
  latitude: 0,
  isVisible: false
}

export default ContextMenu;
