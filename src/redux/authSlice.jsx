import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    loadingAuth: true,
};
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuth(state,action){
            state.isAuthenticated = true;
            state.user = action.payload;
             state.loadingAuth = false;
        },
        clearAuth(state){
            state.isAuthenticated = false;
            state.user = null;
             state.loadingAuth = false;
        },
        setLoading(state,action){
            state.loadingAuth = action.payload;
        }
    }
})

export const {setAuth,clearAuth,setLoading,setTokenAuth} = authSlice.actions; 
export default authSlice.reducer;
