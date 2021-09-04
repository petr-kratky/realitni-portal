import React, { ChangeEvent } from "react"

import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core"

import { AppState } from "src/types"
import { Pagination } from "@material-ui/lab"

type EstatesSidebarProps = {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sidebarContainer: {
      padding: theme.spacing(2)
    },
    pagination: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: theme.spacing(2)
    }
  })
)

const EstatesSidebar: React.FunctionComponent<EstatesSidebarProps & AppState> = ({
  appState: {
    geojson: {
      featureCollection: { features }
    }
  }
}) => {
  const classes = useStyles()

  const [currentPage, setCurrentPage] = React.useState<number>(1)

  const pageSize = 5
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

  return (
    <div className={classes.sidebarContainer}>
      <Pagination className={classes.pagination} count={pageCount} page={currentPage} onChange={onPageChange} />
      {estates.map(id => {
        return <div key={id}>{id}</div>
      })}
    </div>
  )
}

export default EstatesSidebar
