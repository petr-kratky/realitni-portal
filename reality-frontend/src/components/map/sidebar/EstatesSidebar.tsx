import React from "react"
import { useFormik } from "formik"
import { fitBounds, Bounds } from "viewport-mercator-project"
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService"
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
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Paper,
  ListItemIcon,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import FilterIcon from "@material-ui/icons/FilterList"
import SearchIcon from "@material-ui/icons/Search"
import CloseIcon from "@material-ui/icons/Close"
import LocationIcon from "@material-ui/icons/Room"

import { AppState } from "src/types"
import SidebarEstateCard from "./SidebarEstateCard"
import { geocodeLocation } from "../../../lib/api/geocode"
import { filterDictionary, geojsonStore, snackStore, viewportStore } from "../../../lib/stores"

import FilterModal from "./FilterModal"
import { ChevronRight } from "@material-ui/icons"

type EstatesSidebarProps = {
  toggle: () => void
}

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
    headerControls: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      marginTop: theme.spacing(1)
    },
    close: {
      marginLeft: "auto"
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
      position: "relative",
      marginRight: theme.spacing(1),
      width: "100%"
    },
    searchPredictions: {
      position: "absolute",
      top: 36,
      left: 0,
      width: "100%",
      zIndex: 1250
    },
    searchInput: {},
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
  toggle,
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
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down("xs"))
	const sm = useMediaQuery(theme.breakpoints.down("sm"))

  // --- PAGINATION --- //

  const [currentPage, setCurrentPage] = React.useState<number>(1)

  const pageSize = 8
  const pageCount = Math.ceil(features.length ? features.length / pageSize : 1)
  const startIndex = currentPage * pageSize - pageSize
  const endIndex = currentPage * pageSize

  const estates = React.useMemo(
    () => features.map(ftr => ftr.properties.id).slice(startIndex, endIndex).sort((a, b) => a > b ? -1 : 1),
    [features, currentPage]
  )

  React.useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [features])

  // --- LOCATION --- //

  const [predictionsVisible, setPredictionVisible] = React.useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      search: ""
    },
    onSubmit: async values => {
      const address = await flyToLocation(values.search)
      formik.setFieldValue("search", address)
    }
  })

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    debounce: 500,
    language: "cs",
    options: {
      componentRestrictions: { country: "cz" }
    }
  })

  React.useEffect(() => {
    getPlacePredictions({ input: formik.values.search })
  }, [formik.values.search])

  const onPredictionSelect = async (prediction: any) => {
    await formik.setFieldValue("search", prediction.description)
    setPredictionVisible(false)
    await flyToLocation(prediction.description)
  }

  const onPageChange = (_event: any, page: number) => {
    setCurrentPage(page)
  }

  const onInputFocus = (_event: any) => {
    setPredictionVisible(true)
  }

  const onInputBlur = (event: any) => {
    if (event.relatedTarget?.parentNode?.id !== "predictions-list") {
      setPredictionVisible(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (formik.values.search.length && event.key === "Enter") {
      formik.handleSubmit()
    }
  }

  const flyToLocation = async (address: string): Promise<string> => {
    if (address.length === 0) {
      return address
    }
		if (sm) {
			toggle()
		}
    const { results, error_message } = await geocodeLocation({
      address
    })
    if (error_message) {
      snackStore.toggle("error", error_message)
      return address
    }
    if (!results.length) {
      snackStore.toggle("error", "Pro uvedenou adresu nebyly nalezeny ????dn?? v??sledky")
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

  // --- FILTERS --- //

  const [filterModalOpen, setFilterModalOpen] = React.useState<boolean>(false)

  const openFilterModal = () => setFilterModalOpen(true)

  const closeFilterModal = () => setFilterModalOpen(false)

  const removeFilter = (field: string) => () => {
    geojsonStore.removeFilter(field)
  }

  const filterEntries = Object.entries(filter).filter(entry => entry[1].length > 0 && entry[1] !== ",")

  return (
    <div className={classes.container}>
      <div className={classes.headerControls}>
        <Typography variant='h5'>Vyhledat nemovitost</Typography>
        <Tooltip title='Zav????t'>
          <IconButton size='medium' className={classes.close} onClick={toggle}>
            <ChevronRight />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.header}>
        <div className={classes.search}>
          <TextField
            id='search'
            fullWidth
            autoComplete='false'
            value={formik.values.search}
            className={classes.searchInput}
            onChange={formik.handleChange}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onKeyDown={onKeyDown}
            variant='outlined'
            size='small'
            placeholder='Vyhledat adresu...'
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
                  {isPlacePredictionsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Tooltip title='Vymazat'>
                      <IconButton size='small' edge='start' onClick={() => formik.setFieldValue("search", "")}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </InputAdornment>
              )
            }}
          />
          {predictionsVisible && (
            <List className={classes.searchPredictions}>
              <Paper id='predictions-list'>
                {placePredictions.map((prediction, index, arr) => (
                  <ListItem
                    key={prediction.reference}
                    dense
                    button
                    divider={index !== arr.length - 1}
                    onClick={() => onPredictionSelect(prediction)}
                  >
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={prediction.structured_formatting.main_text}
                      secondary={prediction.structured_formatting.secondary_text}
                    />
                  </ListItem>
                ))}
              </Paper>
            </List>
          )}
        </div>
        {xs ? (
          <IconButton size='medium' onClick={openFilterModal}>
            <FilterIcon />
          </IconButton>
        ) : (
          <Button className={classes.filterButton} startIcon={<FilterIcon />} onClick={openFilterModal}>
            Filtrovat
          </Button>
        )}
      </div>
      {!!filterEntries.length && (
        <span>
          <Typography variant='body2' color='textSecondary' className={classes.filterHeader}>
            Aktivn?? filtry ({filterEntries.length})
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
