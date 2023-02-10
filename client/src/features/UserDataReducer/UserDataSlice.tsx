import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UserDataState {
  value:[]
}

const initialState: UserDataState = {
  value: [],
}

export const UserDataSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    
    userData: (state, action: PayloadAction<[]>) => {
      state.value = action.payload
    },
    removeUserData: (state, action: PayloadAction<[]>) => {
      state.value = []
    },
  },
})

// Action creators are generated for each case reducer function
export const {  userData,removeUserData } = UserDataSlice.actions

export default UserDataSlice.reducer