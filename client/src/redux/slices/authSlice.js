import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../helper/axiosInstance"

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') ? JSON.parse(localStorage.getItem('isLoggedIn')) : false,
    authId: localStorage.getItem('authId') ? JSON.parse(localStorage.getItem('authId')) : "",
    authData: [],
}

export const authRegister = createAsyncThunk("/register", async (data) => {
    try {
        const res = axiosInstance.post("/auth/register", data);
        return (await res).data;
    } catch (error) {
        console.log(error.message)
    }
})


export const authLogin = createAsyncThunk("/login", async (data) => {
    try {
        const res = axiosInstance.post("/auth/admin-login", data);
        return (await res).data;
    } catch (error) {
        console.log(error.message)
    }
})


export const getAuthProfile = createAsyncThunk("/get-profile", async (authid) => {
    console.log(authid)
    try {
        const res = axiosInstance.get(`/auth/profile/${authid}`);
        return (await res).data;
    } catch (error) {
        console.log(error.message)
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(authLogin.fulfilled, (state, action) => {
            console.log(action)
            state.isLoggedIn = localStorage.setItem("isLoggedIn", JSON.stringify(true)) || false;
            state.authId = localStorage.setItem("authId", JSON.stringify(action?.payload?.data?.user?._id)) || "";
        })
            .addCase(getAuthProfile.fulfilled, (state, action) => {
                console.log(action);
                state.authData = action?.payload?.data;
            })
    }
})

export default authSlice.reducer;