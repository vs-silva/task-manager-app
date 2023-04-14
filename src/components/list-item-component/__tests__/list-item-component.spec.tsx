import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {cleanup, fireEvent, render, RenderResult} from "@testing-library/react";
import {faker} from "@faker-js/faker";
import {ListItemComponent} from "../list-item.component";
import type {ListItemEmitter} from "../list-item.emitter";
import type {ListItemDTO} from "../list-item.dto";

describe('List item component tests', () => {

    let component: RenderResult;

    const fakeItem: ListItemDTO = {
        id: faker.datatype.uuid(),
        title: faker.random.words(2),
        complete: faker.datatype.boolean()
    };

    beforeAll(() => {
        component = render(<ListItemComponent />);
    });

    it('Should not render any element if no task data is provided', () => {
        expect(component.container.children.length).toEqual(0);
    });

    it('Should render component UI if item data is provided', () => {

        component.rerender(<ListItemComponent
            item={fakeItem}
        />);

        const container = component.getByTestId('list-item-component__container');
        const marker = component.getByTestId('list-item-component__marker');
        const title = component.getByTestId('list-item-component__title');
        const deleteIcon = component.getByTestId('list-item-component__delete');

        expect(container).toBeTruthy();
        expect(container.id).toEqual(fakeItem.id);
        expect(marker).toBeTruthy();
        expect(title).toBeTruthy();
        expect(title.textContent).toBeTruthy()
        expect(deleteIcon).toBeTruthy();
    });

    it('Should handle click events and emit specific event-types', () => {

        const expectedEventTypes = /display-details|toggle-complete|remove/i;

        const fakeEmit = (name: string, value: string): Promise<void> => {
            expect(name).toMatch(expectedEventTypes);
            expect(value).toEqual(fakeItem.id);
            return Promise.resolve();
        };

        const fakeEmitter: ListItemEmitter = {
            emit: fakeEmit,
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');

        component.rerender(<ListItemComponent
            item={fakeItem}
            emitter={fakeEmitter}
        />);

        const marker = component.getByTestId('list-item-component__marker');
        const title = component.getByTestId('list-item-component__title');
        const deleteIcon = component.getByTestId('list-item-component__delete');
        expect(marker).toBeTruthy();
        expect(title).toBeTruthy();
        expect(deleteIcon).toBeTruthy();

        fireEvent.click(marker);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledOnce();

        fireEvent.click(title);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(2);

        fireEvent.click(deleteIcon);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(3);

    });

    afterAll(() => {
        component.unmount();
        cleanup();
    });
});
