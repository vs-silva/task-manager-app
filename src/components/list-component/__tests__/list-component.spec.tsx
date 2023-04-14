import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {cleanup, fireEvent, render, RenderResult} from "@testing-library/react";
import {faker} from "@faker-js/faker";
import type {TaskDTO} from "../../../integration/tasks/core/dtos/task.dto";
import {TasksStatusConstants} from "../../../integration/tasks/core/constants/tasks-status.constants";
import {TasksPriorityConstants} from "../../../integration/tasks/core/constants/tasks-priority.constants";

describe('List component tests', () => {

    let component: RenderResult;

    let fakeTaskCollection: TaskDTO[] = [
        {
            id: faker.datatype.uuid(),
            title: faker.random.words(2),
            description: faker.random.words(10),
            complete: false,
            canDelete: true,
            status: TasksStatusConstants.OPEN,
            priority: TasksPriorityConstants.LOW
        },
        {
            id: faker.datatype.uuid(),
            title: faker.random.words(2),
            description: faker.random.words(10),
            complete: true,
            canDelete: true,
            status: TasksStatusConstants.CLOSED,
            priority: TasksPriorityConstants.MEDIUM
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
            items={fakeTaskCollection}
        />);

        const container = component.getByTestId('list-component__container');
        const listItem = component.getByTestId('list-item-component__container');

        expect(container).toBeTruthy();
        expect(listItem).toBeTruthy();
    });

    it('Should handle click on and emit event to notify that a new task should be added', () => {

        const expectedEventTypes = /add-new/i;
        const fakeEmit = (name: string): Promise<void> => {
            expect(name).toMatch(expectedEventTypes);
            return Promise.resolve();
        }

        const fakeEmitter: ListEmitter = {
          emit: fakeEmit
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');

        component.rerender(<ListComponent
            items={fakeTaskCollection}
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
