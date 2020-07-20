import React from 'react';
import { NextPage } from 'next'
import { useByeQuery } from "src/graphql/queries/generated/graphql";

const Authtest: NextPage = () => {
  const { data, loading, error } = useByeQuery();

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>err</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return <div>{data.bye}</div>;
};

export default Authtest;