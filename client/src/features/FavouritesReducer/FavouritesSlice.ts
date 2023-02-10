import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface FavouritesState {
  value:[]
}

const initialState: FavouritesState = {
  value: [],
}

export const FavouritesSlice = createSlice({
  name: 'FavouritesData',
  initialState,
  reducers: {
    
   
    FavouritesData: (state, action: PayloadAction<[]>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  FavouritesData } = FavouritesSlice.actions

export default FavouritesSlice.reducer