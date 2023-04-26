import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import type {TaskEmitterService} from "../../integration/tasks/core/services/task-emitter.service";
import {MouseEvent, ChangeEvent, useEffect, useState, useRef} from "react";
import { useTranslation } from 'react-i18next';
import {TaskPriorityConstants} from "../../integration/tasks/core/constants/task-priority.constants";
import {TaskEventConstants} from "../../integration/tasks/core/constants/task-event.constants";

export function TaskComponent(props: {show: boolean, task?:TaskDTO, emitter?: TaskEmitterService}): JSX.Element {

    const { t } = useTranslation();

    const {show,task, emitter} = props;

    const titleInputRef = useRef(null);
    const descriptionTextAreaRef = useRef(null);
    const [priorityValue, setPriorityValue] = useState('');
    const [completeValue, setCompleteValue] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);

    function resetInputs():void {
        setIsEditMode(false);

        setPriorityValue(TaskPriorityConstants.LOW);
        setCompleteValue(false);
        setSaveDisabled(true);

        if(titleInputRef.current && descriptionTextAreaRef.current) {
            ( titleInputRef.current['value'] as string ) = '';
            ( descriptionTextAreaRef.current['value'] as string ) = '';
        }
    }

    function setInputs(task: TaskDTO): void {
        setIsEditMode(true);

        setPriorityValue(task?.priority);
        setCompleteValue(!!task?.complete);
        setSaveDisabled(true);

        if(titleInputRef.current && descriptionTextAreaRef.current) {
            ( titleInputRef.current['value'] as string ) = task.title;
            ( descriptionTextAreaRef.current['value'] as string ) = ( task.description as string);
        }
    }

    useEffect(() => {

        if(!task || !show) {
            return;
        }

        if(!task.id) {
            resetInputs();
            return;
        }

        setInputs(task);

    },[show, task]);



    function checkCanSave(sourceValue: string, targetValue: string): void {
        if(!isEditMode) {
            setSaveDisabled(false);
        }
        else {

            if(sourceValue.trim() !== targetValue.trim()) {
                setSaveDisabled(false);
            }
            else {
                setSaveDisabled(true);
            }
        }
    }


    if(!show || !task) {
        return (<></>);
    }


    return (<div className="task-component__container" data-testid="task-component__container">

        <label htmlFor="taskTitleInput" className="task-component__title-label" data-testid="task-component__title-label">{t('editor.titleLabel').toString()}</label>
        <input type="text"
               className="task-component__title-input"
               data-testid="task-component__title-input"
               id="taskTitleInput"
               ref={titleInputRef}
               disabled={completeValue}
               placeholder={t('editor.titlePlaceholder').toString()}
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

            }

        }/>

        <label htmlFor="taskDescriptionTextArea" className="task-component__description-label" data-testid="task-component__description-label">{t('editor.descriptionLabel').toString()}</label>
        <textarea className="task-component__description-text-area"
                  data-testid="task-component__description-text-area"
                  id="taskDescriptionTextArea"
                  ref={descriptionTextAreaRef}
                  placeholder={t('editor.descriptionPlaceholder').toString()}
                  disabled={completeValue} onChange={

            (event: ChangeEvent<HTMLTextAreaElement>) => {
                event.stopPropagation();
                checkCanSave(event.target.value, (task?.description as string));
            }

        }></textarea>

        <label htmlFor="taskPrioritySelector" className="task-component__priority-selector-label" data-testid="task-component__priority-selector-label">{t('editor.priorityLabel').toString()}</label>
        <select className="task-component__priority-selector"
                data-testid="task-component__priority-selector"
                id="taskPrioritySelector"
                value={priorityValue}
                disabled={completeValue}
                onChange={

                (event: ChangeEvent<HTMLSelectElement>) => {
                    event.stopPropagation();
                    checkCanSave(event.target.value, task?.priority);
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

                if(titleInputRef.current && descriptionTextAreaRef.current) {

                    const createUpdateDTO: TaskDTO = {
                        title: (titleInputRef.current['value'] as string),
                        description: (descriptionTextAreaRef.current['value'] as string),
                        priority: priorityValue,
                        complete: completeValue
                    };

                    if(isEditMode) {
                        createUpdateDTO.id = task?.id;
                        createUpdateDTO.status = task?.status;
                        createUpdateDTO.canDelete = task?.canDelete;
                    }

                    resetInputs();
                    emitter?.emit(TaskEventConstants.SAVE, createUpdateDTO);
                }
            }

        }>{t('editor.saveLabel').toString()}</button>

        <button type="button"
                className="task-component__close-button"
                data-testid="task-component__close-button" onClick={

            (event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                resetInputs();
                emitter?.emit(TaskEventConstants.CLOSE);
            }

        }>{t('editor.closeLabel').toString()}</button>

    </div>);
}
