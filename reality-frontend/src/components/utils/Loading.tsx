import React, { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss'


type LoadingProps = {
  style?: CSSProperties
  size?: number | string
  strokeWidth?: number
}


const useStyles = createUseStyles({
  '@keyframes rotate': {
    from: { transform: 'rotate(0)' },
    to: { transform: 'rotate(360deg)' }
  },
  loading: props => ({
    width: props.size,
    height: props.size,
    animation: '$rotate 800ms linear infinite',
    borderRadius: '50%',
    border: [props.strokeWidth, 'solid', '#209AE7'],
    borderTopColor: 'transparent'
  })
})

const Loading: React.FunctionComponent<LoadingProps> = ({ style, ...props }) => {
  const classes = useStyles(props)

  return (
    <div className={classes.loading} style={style} />
  )
};

Loading.defaultProps = {
  size: '100%',
  strokeWidth: 4
}

export default Loading;
