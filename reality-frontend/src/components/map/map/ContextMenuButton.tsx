import React, { FunctionComponent } from 'react';
import { createUseStyles } from 'react-jss'

type TContextMenuButtonProps = {
  onClick?: () => void
}

const useStyles = createUseStyles({
  container: {
    padding: [6, 16],
    borderBottom: [1, 'solid', '#d1d1d1'],
    fontSize: 14,
    cursor: 'pointer',
    transition: ['background-color', '150ms', 'ease-in-out'],
    '&:hover': {
      transition: ['background-color', '150ms', 'ease-in-out'],
      backgroundColor: '#e8f0fe',
    }
  }

})

const ContextMenuButton: FunctionComponent<TContextMenuButtonProps> = ({ onClick, children }) => {
  const classes = useStyles()

  return (
    <div onClick={onClick} className={classes.container}>
      {children}
    </div>
  )
};

export default ContextMenuButton;
