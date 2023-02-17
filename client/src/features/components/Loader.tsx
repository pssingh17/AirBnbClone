import React from 'react'
import { useState, CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
  display: "block",
  position:"absolute",
  top:"42%",
  margin: "auto",
  borderColor: "black",
  zIndex:9,
  
};

export const Loader = (loading:any) => {
  return (
    <>
    <PulseLoader
        color={"#eeeeee"}
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
        
      />
    </>
  )
}
