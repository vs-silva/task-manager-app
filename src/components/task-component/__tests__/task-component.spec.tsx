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
        description: faker.random.words(3),
        complete: false,
        canDelete: true,
        status: TaskStatusConstants.OPEN,
        priority: TaskPriorityConstants.LOW
    };

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const statusOptionsRegex = /open|closed/i;
    const priorityOptionsRegex = /high|medium|low/i;
    const saveEventType = /save/i;
    const cancelEventType = /cancel/i;

    beforeAll( () => {
        component = render(<TaskComponent show={false}/>);
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

    it('Should only send existent task to be saved if any of its fields has been updated/changed', async () => {

        const fakeExtraDescriptionToAppend = faker.random.words(5);
        const fakeSaveEmit = (name: string, value: TaskDTO): Promise<void> => {
            expect(name).toMatch(saveEventType);

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

            expect(value.title).not.toBeFalsy();
            expect(value.description).toContain(fakeExtraDescriptionToAppend);

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

        await userEvent
            .type(descriptionTextArea, fakeExtraDescriptionToAppend);

        fireEvent.click(saveButton);
        expect(spy).toHaveBeenCalled();
    });

    it('Should display empty task editor to allow creating new task', () => {

        const fakeTitleText = faker.random.words(3);
        const fakeSaveEmit = (name: string, value: TaskDTO): Promise<void> => {
            expect(name).toMatch(saveEventType);

            expect(value).toEqual(expect.objectContaining({
                title: expect.any(String),
                description: expect.any(String),
                priority: expect.any(String),
            }));

            expect(value.title).not.toBeFalsy();
            expect(value.title).toContain(fakeTitleText);
            expect(value.priority).toMatch(priorityOptionsRegex);

            return Promise.resolve();
        };

        const fakeEmitter: TaskEmitterService = {
            emit: fakeSaveEmit
        };

        const fakeNewTask:TaskDTO = {
            title: faker.datatype.string(0),
            complete: false,
            priority: TaskPriorityConstants.LOW
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');
        component.rerender(<TaskComponent show={true} task={fakeNewTask} emitter={fakeEmitter}/>);

        const titleInput = component.getByTestId('task-component__title-input');
        const saveButton = component.getByTestId('task-component__save-button');
        expect(titleInput).toBeTruthy();
        expect(saveButton).toBeTruthy();

        fireEvent.input(titleInput, {target: {value: fakeTitleText}});

        fireEvent.click(saveButton);
        expect(spy).toHaveBeenCalled();

    });

    it.only('cancel should emit that the editor has to be closed and and reset', () => {

        const fakeCloseEmit = (name: string): Promise<void> => {
            expect(name).toMatch(cancelEventType);
            return Promise.resolve();
        };

        const fakeEmitter: TaskEmitterService = {
            emit: fakeCloseEmit
        };

        const spy = vi.spyOn(fakeEmitter, 'emit');

        const fakeNewTask:TaskDTO = {
            title: faker.datatype.string(0),
            complete: false,
            priority: TaskPriorityConstants.LOW
        };

        component.rerender(<TaskComponent show={true} task={fakeNewTask} emitter={fakeEmitter}/>);

        const cancelButton = component.getByTestId('task-component__cancel-button');
        expect(cancelButton).toBeTruthy();

        fireEvent.click(cancelButton);
        expect(spy).toHaveBeenCalled();
    });






    afterAll(() => {
        component.unmount();
        cleanup();
    });

});
