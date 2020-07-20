import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks'
import { createUseStyles } from 'react-jss'

import estateQuery, { EstateData, EstateVars } from '../../../graphql/queries/estate/estateById'
import { DecodedEstate } from '../../../types'
import { decodeEstateObject } from '../../../lib/data/codebook'


type PopupEstateCardProps = {
  id: number,
  style: CSSProperties
  onLoad: () => void
}

const useStyles = createUseStyles({
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    position: 'relative',
  },
  thumbnail: {
    minHeight: 0,
    minWidth: 0,
    maxHeight: 0,
    maxWidth: 0,
    objectFit: 'cover',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: ['center', 'center'],
    borderRadius: '5%'
  },
  advertFunction: {
    fontSize: 16,
    fontWeight: 600
  },
  advertType: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  advertPrice: {
    fontSize: 14
  }
})

const PopupEstateCard: FunctionComponent<PopupEstateCardProps> = ({ id, style, onLoad }) => {
  const { data, loading } = useQuery<EstateData, EstateVars>(estateQuery, { variables: { id } })

  const [estate, setEstate] = useState<DecodedEstate | null>(null)

  useEffect(() => {
    if (data) {
      const decodedEstate: DecodedEstate = decodeEstateObject(data.estate)
      setEstate(decodedEstate)
    }
  }, [data])

  const getImageSrc = (estate: DecodedEstate) =>
    estate.s3Images[0] ?? `/images/sidebar/thumbnail-fallback.png?id=${id}`

  const classes = useStyles()

  return estate && !loading ? (
    <div className={classes.card} style={style}>
      <img onLoad={onLoad} className={classes.thumbnail} src={getImageSrc(estate)} />
      <div className={classes.advertFunction}>{estate.advertFunction}</div>
      <div className={classes.advertType}>
        <span>{estate.advertType}</span>
        {estate.advertType === 'Byty' && estate.advertSubtype && <span> | {estate.advertSubtype}</span>}
      </div>
      <div className={classes.address}>
        {estate.fullAddress.replace(/(^ulice )|(^, )|(okres )|(část obce )/g, '')}
      </div>
      <div className={classes.advertPrice}>
        <span>
          {estate.advertPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        </span>
        <span> Kč</span>
      </div>
    </div>
  ) : null
};

export default PopupEstateCard;
