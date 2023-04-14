import type {ListItemDTO} from "./list-item.dto";
import type {ListItemEmitter} from "./list-item.emitter";
import {MouseEvent} from "react";
import {ListItemEventConstants} from "./list-item-event.constants";

export function ListItemComponent(props: {item?: ListItemDTO, emitter?: ListItemEmitter}) : JSX.Element {

    const {item, emitter} = props;

    if(!item) {
        return (<></>);
    }

    function handleClick(eventName: string, id: string): void {

        if(!emitter?.emit) {
            return;
        }

        emitter?.emit(eventName,id);
    }

    return (<div className='list-item-component__container' data-testid='list-item-component__container' id={item.id}>

        <div className='list-item-component__marker' data-testid='list-item-component__marker' onClick={

            (event: MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                handleClick(ListItemEventConstants.TOGGLE_COMPLETE, item.id);
            }

        }>{item.complete}</div>

        <h3 className='list-item-component__title' data-testid='list-item-component__title' onClick={

            (event: MouseEvent<HTMLHeadingElement>) => {
                event.stopPropagation();
                handleClick(ListItemEventConstants.DISPLAY_DETAILS, item.id);
            }


        }>{item.title}</h3>

        <img className='list-item-component__delete' data-testid='list-item-component__delete' src='' alt='' onClick={

            (event: MouseEvent<HTMLImageElement>) => {
                event.stopPropagation();
                handleClick(ListItemEventConstants.REMOVE, item.id);
            }

        }/>
    </div>);
}
