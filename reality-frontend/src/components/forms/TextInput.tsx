import React, { FunctionComponent } from 'react';
import { createUseStyles } from 'react-jss'
import InputWrapper, { IInputWrapperClasses, IInputWrapperProps } from './InputWrapper'

interface ITextInputClasses extends IInputWrapperClasses {
  input?: string
}

interface ITextInputProps extends IInputWrapperProps {
  placeholder?: string
  type?: string
  value?: string | number
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  classes?: ITextInputClasses
}

const useStyles = createUseStyles({
  input: {
    display: 'block',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    border: [1, 'solid', '#b4b4b4'],
    borderRadius: 5,
    fontFamily: ['Open Sans', 'sans-serif'],
    margin: 0,
    padding: [10, 10],
    fontSize: 16,
    transition: 'border-color 200ms, color 200ms',
    color: '#414141',
    '&:hover': {
      borderColor: '#7d7d7d',
      color: '#2d2d2d'
    },
    '&:focus': {
      borderColor: '#209AE7',
      color: '#000000'
    },
    '&::placeholder': {
      transform: 'skew(-8deg)'
    },
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      appearance: 'none',
      margin: 0
    }
  },
  inputError: {
    borderColor: '#ff0000 !important'
  },
})

const TextInput: FunctionComponent<ITextInputProps> = ({ placeholder, label, onChange, onBlur, classes, id, value, error, type, touched }) => {
  const styles = useStyles()

  const inputWrapperProps = { label, id, classes, error, touched }

  return (
    <InputWrapper {...inputWrapperProps}>
      <input
        id={id}
        value={value}
        type={type}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`
          ${styles.input}
          ${error && touched ? styles.inputError : ''}
          ${classes?.input ?? ''}
        `}
      />
    </InputWrapper>
  )
}

export default TextInput;
