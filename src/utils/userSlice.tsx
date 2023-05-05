import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:'user',
    initialState:{value:String},
    reducers:{
        insert:(state,action)=>{
            state.value=action.payload
        }
    }
})
export const {insert} = userSlice.actions
export default userSlice.reducer