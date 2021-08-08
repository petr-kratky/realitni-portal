import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { Popup, PopupProps } from 'react-map-gl'

import { EstateFeature } from '../../../types'
import PopupEstateCard from './PopupEstateCard'
import Button from '../../forms/Button'
import { Transition } from 'react-transition-group'
import useDebounce from '../../../lib/hooks/useDebounce'


export interface CustomPopupProps extends PopupProps {
  markerId: string
  longitude: number
  latitude: number
  isVisible: boolean
  features: Array<EstateFeature>
  handleClose?: () => void
}


const useStyles = createUseStyles({
  '@keyframes content': {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' }
  },
  '@keyframes tip': {
    '0%': { transform: 'translateX(15px) scale(0)' },
    '15%': { transform: 'translateX(15px) scale(0)' },
    '100%': { transform: 'translateX(0) scale(1)' }
  },
  popup: {
    '& > .mapboxgl-popup-content, & > .mapboxgl-popup-tip': {
      animationDuration: '300ms',
      animationTimingFunction: 'cubic-bezier(.16,1.32,.59,1.09)'
    },
    '& > .mapboxgl-popup-content': {
      animationName: '$content',
      padding: 0,
      overflowY: 'scroll',
      // maxHeight: 240,
      minHeight: 40,
      // width: 140,
      cursor: 'default',
      borderRadius: 15,
    }
    ,
    '& > .mapboxgl-popup-tip': {
      animationName: '$tip',
      margin: -1,
      cursor: 'default'
    }
  },
  contentContainer: {
    padding: [[8, 16]],
  },
  contentBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationInfo: {
    fontSize: 12,
    opacity: .7,
    fontWeight: 400
  },
  navButton: {
    borderRadius: '50%',
    minWidth: 30,
    maxWidth: 30,
    minHeight: 30,
    maxHeight: 30,
  },
  estateCardContainer: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 225,
    maxWidth: 225,
    minHeight: 82,
    padding: [8, 12]
  }
})

const CustomPopup: FunctionComponent<CustomPopupProps> = (props) => {
  const { isVisible, longitude, latitude, handleClose, features } = props

  const classes = useStyles()

  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => setActiveIndex(0), [features])

  const getActiveFeatureID = () =>
    features[activeIndex]?.properties?.id ?? features[0].properties.id

  const onRequestPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  const onRequestNext = () => {
    if (activeIndex < features.length - 1) {
      setActiveIndex(activeIndex + 1)
    }
  }

  return isVisible ? (
    <Popup
      className={`${classes.popup}`} latitude={latitude} longitude={longitude} closeButton={false}
      captureScroll={true} anchor="left" closeOnClick={false} dynamicPosition={false} onClose={handleClose}
    >
      <div className={classes.contentContainer}>
        <div className={classes.contentBody}>
          <Button
            onClick={onRequestPrevious} className={classes.navButton}
            disabled={activeIndex === 0}
          >
            {'<'}
          </Button>
          <div className={classes.estateCardContainer}>
          <PopupEstateCard id={getActiveFeatureID()} />
          </div>
          <Button
            onClick={onRequestNext} className={classes.navButton}
            disabled={activeIndex === features.length - 1}
          >
            {'>'}
          </Button>
        </div>
        <div className={classes.contentFooter}>
          <span className={classes.paginationInfo}>
            {`${activeIndex + 1}/${features.length}`}
          </span>
        </div>
      </div>
    </Popup>
  ) : null
};

CustomPopup.defaultProps = {
  markerId: '',
  longitude: 0,
  latitude: 0,
  isVisible: false,
  features: []
}

export default CustomPopup;
