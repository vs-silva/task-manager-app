import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllTasks} from "../store/tasks-store-slice";
import {AppDispatch} from "../store";
import type {TaskDTO} from "../integration/tasks/core/dtos/task.dto";
import {ListComponent} from "../components/list-component/list.component";
import Eventbus from "../eventbus";
import {TaskEventConstants} from "../integration/tasks/core/constants/task-event.constants";
import {TitleComponent} from "../components/title-component/title.component";
export function HomePage(): JSX.Element {
    const [initialLoad, setInitialLoad] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    // @ts-ignore
    const {tasks, task }: {tasks: TaskDTO[], task:TaskDTO} = useSelector(state => state.tasksStoreSlice);

    useEffect(() => {
        if(initialLoad) {
            setInitialLoad(false);
            dispatch(getAllTasks());
            return;
        }

        Eventbus.on(TaskEventConstants.ADD_NEW, () => {
            console.log('lets add a new task');
        });

        Eventbus.on(TaskEventConstants.DISPLAY_DETAILS, (id) => {
            console.log('DISPLAY_DETAILS:::', id);
        });

        Eventbus.on(TaskEventConstants.TOGGLE_COMPLETE, (id) => {
            console.log('TOGGLE_COMPLETE:::', id);
        });

        Eventbus.on(TaskEventConstants.REMOVE, (id) => {
            console.log('REMOVE:::', id);
        });

    }, [initialLoad]);



    return (<div>
        {JSON.stringify(tasks)}

        <TitleComponent title={t('header.title').toString()}/>
        <ListComponent tasks={tasks} emitter={Eventbus}/>

    </div>);
}
