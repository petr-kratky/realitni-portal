import React, { FunctionComponent, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'

type TButtonProps = {
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void | Promise<void> | undefined
  disabled?: boolean
  className?: string
}

const useStyles = createUseStyles({
  button: {
    minHeight: 48,
    width: '100%',
    backgroundColor: '#209AE7',
    cursor: 'pointer',
    transition: 'background-color 200ms, transform 200ms',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    '&:hover': {
      backgroundColor: '#1f8bd7',
    },
    '&:active': {
      transform: 'scale(0.98)',
      backgroundColor: '#1f6eb9',
    },
    '&.disabled': {
      transform: 'none' + '!important',
      backgroundColor: '#9b9b9b' + '!important',
      cursor: 'default',
    }
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    display: 'block',
    transition: 'color 200ms',
    userSelect: 'none',
    '&::first-letter': {
      textTransform: 'uppercase'
    }
  }

})

const Button: FunctionComponent<TButtonProps> = ({ disabled, onClick, children, className }) => {
  const classes = useStyles()

  const [clsDisabled, setClsDisabled] = useState<string>('')

  useEffect(() => setClsDisabled(disabled ? 'disabled' : ''), [disabled])

  const handleClick = () => disabled ? undefined : onClick?.()

  return (
    <div className={`${classes.button} ${clsDisabled} ${className ?? ''}`} onClick={handleClick}>
      <span className={`${classes.buttonText} ${clsDisabled}`}>{children}</span>
    </div>
  )
};

Button.defaultProps = {
  onClick: () => undefined,
  disabled: false
}

export default Button;
