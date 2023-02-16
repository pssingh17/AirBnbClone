import React from 'react'
import { useState, CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

const override: CSSProperties = {
  display: "block",
  position:"absolute",
  top:"39vh",
  margin: "auto",
  borderColor: "black",
  zIndex:9
};

export const Loader = (loading:any) => {
  return (
    <>
    <RingLoader
        color={"silver"}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
        
      />
    </>
  )
}
