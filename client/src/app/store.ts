import { configureStore } from '@reduxjs/toolkit'
import AllListingsSliceReducer from '../features/AllListingsReducer/AllListingsSlice'
import UserDataSliceReducer from '../features/UserDataReducer/UserDataSlice'
import SearchListingSliceReducer from '../features/SearchListingReducer/SearchListingSlice'
import ViewDetailsSliceReducer from '../features/ViewDetailsReducer/ViewDetailsSlice'
import FavouritesSliceReducer from '../features/FavouritesReducer/FavouritesSlice'

export const store = configureStore({
  reducer: {
    AllListingsSlice:AllListingsSliceReducer,
    UserDataSlice : UserDataSliceReducer,
    SearchListingSlice: SearchListingSliceReducer,
    ViewDetailsSlice : ViewDetailsSliceReducer,
    FavouritesSlice: FavouritesSliceReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch