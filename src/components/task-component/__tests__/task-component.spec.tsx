import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {cleanup, fireEvent, render, RenderResult} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {faker} from "@faker-js/faker";
import {TaskComponent} from "../task.component";
import type {TaskDTO} from "../../../integration/tasks/core/dtos/task.dto";
import {TaskStatusConstants} from "../../../integration/tasks/core/constants/task-status.constants";
import {TaskPriorityConstants} from "../../../integration/tasks/core/constants/task-priority.constants";
import type {TaskEmitterService} from "../../../integration/tasks/core/services/task-emitter.service";

describe('Task component tests', () => {

    let component: RenderResult;

    const fakeTask: TaskDTO = {
        id: faker.datatype.uuid(),
        title: faker.random.words(2),
        description: faker.random.words(10),
        complete: false,
        canDelete: true,
        status: TaskStatusConstants.OPEN,
        priority: TaskPriorityConstants.LOW
    };

    beforeAll( () => {
        component = render(<TaskComponent show={false} />);
    });

    it('Should not display any element', () => {
        expect(component.container.children.length).toEqual(0);
    });

    it('Should display prefilled task editor with the provided taskDTO', () => {

        component.rerender(<TaskComponent show={true} task={fakeTask} />);

        const container = component.getByTestId('task-component__container');
        const titleLabel = component.getByTestId('task-component__title-label');
        const titleInput = component.getByTestId('task-component__title-input');
        const descriptionLabel = component.getByTestId('task-component__description-label');
        const descriptionTextArea = component.getByTestId('task-component__description-text-area');
        const prioritySelector = component.getByTestId('task-component__priority-selector');
        const saveButton = component.getByTestId('task-component__save-button');
        const cancelButton = component.getByTestId('task-component__cancel-button');

        expect(container).toBeTruthy();

        expect(titleLabel).toBeTruthy();
        expect(titleLabel.textContent).toEqual('editor.titleLabel');

        expect(titleInput).toBeTruthy();
        expect((titleInput as HTMLInputElement).value).toEqual(fakeTask.title);

        expect(descriptionLabel).toBeTruthy();
        expect(descriptionLabel.textContent).toEqual('editor.descriptionLabel');

        expect(descriptionTextArea).toBeTruthy();
        expect(descriptionTextArea.textContent).toEqual(fakeTask.description);

        expect(prioritySelector).toBeTruthy();
        expect((prioritySelector as HTMLSelectElement).value).toEqual(fakeTask.priority);

        expect(saveButton).toBeTruthy();
        expect(saveButton.textContent).toEqual('editor.saveLabel');

        expect(cancelButton).toBeTruthy();
        expect(cancelButton.textContent).toEqual('editor.cancelLabel');
    });

    it.only('Should only send existent task to be saved if any of its fields has been updated/changed', () => {

        const expectedEventType = /save/i;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const statusOptionsRegex = /open|closed/i;
        const priorityOptionsRegex = /high|medium|low/i;

        const newDescription = faker.random.words(10);
        const fakeSaveEmit = (name: string, value: TaskDTO): Promise<void> => {
            expect(name).toMatch(expectedEventType);

            expect(value).toEqual(expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                status: expect.any(String),
                priority: expect.any(String),
                complete: expect.any(Boolean),
                canDelete: expect.any(Boolean)
            }));

            expect(value.id).toMatch(uuidRegex);
            expect(value.status).toMatch(statusOptionsRegex);
            expect(value.priority).toMatch(priorityOptionsRegex);

            console.log(value.description);

            expect(value.title).not.toBeFalsy();
            expect(value.description).toEqual(newDescription);

            return Promise.resolve();
        };

        const fakeEmitter: TaskEmitterService = {
            emit: fakeSaveEmit
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');

        component.rerender(<TaskComponent show={true} task={fakeTask} emitter={fakeEmitter}/>);

        const titleInput = component.getByTestId('task-component__title-input');
        const descriptionTextArea = component.getByTestId('task-component__description-text-area');
        const saveButton = component.getByTestId('task-component__save-button');

        expect(titleInput).toBeTruthy();
        expect((titleInput as HTMLInputElement).value).toEqual(fakeTask.title);

        expect(saveButton).toBeTruthy();
        expect(saveButton.textContent).toEqual('editor.saveLabel');

        fireEvent.click(saveButton);
        expect(spy).not.toHaveBeenCalled();

        userEvent.type(descriptionTextArea, newDescription);

        fireEvent.click(saveButton);
        expect(spy).toHaveBeenCalled();
    });

    /*it('Should display prefilled task editor with the provided taskDTO 222', () => {

        const expectedEventType = /save/i;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const statusOptionsRegex = /open|closed/i;
        const priorityOptionsRegex = /high|medium|low/i;

        const fakeSaveEmit = (name: string, value: TaskDTO): Promise<void> => {
            expect(name).toMatch(expectedEventType);

            expect(value).toEqual(expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                status: expect.any(String),
                priority: expect.any(String),
                complete: expect.any(Boolean),
                canDelete: expect.any(Boolean)
            }));

            expect(value.id).toMatch(uuidRegex);
            expect(value.status).toMatch(statusOptionsRegex);
            expect(value.priority).toMatch(priorityOptionsRegex);

            return Promise.resolve();
        };

        const fakeEmitter: TaskEmitterService = {
            emit: fakeSaveEmit
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');



        fireEvent.click(saveButton);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledOnce();

    });*/

    it.todo('Should not save non-edited existent task');

    it.todo('Should display empty task editor to allow creating new task');




    afterAll(() => {
        component.unmount();
        cleanup();
    });

});
