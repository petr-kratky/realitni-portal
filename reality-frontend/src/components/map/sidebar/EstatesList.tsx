import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate'
import { createUseStyles } from 'react-jss'
import { Transition } from 'react-transition-group'

import EstateCard from './EstateCard'
import Loading from '../../utils/Loading'
import useDebounce from '../../../lib/hooks/useDebounce'


type TEstatesListProps = {
  estates: number[],
  estatesPerPage: number,
  setVisibilityDetail: React.Dispatch<React.SetStateAction<boolean>>,
  setFocusedEstate: React.Dispatch<React.SetStateAction<number | null>>,
  estateCardRender: any;
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


const EstatesList: FunctionComponent<TEstatesListProps> = (props) => {
  const { estates, estatesPerPage, estateCardRender } = props
  const classes = useStyles()

  const [pageCount, setPageCount] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const [displayedEstates, setDisplayedEstates] = useState<number[]>([])
  const [loadedEstates, setLoadedEstates] = useState<number>(0)
  const [estatesReady, setEstatesReady] = useState<boolean>(false)
  const [displayLoading, setDisplayLoading] = useState<boolean>(false)

  const debouncedOffset = useDebounce<number>(offset, 200)
  const debouncedLoadedEstates = useDebounce<number>(loadedEstates, 275)


  useEffect(() => {
    setPageCount(Math.ceil(estates.length / estatesPerPage))
    setOffset(0)
  }, [estates, estatesPerPage])


  useEffect(() => {
    setLoadedEstates(0)
    setDisplayedEstates(estates.slice(debouncedOffset, debouncedOffset + estatesPerPage))
  }, [debouncedOffset, offset])


  useEffect(() => {
    setLoadedEstates(0)
    setDisplayLoading(true)
    setTimeout(() => setDisplayedEstates(estates.slice(debouncedOffset, debouncedOffset + estatesPerPage)), 200)
  }, [estates])


  useEffect(() => {
    if (loadedEstates && loadedEstates >= displayedEstates.length) {
      setEstatesReady(true)
      setDisplayLoading(false)
    } else {
      setEstatesReady(false)
    }
  }, [loadedEstates])


  useEffect(() => {
    if (debouncedLoadedEstates < displayedEstates.length) {
      setDisplayLoading(true)
    }
  }, [debouncedLoadedEstates])


  const onPageChange = (selectedItem: { selected: number }) => {
    setOffset(selectedItem.selected * estatesPerPage)
  }

  const onChildDidLoad = () => {
    setLoadedEstates(loadedEstates + 1)
  }

  return (
    <div>
      <div style={{ minHeight: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 0' }}>
        <ReactPaginate
          marginPagesDisplayed={2}
          pageCount={pageCount}
          pageRangeDisplayed={4}
          onPageChange={onPageChange}
          initialPage={0}
          forcePage={debouncedOffset ? undefined : 0}
          previousLabel="Předchozí"
          nextLabel="Další"
          breakLabel="..."
          containerClassName={classes.container}
          activeClassName={classes.defaultPage}
          activeLinkClassName={classes.defaultLink}
          pageClassName={classes.inactivePage}
          pageLinkClassName={classes.inactiveLink}
          previousClassName={`${classes.control} ${classes.previous}`}
          previousLinkClassName={classes.controlLink}
          nextClassName={`${classes.control} ${classes.next}`}
          nextLinkClassName={classes.controlLink}
          disabledClassName={classes.disabled}
          breakClassName={classes.break}
          breakLinkClassName={classes.breakLink}
        />
      </div>
      <div className={classes.estateList}>
        {displayedEstates.map((id, index) =>
          <Transition key={id} in={estatesReady} timeout={{ enter: 0, exit: 250 }}>
            {state => {
              const transitionStyles: { [key: string]: CSSProperties } = {
                entering: {
                  opacity: 0,
                  transform: 'translateX(-200px)',
                  transitionDelay: `${index * 75}ms`,
                },
                entered: {
                  opacity: 1,
                  transform: 'translateX(0)',
                  transitionDelay: `${index * 75}ms`,
                },
                exiting: {
                  opacity: 0,
                  transitionDuration: '300ms',
                  transform: 'translateX(-100px)',
                },
                exited: {
                  opacity: 0,
                  transitionDuration: '300ms',
                  transform: 'translateX(-100px)',
                }
              };
              return estateCardRender(id, onChildDidLoad, transitionStyles[state])
            }}
          </Transition>
        )}
      </div>
      <div>
        <Transition in={displayLoading} timeout={{ enter: 0, exit: 400 }} unmountOnExit={true}>
          {state => {
            const transitionStyles: { [key: string]: CSSProperties } = {
              entering: { opacity: 0 },
              entered: { opacity: .9 },
              exiting: { opacity: 0 },
              exited: { opacity: 0 }
            }

            return (
              <Loading size={80} strokeWidth={6} style={{
                left: 'calc(50% - 40px)',
                top: 150,
                position: 'absolute',
                transitionDuration: '400ms',
                transitionProperty: 'opacity',
                transitionTimingFunction: 'ease',
                ...transitionStyles[state]
              }} />
            )
          }}
        </Transition>
      </div>
    </div>
  )
};

export default EstatesList;
