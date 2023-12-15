import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl,login,register } from '../../utils/constants'
import axios from 'axios';

export const    UserLogin = createAsyncThunk(
    'user/login', async(payload)=>{
     const response = await axios.post(baseUrl+login, payload)
     console.log(response,"user login response")
     return response
    }
  )

export const UserRegister = createAsyncThunk(
   'user/register', async(payload)=>{
    const response = await axios.post(baseUrl+register, payload)
    console.log(response,"user register response")
    return response
}
)

const initialState = {
    loading: false,
    data: null,
    error: false,
  };


const UserAuthSlice = createSlice({
    name :'UserAuth',
    initialState,
    reducers :{
        logout(state){
            state.data = null;
        }

    },
    extraReducers: (builder) => {
        builder
          .addCase(UserLogin.pending, (state) => {
            console.log("Login pending", state);

            state.loading = true;

            state.error = false
          })
          .addCase(UserLogin.fulfilled, (state, action) => {
            console.log("Login fulfilled", state);

            state.loading = false
            state.data = action.payload?.data
          })
          .addCase(UserLogin.rejected, (state, action) => {
            console.log("Login rejected", state);

            state.loading = false
            state.error = true
          })
    }
})



export const { logout } = UserAuthSlice.actions; 

export default UserAuthSlice.reducer;
