import React, { FunctionComponent } from 'react'
import { createUseStyles } from 'react-jss'

export interface IInputWrapperClasses {
  container?: string
  label?: string
}

export interface IInputWrapperProps {
  id: string
  label: string
  error?: string
  touched?: boolean
  classes?: IInputWrapperClasses
}

const useStyles = createUseStyles({
  inputContainer: {},
  inputLabel: {
    display: 'inline-block',
    paddingBottom: 2,
    fontWeight: 600,
    color: '#828282'
  },
  errorMessage: {
    color: '#ff0000',
    fontSize: 12,
    paddingTop: 2
  },
})

const InputWrapper: FunctionComponent<IInputWrapperProps> = ({ children, label, id, classes, error, touched }) => {
  const styles = useStyles()

  return (
    <div className={`${styles.inputContainer} ${classes?.container ?? ''}`}>
      <label htmlFor={id} className={`${styles.inputLabel} ${classes?.label ?? ''}`}>
        {label}
      </label>
      {children}
      {error && touched && <div className={styles.errorMessage}>{error}</div>}
    </div>
  )
};

export default InputWrapper;
