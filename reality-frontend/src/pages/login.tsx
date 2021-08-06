import React, { useEffect } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Typography } from '@material-ui/core';

const Login: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/map')
  }, [])

  return (
    <Typography variant="h5">
      Already logged in. Redirecting..
    </Typography>
  )
};

export default Login;