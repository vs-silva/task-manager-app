import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {cleanup, fireEvent, render, RenderResult} from "@testing-library/react";
import {faker} from "@faker-js/faker";
import type {TaskDTO} from "../../../integration/tasks/core/dtos/task.dto";
import {TaskStatusConstants} from "../../../integration/tasks/core/constants/task-status.constants";
import {TaskPriorityConstants} from "../../../integration/tasks/core/constants/task-priority.constants";
import {ListComponent} from "../list.component";
import type {TaskEmitterService} from "../../../integration/tasks/core/services/task-emitter.service";

describe('List component tests', () => {

    let component: RenderResult;

    let fakeTaskCollection: TaskDTO[] = [
        {
            id: faker.datatype.uuid(),
            title: faker.random.words(2),
            description: faker.random.words(10),
            complete: false,
            canDelete: true,
            status: TaskStatusConstants.OPEN,
            priority: TaskPriorityConstants.LOW
        },
        {
            id: faker.datatype.uuid(),
            title: faker.random.words(2),
            description: faker.random.words(10),
            complete: true,
            canDelete: true,
            status: TaskStatusConstants.CLOSED,
            priority: TaskPriorityConstants.MEDIUM
        }
    ];

    beforeAll(() => {
        component = render(<ListComponent />);
    });

    it('Should not render any element if TaskDTO Collection is not provided', () => {
        expect(component.container.children.length).toEqual(0);
    });

    it('Should render component UI if TaskDTO Collection is provided', () => {
        component.rerender(<ListComponent
            tasks={fakeTaskCollection}
        />);

        const container = component.getByTestId('list-component__container');
        const list = component.getByTestId('list-component__list');
        const listItem = component.getAllByTestId('list-item-component__container');

        expect(container).toBeTruthy();
        expect(list).toBeTruthy();
        expect(listItem).toBeTruthy();
    });

    it('Should handle click on and emit event to notify that a new task should be added', () => {

        const expectedEventTypes = /add-new/i;
        const fakeEmit = (name: string): Promise<void> => {
            expect(name).toMatch(expectedEventTypes);
            return Promise.resolve();
        }

        const fakeEmitter: TaskEmitterService = {
          emit: fakeEmit
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');

        component.rerender(<ListComponent
            tasks={fakeTaskCollection}
            emitter={fakeEmitter}
        />);

        const addButton = component.getByTestId('list-component__add-button');
        expect(addButton).toBeTruthy();

        fireEvent.click(addButton);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledOnce();

    });


    afterAll(() => {
        component.unmount();
        cleanup();
    });
});
