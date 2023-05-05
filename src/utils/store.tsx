import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice'

const store = configureStore({
    reducer:{
        user:userSlice
    }
})
export type initialStore = typeof store
export default store