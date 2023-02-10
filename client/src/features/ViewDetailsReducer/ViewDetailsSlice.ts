import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface ViewDetailsState {
  value:any
}

const initialState: ViewDetailsState = {
  value: null,
}

export const ViewDetailsSlice = createSlice({
  name: 'ViewDetailsData',
  initialState,
  reducers: {
    
    viewDetailsData: (state, action: PayloadAction<[]>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  viewDetailsData } = ViewDetailsSlice.actions

export default ViewDetailsSlice.reducer