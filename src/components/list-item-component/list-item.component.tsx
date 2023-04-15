import {MouseEvent} from "react";
import type {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import type {TaskEmitterService} from "../../integration/tasks/core/services/task-emitter.service";
import {TaskEventConstants} from "../../integration/tasks/core/constants/task-event.constants";

export function ListItemComponent(props: {task?: TaskDTO, emitter?: TaskEmitterService}) : JSX.Element {

    const {task, emitter} = props;

    if(!task) {
        return (<></>);
    }

    function handleClick(event: MouseEvent<HTMLDivElement | HTMLHeadingElement | HTMLImageElement>, eventName: string, task: TaskDTO): void {
        event.stopPropagation();

        if(!task.id || !emitter?.emit) {
            return;
        }

        emitter?.emit(eventName,task.id);
    }

    return (<div className='list-item-component__container' data-testid='list-item-component__container' id={task.id}>

        <div className='list-item-component__marker' data-testid='list-item-component__marker' onClick={

            (event: MouseEvent<HTMLDivElement>): void => handleClick(event, TaskEventConstants.TOGGLE_COMPLETE, task)

        }>{task.complete}</div>

        <h3 className='list-item-component__title' data-testid='list-item-component__title' onClick={

            (event: MouseEvent<HTMLHeadingElement>):void => handleClick(event, TaskEventConstants.DISPLAY_DETAILS, task)

        }>{task.title}</h3>

        <img className='list-item-component__delete' data-testid='list-item-component__delete' src='' alt='' onClick={

            (event: MouseEvent<HTMLImageElement>):void => handleClick(event, TaskEventConstants.REMOVE, task)

        }/>
    </div>);
}
