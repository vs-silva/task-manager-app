import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import Tasks from "../../integration/tasks";


const initialState = {
    tasks: <TaskDTO[]>[],
    task: <TaskDTO>{}
}

export const getAllTasks = createAsyncThunk(
    'get-all-tasks',
    async () => {
        return await Tasks.getAllTasks();
    }
);

export const getTaskByID = createAsyncThunk(
    'get-task-by-id',
    async (id: string) => {
        return await Tasks.getTaskByID(id);
    }
);

export const saveTask = createAsyncThunk(
    'save-task',
    async (dto: TaskDTO, {dispatch}) => {
        await Tasks.saveTask(dto);
        dispatch(getAllTasks());
        return;
    }
);

export const removeTask = createAsyncThunk(
    'save-task',
    async (id: string, {dispatch}) => {
        await Tasks.removeTask(id);
        dispatch(getAllTasks());
        return;
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
