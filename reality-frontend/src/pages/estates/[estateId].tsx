import React from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import { useEstateQuery } from "src/graphql/queries/generated/graphql"

const Estate: NextPage = () => {
  const router = useRouter()
  const { estateId } = router.query

  const {
    data: estateData,
    loading: estateLoading,
    error: estateError
  } = useEstateQuery({ variables: { id: estateId as string } })

  if (estateLoading) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <CircularProgress color='primary' size={50} />
      </Grid>
    )
  } else if (estateError) {
    return (
      <Grid container justifyContent='center' alignItems='center'>
        <Typography variant='h4'>{estateError.message}</Typography>
      </Grid>
    )
  } else if (estateData?.estate) {
    const { id } = estateData.estate

    return (
      <Grid container>
        {estateData?.estate && (
          <Grid container item>
            {id}
          </Grid>
        )}
      </Grid>
    )
  } else {
    return null
  }
}

export default Estate
