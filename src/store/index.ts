import {configureStore} from "@reduxjs/toolkit";
import TasksStoreSlice from "./tasks-store-slice";

export const store = configureStore({
   reducer: {
       tasksStoreSlice: TasksStoreSlice.reducer
   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
