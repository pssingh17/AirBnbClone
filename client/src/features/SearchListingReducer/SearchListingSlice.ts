import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface ListingDataState {
  value:[]
}

const initialState: ListingDataState = {
  value: [],
}

export const SearchListingSlice = createSlice({
  name: 'SearchListingData',
  initialState,
  reducers: {
    
    searchListingData: (state, action: PayloadAction<[]>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  searchListingData } = SearchListingSlice.actions

export default SearchListingSlice.reducer