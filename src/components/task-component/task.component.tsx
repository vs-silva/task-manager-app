import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import type {TaskEmitterService} from "../../integration/tasks/core/services/task-emitter.service";
import {MouseEvent, ChangeEvent, useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import {TaskPriorityConstants} from "../../integration/tasks/core/constants/task-priority.constants";
import {TaskEventConstants} from "../../integration/tasks/core/constants/task-event.constants";

export function TaskComponent(props: {show: boolean, task?:TaskDTO, emitter?: TaskEmitterService}): JSX.Element {

    const { t } = useTranslation();

    const {show, task, emitter} = props;

    const [titleValue, setTitleValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [priorityValue, setPriorityValue] = useState('');

    useEffect(() => {
        if(!task) {
            return;
        }

        setPriorityValue(task.priority);
    },[task]);


    if(!show) {
        return (<></>);
    }

    function handleClick(event: MouseEvent<HTMLButtonElement>, eventName: string, task: TaskDTO): void {
        event.stopPropagation();

        console.log(eventName);
        console.log(task);

        emitter?.emit(eventName, task);
    }

    return (<div className="task-component__container" data-testid="task-component__container">

        <label htmlFor="taskTitleInput" className="task-component__title-label" data-testid="task-component__title-label">{t('editor.titleLabel').toString()}</label>
        <input type="text"
               className="task-component__title-input"
               data-testid="task-component__title-input"
               id="taskTitleInput"
               defaultValue={task?.title ?? titleValue} onChange={

            (event: ChangeEvent<HTMLInputElement>) => {
                event.stopPropagation();
                setTitleValue(event.target.value);
            }

        }/>

        <label htmlFor="taskDescriptionTextArea" className="task-component__description-label" data-testid="task-component__description-label">{t('editor.descriptionLabel').toString()}</label>
        <textarea className="task-component__description-text-area"
                  data-testid="task-component__description-text-area"
                  id="taskDescriptionTextArea"
                  defaultValue={task?.description ?? descriptionValue} onChange={

            (event: ChangeEvent<HTMLTextAreaElement>) => {
                event.stopPropagation();
                setDescriptionValue(event.target.value);
            }

        }></textarea>

        <select className="task-component__priority-selector"
                data-testid="task-component__priority-selector"
                value={priorityValue}
                disabled={task?.complete} onChange={

                (event: ChangeEvent<HTMLSelectElement>) => {
                    event.stopPropagation();
                    setPriorityValue(event.target.value);
                }
        }>
            {
                Object.values(TaskPriorityConstants).map((priority: string) => (
                    <option value={priority} key={priority}>{t(`task.priority.${priority}`).toString()}</option>
                ))
            }
        </select>

        <button type="button"
                className="task-component__save-button"
                data-testid="task-component__save-button" onClick={

            (event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();



                const updated: TaskDTO = {
                    id: task?.id,
                    title: titleValue || (task?.title as string),
                    description: descriptionValue || task?.description,
                    priority: priorityValue || (task?.priority as string),
                    complete: (task?.complete as boolean),

                }

                console.log(updated);

            }

        }>{t('editor.saveLabel').toString()}</button>

        <button type="button" className="task-component__cancel-button" data-testid="task-component__cancel-button">{t('editor.cancelLabel').toString()}</button>

    </div>);
}
