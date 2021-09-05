import React from "react"

import { createStyles, Divider, makeStyles, Theme, Typography } from "@material-ui/core"

import { AppState } from "src/types"
import { Pagination } from "@material-ui/lab"

import SidebarEstateCard from "./SidebarEstateCard"

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
    }
  }
}) => {
  const classes = useStyles()

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

  return (
    <div className={classes.container}>
      <Typography variant='subtitle1' color='textSecondary'>
        Nelezené nemovitosti ({features.length})
      </Typography>
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
