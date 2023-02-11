import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface LoaderState {
  value:Boolean
}

const initialState: LoaderState = {
  value: true,
}

export const LoaderSlice = createSlice({
  name: 'LoaderStatus',
  initialState,
  reducers: {
    
    LoaderStatus: (state, action: PayloadAction<Boolean>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  LoaderStatus } = LoaderSlice.actions

export default LoaderSlice.reducer