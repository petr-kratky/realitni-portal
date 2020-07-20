import React from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import LoginForm from '../components/forms/LoginForm'

const Login: NextPage = () => {
  const router = useRouter()

  // return data ? (
  //   <>
  //   </>
  // ) : null
  return <>
    <LoginForm/>
  </>
};

export default Login;