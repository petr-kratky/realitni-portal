import React, { FunctionComponent, useState } from 'react';
import { createUseStyles } from 'react-jss'
import { animated, useSpring } from 'react-spring'
import InputWrapper, { IInputWrapperProps } from './InputWrapper'

export type TSelectValue = string | number

export type TSelectOption = {
  value: TSelectValue
  label: string
}

export interface ISelectInputProps extends IInputWrapperProps {
  value: TSelectValue
  options: TSelectOption[]
  setFieldValue: (field: string, value: TSelectValue, shouldValidate?: boolean) => void
  setFieldTouched: (field: string, touched?: boolean) => void
  disabled?: boolean
  placeholder?: string
}

const useStyles = createUseStyles({
  selectContainer: {
    position: 'relative',
  },
  selectError: {
    borderColor: '#ff0000 !important'
  },
  selectField: {
    border: [1, 'solid', '#b4b4b4'],
    borderRadius: 5,
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    padding: 10,
    boxSizing: 'border-box',
    fontFamily: ['Open Sans', 'sans-serif'],
    margin: 0,
    fontSize: 16,
    transition: 'border-color 200ms, color 200ms',
    color: '#414141',
    '&:hover': {
      borderColor: '#7d7d7d',
      color: '#2d2d2d'
    },
    '&:hover #select-arrow': {
      color: '#9b9b9b'
    },
    '&:focus': {
      borderColor: '#209AE7',
      color: '#000000'
    },
    '&:focus #select-arrow': {
      color: '#209AE7'
    },
    '&.disabled, &:focus.disabled, &:hover.disabled': {
      userSelect: 'none',
      borderColor: '#afafaf',
      borderStyle: 'dashed',
      color: '#afafaf',
      cursor: 'default',
      '& #select-arrow': {
        color: '#c8c8c8'
      },
    }
  },
  selectArrow: {
    fontSize: 16,
    transform: 'scale(1, 0.8)',
    transition: 'color 200ms, transform 200ms',
    color: '#c8c8c8',
    '&.error': {
      color: 'rgba(255,0,0,0.8)' + '!important'
    },
    '&.open': {
      transform: 'scale(-1, -0.8)'
    },
  },
  displayValue: {
    flex: 1,
    fontSize: 16,
    '& > span.placeholder': {
      color: 'grey',
      transform: 'skew(-8deg)',
      display: 'block',
    },
    '&.disabled': {
      '& > span.placeholder': {
        color: '#a0a0a0',
      },
    }
  },
  optionContainer: {
    background: '#fff',
    border: [1, 'solid', '#b4b4b4'],
    borderRadius: 5,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 3,
    '& div:first-child': {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    },
    '& div:last-child': {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    },
  },
  option: {
    cursor: 'pointer',
    padding: 10,
    transition: 'background 200ms',
    '&:hover': {
      background: '#ebebeb'
    },
    '&.selected': {
      background: '#d7d7d7'
    },
    '& > span.nullOption': {
      transform: 'skew(-8deg)',
      display: 'block'
    }
  },
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2
  }
})

const SelectInput: FunctionComponent<ISelectInputProps> = ({ setFieldValue, setFieldTouched, id, value, options, placeholder, error, touched, label, classes, disabled }) => {
  const st = useStyles()

  const [open, setOpen] = useState<boolean>(false)

  const optionsSpring = useSpring({
    transformOrigin: 'top',
    transform: open ? 'translateY(0px)' : 'translateY(-20px)',
    // transform: open ? 'scaleY(1)' : 'scaleY(0.8)',
    opacity: open ? 1 : 0,
    config: { tension: 520, friction: 34, velocity: 12, precision: 0.05 }
  })

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setFieldTouched(id, true)
    setOpen(false)
  }

  const handleClick = (clickedValue: TSelectValue) => () => {
    setFieldValue(id, clickedValue, false)
    handleClose()
  }

  const renderDisplayValue = () => {
    const selectedOption = options.find(option => option.value === value)
    const displayValue = selectedOption ? selectedOption.label : placeholder ?? 'Zvolte hodnotu'
    return (
      <span className={!selectedOption || selectedOption.value === '' ? 'placeholder' : ''}>
        {displayValue}
      </span>
    )
  }

  const renderOptions = () => options.map(option =>
    <div key={option.value} onClick={handleClick(option.value)}
         className={`${st.option} ${option.value === value ? 'selected' : ''}`}
    >
      <span className={`${option.value === '' ? 'nullOption' : ''}`}>{option.label}</span>
    </div>
  )

  const inputWrapperProps: IInputWrapperProps = { label, id, classes, error, touched }

  return (
    <InputWrapper {...inputWrapperProps} >
      <div className={st.selectContainer}>
        <div className={`${st.selectField} ${error && touched ? st.selectError : ''} ${disabled ? 'disabled' : ''}`}
             onClick={open ? handleClose : handleOpen} tabIndex={-1}>
          <div className={`${st.displayValue} ${disabled ? 'disabled' : ''}`}>{renderDisplayValue()}</div>
          <div id="select-arrow"
               className={`${st.selectArrow} ${error && touched ? 'error' : ''} ${open ? 'open' : ''}`}>
            {disabled ? '▽' : '▼'}
          </div>
        </div>
        {open && <animated.div style={optionsSpring} className={st.optionContainer}>{renderOptions()}</animated.div>}
        {open && <div className={st.overlay} onClick={handleClose} />}
      </div>
    </InputWrapper>
  )
};

export default SelectInput;
