import React from "react"

import {
  Button,
  createStyles,
  Divider,
  makeStyles,
  Theme,
  TextField,
  InputAdornment,
  IconButton
} from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import FilterIcon from "@material-ui/icons/FilterList"
import SearchIcon from "@material-ui/icons/Search"

import { AppState } from "src/types"

import SidebarEstateCard from "./SidebarEstateCard"
import { useFormik } from "formik"
import { geocodeLocation } from "../../../lib/api/geocode"
import { snackStore, viewportStore } from "../../../lib/stores"
import { fitBounds, Bounds } from "viewport-mercator-project"

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
      alignItems: "center",
      marginBottom: theme.spacing(1.5)
    },
    filterButton: {
      marginLeft: "auto",
      padding: theme.spacing(1, 3)
    },
    search: {
      marginRight: theme.spacing(1)
    },
    searchIcon: {
      // opacity: 0.5
    },
    pagination: {
      width: "100%",
      display: "flex",
      justifyContent: "center"
    },
    content: {
      flexGrow: 1
    }
  })
)

const EstatesSidebar: React.FunctionComponent<EstatesSidebarProps & AppState> = ({
  appState,
  appState: {
    geojson: {
      featureCollection: { features }
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
      const geocodeResults = await geocodeLocation({
        address: values.search
      })
      if (!geocodeResults.results.length) {
        snackStore.toggle("error", "Pro uvedenou adresu nebyly nalezeny žádné výsledky")
        return
      }
      const {
        formatted_address,
        geometry: {
          viewport: { northeast: ne, southwest: sw }
        }
      } = geocodeResults.results[0]
      const bounds: Bounds = [
        [ne.lng, ne.lat],
        [sw.lng, sw.lat]
      ]
      const { width, height } = viewport
      const fittedBounds = fitBounds({ bounds, width, height })
      viewportStore.setViewport({ ...viewport, ...fittedBounds }, true)
      formik.setFieldValue("search", formatted_address)
    }
  })

  const [currentPage, setCurrentPage] = React.useState<number>(1)

  const pageSize = 8
  const pageCount = Math.ceil(features.length ? features.length / pageSize : 1)
  const startIndex = currentPage * pageSize - pageSize
  const endIndex = currentPage * pageSize

  const estates = React.useMemo(
    () => features.map(ftr => ftr.properties.id).slice(startIndex, endIndex),
    [features, currentPage]
  )

  React.useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount)
    }
  }, [features])

  const onPageChange = (_event: any, page: number) => {
    setCurrentPage(page)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (formik.values.search.length && event.key === "Enter") {
      formik.handleSubmit()
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <TextField
          id='search'
          fullWidth
          autoComplete='false'
          value={formik.values.search}
          className={classes.search}
          onKeyDown={onKeyDown}
          onChange={formik.handleChange}
          variant='outlined'
          size='small'
          placeholder='Vyhledat adresu...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton size='small' edge='start' disabled={!formik.values.search.length}>
                  <SearchIcon className={classes.searchIcon} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button className={classes.filterButton} startIcon={<FilterIcon />}>
          Filtrovat
        </Button>
      </div>
      <Divider />
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
    </div>
  )
}

export default EstatesSidebar
