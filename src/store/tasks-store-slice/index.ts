import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import Tasks from "../../integration/tasks";
import {ThunkNameConstants} from "./thunk-name.constants";


const initialState = {
    tasks: <TaskDTO[]>[],
    task: <TaskDTO>{}
}

export const getAllTasks = createAsyncThunk(
    ThunkNameConstants.GET_ALL_TASKS,
    async () => {
        return await Tasks.getAllTasks();
    }
);

export const getTaskByID = createAsyncThunk(
    ThunkNameConstants.GET_TASK_BY_ID,
    async (id: string) => {
        return await Tasks.getTaskByID(id);
    }
);

export const saveTask = createAsyncThunk(
    ThunkNameConstants.SAVE_TASK,
    async (dto: TaskDTO, {dispatch}) => {
        await Tasks.saveTask(dto);
        dispatch(getAllTasks());
    }
);

export const removeTask = createAsyncThunk(
    ThunkNameConstants.REMOVE_TASK,
    async (id: string, {dispatch}) => {
        await Tasks.removeTask(id);
        dispatch(getAllTasks());
    }
);

function clearTask(state: { task: TaskDTO; }): void {
    state.task = <TaskDTO>{};
}

// @ts-ignore
function builderProcessor(builder): void {
    builder.addCase(getAllTasks.fulfilled, (state: { tasks: TaskDTO[]; }, action: { payload: TaskDTO[]; }) => {
        state.tasks = action.payload;
    });

    builder.addCase(getTaskByID.fulfilled, (state: { task: TaskDTO; }, action: { payload: TaskDTO; }) => {
        state.task = action.payload;
    });

    builder.addCase(removeTask.fulfilled, (state: { task: TaskDTO; }) => {
        state.task = <TaskDTO>{};
    });

    builder.addCase(saveTask.fulfilled, () => {
        return;
    });
}

export default createSlice({
    name: 'tasks-store-slice',
    initialState,
    reducers: {
        clearTask
    },
    extraReducers: builderProcessor
});
