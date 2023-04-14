import { useTranslation } from 'react-i18next';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllTasks} from "../store/tasks-store-slice";
import {AppDispatch} from "../store";
export function HomePage(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    // @ts-ignore
    const {tasks, task } = useSelector(state => state.tasksStoreSlice);

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
