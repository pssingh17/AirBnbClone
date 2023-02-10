import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface ListingDataState {
  value:[]
}

const initialState: ListingDataState = {
  value: [],
}

export const AllListingsSlice = createSlice({
  name: 'AllListingsData',
  initialState,
  reducers: {
    
    allListingsData: (state, action: PayloadAction<[]>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  allListingsData } = AllListingsSlice.actions

export default AllListingsSlice.reducer