import React, { FunctionComponent } from 'react';
import { createUseStyles } from 'react-jss'

import EstateCard from './EstateCard'


type TEstatesListProps = {
  estates: string[]
}


const useStyles = createUseStyles({
  estateList: {
    width: '100%',
    padding: [16, 0],
    '& > div:first-child': {
      marginTop: 0,
      marginBottom: 8
    },
    '& > div': {
      marginTop: 8,
      marginBottom: 8
    },
    '& > div:last-child': {
      marginTop: 8,
      marginBottom: 0
    }
  },
  container: {
    width: '100%',
    display: 'flex',
    listStyle: 'none',
    margin: 10,
    padding: 0,
    justifyContent: 'center',
    position: 'relative',
    '& a': {
      outline: 'none',
      userSelect: 'none',
      cursor: 'pointer'
    },
  },
  defaultPage: {
    backgroundColor: ['#d1d1d188', '!important'],
    color: ['#fff', '!important'],
    transition: 'color 300ms, background-color 300ms !important',
    padding: [2, 4],
    margin: [0, 4]
  },
  defaultLink: {

  },
  inactivePage: {
    padding: [2, 4],
    margin: [0, 4],
    backgroundColor: '#d1d1d100',
    transition: 'background-color 300ms',
    '&:hover': { backgroundColor: '#d1d1d188' }
  },
  inactiveLink: {},
  next: {
    marginLeft: 'auto'
  },
  previous: {
    marginRight: 'auto'
  },
  control: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
  },
  controlLink: {
    display: 'block'
  },
  disabled: {
    opacity: .5,
    transition: 'opacity 300ms',
    '& > a': { cursor: 'default' }
  },
  break: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  breakLink: {
    lineHeight: 1.7
  },
})


const EstatesList: FunctionComponent<TEstatesListProps> = ({ estates }) => {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.estateList}>
        {estates.map((id) => (<EstateCard id={id} key={id} />))}
      </div>
    </div>
  )
};

export default EstatesList;
