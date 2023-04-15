import {TaskDTO} from "../../integration/tasks/core/dtos/task.dto";
import {ListItemComponent} from "../list-item-component/list-item.component";
import {MouseEvent} from "react";
import {TaskEventConstants} from "../../integration/tasks/core/constants/task-event.constants";
import {TaskEmitterService} from "../../integration/tasks/core/services/task-emitter.service";
import {useTranslation} from "react-i18next";

export function ListComponent(props: {tasks?: TaskDTO[], emitter?: TaskEmitterService}): JSX.Element {

    const {tasks, emitter} = props;
    const { t } = useTranslation();

    if(!tasks){
        return (<></>);
    }

    function handleClick(event: MouseEvent<HTMLButtonElement>, eventName: string): void {
        event.stopPropagation();

        if(!emitter?.emit) {
            return;
        }

        emitter?.emit(eventName);
    }

    return (<div className="list-component__container" data-testid="list-component__container">
        <ul className="list-component__list" data-testid="list-component__list">
            {
                tasks.map(task => {
                    if(!emitter) {
                        return <li key={task.id}>
                            <ListItemComponent task={task}/>
                        </li>;
                    }
                    else {
                        return <li key={task.id}>
                            <ListItemComponent task={task} emitter={emitter}/>
                        </li>;
                    }
                })
            }
        </ul>
        <button
            type="button"
            className="list-component__add-button"
            data-testid="list-component__add-button" onClick={

            (event: MouseEvent<HTMLButtonElement>):void => handleClick(event,TaskEventConstants.ADD_NEW)

        }>{t('list.addLabel').toString()}</button>

    </div>);
}
