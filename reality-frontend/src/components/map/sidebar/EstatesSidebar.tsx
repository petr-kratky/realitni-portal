import React, { useMemo } from "react"
import { useFormik } from "formik"
import { fitBounds, Bounds } from "viewport-mercator-project"
import { usePlacesWidget } from "react-google-autocomplete"
import {
  Button,
  createStyles,
  Divider,
  makeStyles,
  Theme,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Chip,
  Tooltip
} from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import FilterIcon from "@material-ui/icons/FilterList"
import SearchIcon from "@material-ui/icons/Search"
import CloseIcon from "@material-ui/icons/Close"

import { AppState } from "src/types"
import SidebarEstateCard from "./SidebarEstateCard"
import { geocodeLocation } from "../../../lib/api/geocode"
import { filterDictionary, geojsonStore, snackStore, viewportStore } from "../../../lib/stores"

import FilterModal from "./FilterModal"
import { GeocodeResult } from "../../../types/geocode-result"

type EstatesSidebarProps = {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      "& > *": {
        margin: theme.spacing(0.5, 0)
      }
    },
    header: {
      display: "flex",
      width: "100%",
      alignItems: "center"
    },
    filterButton: {
      marginLeft: "auto",
      padding: theme.spacing(1, 3)
    },
    search: {
      marginRight: theme.spacing(1),
      overflow: "visible"
    },
    pagination: {
      width: "100%",
      display: "flex",
      justifyContent: "center"
    },
    divider: {
      marginTop: theme.spacing(1.5)
    },
    content: {
      flexGrow: 1
    },
    filterHeader: {
      marginBottom: theme.spacing(0.5, 0.5, -0.5)
    },
    filterContainer: {
      marginLeft: -theme.spacing(0.5)
    },
    filterChip: {
      margin: theme.spacing(1, 0.5, 0)
    }
  })
)

const EstatesSidebar: React.FunctionComponent<EstatesSidebarProps & AppState> = ({
  appState,
  appState: {
    geojson: {
      featureCollection: { features },
      filter
    },
    viewport
  }
}) => {
  const classes = useStyles()

  const formik = useFormik({
    initialValues: {
      search: ""
    },
    onSubmit: async values => {
      const address = await flyToLocation(values.search)
      formik.setFieldValue("search", address)
    }
  })

  const [filterModalOpen, setFilterModalOpen] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState<number>(1)

  const pageSize = 8
  const pageCount = Math.ceil(features.length ? features.length / pageSize : 1)
  const startIndex = currentPage * pageSize - pageSize
  const endIndex = currentPage * pageSize

  const estates = React.useMemo(
    () => features.map(ftr => ftr.properties.id).slice(startIndex, endIndex),
    [features, currentPage]
  )

  const { ref: searchRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: async place => {
      if (typeof place !== "undefined") {
        const address = place.formatted_address ?? place.name ?? ""
        await formik.setFieldValue("search", address)
        await formik.submitForm()
      }
    },
    language: "cs",
    options: {
      types: "(address)",
      componentRestrictions: { country: "cz" }
    }
  })

  React.useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [features])

  const onPageChange = (_event: any, page: number) => {
    setCurrentPage(page)
  }

  const openFilterModal = () => setFilterModalOpen(true)

  const closeFilterModal = () => setFilterModalOpen(false)

  const flyToLocation = async (address: string): Promise<string> => {
    if (address.length === 0) {
      return address
    }
    const { results, error_message } = await geocodeLocation({
      address
    })
    if (error_message) {
      snackStore.toggle("error", error_message)
      return address
    }
    if (!results.length) {
      snackStore.toggle("error", "Pro uvedenou adresu nebyly nalezeny žádné výsledky")
      return address
    }
    const {
      formatted_address,
      geometry: {
        viewport: { northeast: ne, southwest: sw }
      }
    } = results[0]
    const bounds: Bounds = [
      [ne.lng, ne.lat],
      [sw.lng, sw.lat]
    ]
    const { width, height } = viewport
    const fittedBounds = fitBounds({ bounds, width, height })
    viewportStore.setViewport({ ...viewport, ...fittedBounds }, true)
    return formatted_address
  }

  const removeFilter = (field: string) => () => {
    geojsonStore.removeFilter(field)
  }

  const filterEntries = Object.entries(filter).filter(entry => entry[1].length > 0 && entry[1] !== ",")

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <TextField
          id='search'
          fullWidth
          autoComplete='false'
          value={formik.values.search}
          className={classes.search}
          onChange={formik.handleChange}
          variant='outlined'
          size='small'
          placeholder='Vyhledat adresu...'
          inputRef={searchRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Tooltip title='Vyhledat'>
                  <div>
                    <IconButton
                      size='small'
                      edge='start'
                      disabled={!formik.values.search.length}
                      onClick={() => formik.submitForm()}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: !!formik.values.search.length && (
              <InputAdornment position='end'>
                <Tooltip title='Vymazat'>
                  <IconButton size='small' edge='start' onClick={() => formik.setFieldValue("search", "")}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }}
        />
        <Button className={classes.filterButton} startIcon={<FilterIcon />} onClick={openFilterModal}>
          Filtrovat
        </Button>
      </div>
      {!!filterEntries.length && (
        <span>
          <Typography variant='body2' color='textSecondary' className={classes.filterHeader}>
            Aktivní filtry ({filterEntries.length})
          </Typography>
          <div className={classes.filterContainer}>
            {filterEntries.map(([field]) => (
              <Chip
                key={field}
                size='small'
                label={filterDictionary[field]}
                className={classes.filterChip}
                onDelete={removeFilter(field)}
              />
            ))}
          </div>
        </span>
      )}
      <Divider className={classes.divider} />
      <div className={classes.content}>
        {estates.map(id => (
          <SidebarEstateCard key={id} id={id} appState={appState} />
        ))}
      </div>
      <Pagination
        className={classes.pagination}
        count={pageCount}
        page={currentPage}
        onChange={onPageChange}
        color='primary'
      />
      <FilterModal open={filterModalOpen} appState={appState} onClose={closeFilterModal} />
    </div>
  )
}

export default EstatesSidebar
