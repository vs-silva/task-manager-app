import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import type {TaskEmitterService} from "../../integration/tasks/core/services/task-emitter.service";
import {MouseEvent, ChangeEvent, useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import {TaskPriorityConstants} from "../../integration/tasks/core/constants/task-priority.constants";
import {TaskEventConstants} from "../../integration/tasks/core/constants/task-event.constants";

export function TaskComponent(props: {show: boolean, task?:TaskDTO, emitter?: TaskEmitterService}): JSX.Element {

    const { t } = useTranslation();

    const {show,task, emitter} = props;

    const [titleValue, setTitleValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [priorityValue, setPriorityValue] = useState('');
    const [completeValue, setCompleteValue] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);

    useEffect(() => {

        if(!task) {
            return;
        }

        setTitleValue(task.title || '');
        setDescriptionValue(task.description as string || '');
        setPriorityValue(task.priority || TaskPriorityConstants.LOW);
        setCompleteValue(task.complete || false);
        setSaveDisabled(true);
        setIsEditMode( !!task.id);

    },[show, task]);


    if(!show || !task) {
        return (<></>);
    }


    return (<div className="task-component__container" data-testid="task-component__container">

        <label htmlFor="taskTitleInput" className="task-component__title-label" data-testid="task-component__title-label">{t('editor.titleLabel').toString()}</label>
        <input type="text"
               className="task-component__title-input"
               data-testid="task-component__title-input"
               id="taskTitleInput"
               defaultValue={titleValue}
               disabled={completeValue}
               onChange={

            (event: ChangeEvent<HTMLInputElement>) => {
                event.stopPropagation();

                if(event.target.value.trim()) {
                    setSaveDisabled(false);
                }
                else {
                    setSaveDisabled(true);
                }

                if(isEditMode && event.target.value === task?.title) {
                    setSaveDisabled(true);
                }

                setTitleValue(event.target.value);
            }

        }/>

        <label htmlFor="taskDescriptionTextArea" className="task-component__description-label" data-testid="task-component__description-label">{t('editor.descriptionLabel').toString()}</label>
        <textarea className="task-component__description-text-area"
                  data-testid="task-component__description-text-area"
                  id="taskDescriptionTextArea"
                  defaultValue={descriptionValue}
                  disabled={completeValue} onChange={

            (event: ChangeEvent<HTMLTextAreaElement>) => {
                event.stopPropagation();

                if(!isEditMode) {
                    setSaveDisabled(false);
                }
                else {

                    if(event.target.value !== task?.description) {
                        setSaveDisabled(false);
                    }
                    else {
                        setSaveDisabled(true);
                    }

                }

                setDescriptionValue(event.target.value);
            }

        }></textarea>

        <select className="task-component__priority-selector"
                data-testid="task-component__priority-selector"
                value={priorityValue}
                disabled={completeValue}
                onChange={

                (event: ChangeEvent<HTMLSelectElement>) => {
                    event.stopPropagation();

                    if(!isEditMode) {
                        setSaveDisabled(false);
                    }
                    else {

                        if(event.target.value !== task?.priority) {
                            setSaveDisabled(false);
                        }
                        else {
                            setSaveDisabled(true);
                        }

                    }

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
                data-testid="task-component__save-button"
                disabled={saveDisabled}
                onClick={

            (event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();

                const createUpdateDTO: TaskDTO = {
                    title: titleValue,
                    description: descriptionValue,
                    priority: priorityValue,
                    complete: completeValue
                };

                if(isEditMode) {
                    createUpdateDTO.id = task?.id;
                    createUpdateDTO.status = task?.status;
                    createUpdateDTO.canDelete = task?.canDelete;
                }

                emitter?.emit(TaskEventConstants.SAVE, createUpdateDTO);
            }

        }>{t('editor.saveLabel').toString()}</button>

        <button type="button"
                className="task-component__close-button"
                data-testid="task-component__close-button" onClick={

            (event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                emitter?.emit(TaskEventConstants.CLOSE);
            }

        }>{t('editor.closeLabel').toString()}</button>

    </div>);
}
