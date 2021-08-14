import React, { useEffect, useState } from 'react';
import { Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import snackStore, { SnackState } from '../../store/snack.store'


const SnackBar: React.FunctionComponent = () => {

  const [snackState, setSnackState] = useState<SnackState>(snackStore.initialState)

  useEffect(() => {
    const subs = snackStore.subscribe(setSnackState)
    return () => subs.unsubscribe()
  }, [])

  return (
    <Snackbar open={snackState.isOpen} autoHideDuration={4000} onClose={snackStore.handleClose}>
      <Alert variant="filled" severity={snackState.type} elevation={3} onClose={snackStore.handleClose}>
        {snackState.message}
      </Alert>
    </Snackbar>
  )
};

export default SnackBar;
