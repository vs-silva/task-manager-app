import { useTranslation } from 'react-i18next';
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getAllTasks} from "../store/tasks-store-slice";
import {AppDispatch} from "../store";
export function HomePage(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getAllTasks());
    }, []);


    return (<div>
        <p>{t('hello_world')}</p>
        <p>{t('inner.msg')}</p>
    </div>);
}
