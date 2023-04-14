import { useTranslation } from 'react-i18next';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllTasks} from "../store/tasks-store-slice";
import {AppDispatch} from "../store";
import type {TaskDTO} from "../integration/tasks/core/dtos/task.dto";
export function HomePage(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    // @ts-ignore
    const {tasks, task }: {tasks: TaskDTO[], task:TaskDTO} = useSelector(state => state.tasksStoreSlice);

    useEffect(() => {
        dispatch(getAllTasks());
    }, []);


    return (<div>
        <p>{t('hello_world')}</p>
        {JSON.stringify(tasks)}
        <p>{t('inner.msg')}</p>
        {JSON.stringify(task)}

    </div>);
}
