import React, { FunctionComponent } from 'react';
import { createUseStyles } from 'react-jss'

import { useEstateQuery } from '../../../graphql/queries/generated/graphql';
import { Typography } from '@material-ui/core';


type PopupEstateCardProps = {
  id: string
}

const useStyles = createUseStyles({
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    position: 'relative',
  }
})

const PopupEstateCard: FunctionComponent<PopupEstateCardProps> = ({ id }) => {
  const classes = useStyles()

  const { data, loading } = useEstateQuery({ variables: { id } })


  return data ? (
    <div className={classes.card} >
      <Typography variant="subtitle1">{data.estate?.name}</Typography>
      <Typography variant="body1">{data.estate?.id}</Typography>
    </div>
  ) : null
};

export default PopupEstateCard;
