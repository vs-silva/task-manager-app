import {describe, it, vi, expect} from "vitest";
import {faker} from "@faker-js/faker";
import type {TaskDTO} from "../core/dtos/task.dto";
import Tasks from "../index";
import {TasksPriorityConstants} from "../core/constants/tasks-priority.constants";

describe('Tasks service integration tests', () => {

    const timeout:number = 60 * 1000;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const statusOptionsRegex = /open|closed/i;
    const priorityOptionsRegex = /high|medium|low/i;

    describe('Tasks service driver port tests', () => {

        it('getAllTasks should return a collection of TaskDTOs', async () => {

            const spy = vi.spyOn(Tasks, 'getAllTasks');
            const result = await Tasks.getAllTasks();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();
            expect(result.length).toBeGreaterThan(0);

            expect(result).toEqual(expect.arrayContaining(<TaskDTO[]>[
                expect.objectContaining(<TaskDTO>{
                    id: expect.any(String),
                    title: expect.any(String),
                    description: expect.any(String),
                    status: expect.any(String),
                    priority: expect.any(String),
                    complete: expect.any(Boolean),
                    canDelete: expect.any(Boolean)
                })
            ]));

            for (const task of result) {
                expect(task.id).toMatch(uuidRegex);
                expect(task.status).toMatch(statusOptionsRegex);
                expect(task.priority).toMatch(priorityOptionsRegex);
            }

        }, timeout);

        it('getTaskByID should return a TaskDTO if task with provided id exists', async () => {

            const tasks = await Tasks.getAllTasks();
            const fakeID = tasks[0].id;

            if(!fakeID) {
                return;
            }

            const spy = vi.spyOn(Tasks, 'getTaskByID');
            const result = await Tasks.getTaskByID(fakeID);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeID);

            expect(result).toBeTruthy();

            expect(result).toEqual(expect.objectContaining(<TaskDTO>{
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                status: expect.any(String),
                priority: expect.any(String),
                complete: expect.any(Boolean),
                canDelete: expect.any(Boolean)
            }));

            expect(result?.id).toMatch(uuidRegex);
            expect(result?.status).toMatch(statusOptionsRegex);
            expect(result?.priority).toMatch(priorityOptionsRegex);

        }, timeout);

        it('getTaskByID should return null if task with provided id does not exists', async () => {

            const fakeID = faker.datatype.uuid();

            const spy = vi.spyOn(Tasks, 'getTaskByID');
            const result = await Tasks.getTaskByID(fakeID);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeID);

            expect(result).toBeNull();

        }, timeout);

        it('saveTask should add Task', async () => {

            const fakeTaskDTO = <TaskDTO>{
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TasksPriorityConstants.LOW,
                complete: faker.datatype.boolean()
            };

            const initialTasks = await Tasks.getAllTasks();

            const spy = vi.spyOn(Tasks, 'saveTask');
            await Tasks.saveTask(fakeTaskDTO);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTaskDTO);

            const updatedTasks = await Tasks.getAllTasks();

            expect(updatedTasks.length).toBeGreaterThan(initialTasks.length);

            for (const task of updatedTasks) {
                expect(task.id).toMatch(uuidRegex);
                expect(task.status).toMatch(statusOptionsRegex);
                expect(task.priority).toMatch(priorityOptionsRegex);
            }

        }, timeout);

        it('removeTask should remove a Task', async () => {

            const fakeTaskDTO = <TaskDTO>{
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TasksPriorityConstants.LOW,
                complete: faker.datatype.boolean()
            };

            await Tasks.saveTask(fakeTaskDTO);

            const tasks = await Tasks.getAllTasks();
            const createdTask = tasks.find(x => x.title === fakeTaskDTO.title);

            if(!createdTask || !createdTask.id) {
                return;
            }

            const taskId = createdTask.id;

            const spy = vi.spyOn(Tasks, 'removeTask');
            await Tasks.removeTask(taskId);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(taskId);

            await Tasks.removeTask(taskId);
            const result = await Tasks.getTaskByID(taskId);

            expect(result).toBeNull();

        }, timeout);

    });

});
