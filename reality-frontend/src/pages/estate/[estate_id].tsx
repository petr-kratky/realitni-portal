import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import estateById, {
  EstateData,
  EstateVars,
} from "../../graphql/queries/estate/estateById";
import ItemsCarousel from "react-items-carousel";
import Detail from "src/components/estate/Detail";

const Estate: NextPage = () => {
  // const router = useRouter()
  // let { estate_id } = router.query
  // if(!estate_id) return (<><h1>Estate doesn't exist</h1></>)
  // const { data, loading } = useQuery<EstateData, EstateVars>(estateById, { variables: { id: +estate_id } })

  // return data ? (
  //   <>
  //     <h1>Estate ID: {estate_id}</h1>
  //     <h2 onClick={(estate_id) => router.push(`/estate/[estate_id]`, `/estate/${+estate_id + 1}`, { shallow: true })}
  //         style={{ cursor: 'pointer' }}>
  //       change url
  //     </h2>
  //     {data.estate.s3Images.map(url => <img src={url} width="400px" />)}
  //   </>
  // ) : null

  return (
    <>
      {/* <Detail estateId={5}/> */}
    </>
  );
};

export default Estate;
