import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import leadSlice from "./slices/leadSlice";
import leaveSlice from "./slices/leaveSlice";
import taskSlice from "./slices/taskSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        lead: leadSlice,
        leave: leaveSlice,
        task: taskSlice
    },
    devTools: true
});

export default store;