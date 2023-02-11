import React from 'react'
import { useState, CSSProperties } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
  display: "block",
  position:"absolute",
  top:"40%",
  margin: "auto",
  borderColor: "black",
};

export const Loader = (loading:any) => {
  return (
    <>
    <PulseLoader
        color={"silver"}
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  )
}
