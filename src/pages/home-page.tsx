import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import TasksStoreSlice, {
    getAllTasks,
    getTaskByID,
    toggleComplete,
    removeTask,
    saveTask
} from "../store/tasks-store-slice";
import {AppDispatch} from "../store";
import type {TaskDTO} from "../integration/tasks/core/dtos/task.dto";
import Eventbus from "../eventbus";
import {TaskEventConstants} from "../integration/tasks/core/constants/task-event.constants";
import {TitleComponent} from "../components/title-component/title.component";
import {ListComponent} from "../components/list-component/list.component";
import {TaskComponent} from "../components/task-component/task.component";

export function HomePage(): JSX.Element {
    const [initialLoad, setInitialLoad] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    // @ts-ignore
    const {tasks, task }: {tasks: TaskDTO[], task:TaskDTO} = useSelector(state => state.tasksStoreSlice);
    const {clearTask} = TasksStoreSlice.actions;

    useEffect(() => {

        if(initialLoad) {
            setInitialLoad(false);
            dispatch(getAllTasks());
            return;
        }

        Eventbus.on(TaskEventConstants.ADD_NEW, () => {
            dispatch(clearTask());
            setShowEditor(true);
        });

        Eventbus.on(TaskEventConstants.DISPLAY_DETAILS, async (id) => {
            dispatch(clearTask());
            await dispatch(getTaskByID(id as string));
            setShowEditor(true);
        });

        Eventbus.on(TaskEventConstants.TOGGLE_COMPLETE, async (id) => {
            await dispatch(toggleComplete(id as string));
            await dispatch(getTaskByID(id as string));
        });

        Eventbus.on(TaskEventConstants.REMOVE, async (id) => {
            setShowEditor(false);
            await dispatch(removeTask(id as string));
        });

        Eventbus.on(TaskEventConstants.SAVE, async (dto) => {
            setShowEditor(false);
            await dispatch(saveTask(dto as TaskDTO));
            dispatch(clearTask());
        });

        Eventbus.on(TaskEventConstants.CLOSE, () => {
            dispatch(clearTask());
            setShowEditor(false);
        });

    }, [initialLoad]);

    return (<div>
        <TitleComponent title={t('header.title').toString()}/>
        <ListComponent tasks={tasks} emitter={Eventbus}/>
        <TaskComponent show={showEditor} task={task} emitter={Eventbus}/>
    </div>);
}
