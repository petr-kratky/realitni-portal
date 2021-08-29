import React, { FunctionComponent } from "react"
import { Popup, PopupProps } from "react-map-gl"
import { MenuList, MenuItem, Tooltip, makeStyles } from "@material-ui/core"

import { copyToClipboard, geocodeLocation } from "src/utils/utils"
import estateModalStore from "src/store/estate-modal.store"
import snackStore from "src/store/snack.store"
import { ComponentType } from "src/types/geocode-result"
import { AppState } from "src/types"

export interface ContextMenuProps extends PopupProps {
  isVisible: boolean
  handleClose: () => void
}

const useStyles = makeStyles({
  popup: {
    "& > .mapboxgl-popup-content": {
      padding: 0,
      cursor: "default",
      borderRadius: 3,
      overflow: "hidden"
    },
    "& > .mapboxgl-popup-tip": {
      cursor: "default",
      borderWidth: "5px !important",
      borderBottomColor: "transparent"
    }
  }
})

const ContextMenu: FunctionComponent<ContextMenuProps & AppState> = ({
  isVisible,
  longitude,
  latitude,
  handleClose
}) => {
  const classes = useStyles()

  const getShortFormatCoords = () => `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  const getLongFormatCoords = () => `${latitude.toFixed(8)}, ${longitude.toFixed(8)}`

  const onCreateEstateButton = async () => {
    const longFormatCoords = getLongFormatCoords()
    const geocodeResults = await geocodeLocation(longFormatCoords, true)

    if (!geocodeResults?.results?.length) {
      snackStore.toggle("warning", "Pro zadanou polohu nebyla nalezena žádná adresa")
      estateModalStore.updateFormValues({ coordinates: getLongFormatCoords() })
    } else {
      const addressComponents = geocodeResults.results[0].address_components
      const postalCode = addressComponents.find(comp => comp.types.includes(ComponentType.PostalCode))?.long_name ?? ""
      const premise = addressComponents.find(comp => comp.types.includes(ComponentType.Premise))?.long_name
      const streetNumber = addressComponents.find(comp => comp.types.includes(ComponentType.StreetNumber))?.long_name
      const route = addressComponents.find(comp => comp.types.includes(ComponentType.Route))?.long_name
      const neighbourhood = addressComponents.find(comp => comp.types.includes(ComponentType.Neighborhood))?.long_name
      const locality = addressComponents.find(
        comp => comp.types.includes(ComponentType.Locality) || comp.types.includes(ComponentType.Sublocality)
      )?.long_name

      const streetAddress = `${route ?? locality ?? ""} ${
        premise && streetNumber ? `${premise}/${streetNumber}` : premise ?? streetNumber ?? ""
      }`.trim()

      const cityAddress = `${neighbourhood ?? ""}${neighbourhood && locality ? ", " : ""}${locality ?? ""}`

      estateModalStore.updateFormValues({
        coordinates: getLongFormatCoords(),
        street_address: streetAddress,
        city_address: cityAddress,
        postal_code: postalCode
      })
    }
    estateModalStore.openCreateMode()
    handleClose()
  }

  const onCopyCoords = () => {
    const longFormatCoords = getLongFormatCoords()
    copyToClipboard(longFormatCoords)
    snackStore.toggle("info", "Souřadnice zkopírovány")
    handleClose()
  }

  return isVisible ? (
    <>
      <Popup
        className={classes.popup}
        latitude={latitude}
        longitude={longitude}
        anchor='top-left'
        closeButton={false}
        dynamicPosition={false}
      >
        <MenuList>
          <Tooltip title='Zkopírovat souřadnice' placement='right'>
            <MenuItem id='coords' dense={true} onClick={onCopyCoords}>
              {getShortFormatCoords()}
            </MenuItem>
          </Tooltip>
          <MenuItem dense={true} onClick={onCreateEstateButton}>
            Vytvořit nemovitost
          </MenuItem>
        </MenuList>
      </Popup>
    </>
  ) : null
}

ContextMenu.defaultProps = {
  longitude: 0,
  latitude: 0,
  isVisible: false
}

export default ContextMenu
