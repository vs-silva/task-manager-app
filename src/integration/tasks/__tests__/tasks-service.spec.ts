import {describe, it, vi, expect} from "vitest";
import {faker} from "@faker-js/faker";
import type {TaskDTO} from "../core/dtos/task.dto";
import Tasks from "../index";
import {TaskPriorityConstants} from "../core/constants/task-priority.constants";

describe('Tasks service integration tests', () => {

    const timeout:number = 60 * 1000;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const statusOptionsRegex = /open|closed/i;
    const priorityOptionsRegex = /high|medium|low/i;

    describe('Tasks service driver port tests', () => {

        it('getAllTasks should return a empty collection if no Tasks are received', async () => {
            const spy = vi.spyOn(Tasks, 'getAllTasks');
            const result = await Tasks.getAllTasks();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(result.length).toEqual(0);
        }, timeout);

        it('saveTask should add a new Task', async () => {

            const fakeTaskDTO = <TaskDTO>{
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TaskPriorityConstants.LOW
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

                await Tasks.removeTask(task.id as string);
            }

        }, timeout);


        it('saveTask should update existing Task', async () => {

            const fakeTaskDTO = <TaskDTO>{
                title: faker.random.words(3),
                description: faker.random.words(20),
                priority: TaskPriorityConstants.LOW
            };

            await Tasks.saveTask(fakeTaskDTO);
            const tasks = await Tasks.getAllTasks();
            const newAddedTask = tasks.find(x => x.title === fakeTaskDTO.title);

            expect(newAddedTask?.id).toMatch(uuidRegex);
            expect(newAddedTask?.status).toMatch(statusOptionsRegex);
            expect(newAddedTask?.priority).toMatch(priorityOptionsRegex);
            expect(newAddedTask?.title).toMatch(fakeTaskDTO.title);
            expect(newAddedTask?.description as string).toMatch(fakeTaskDTO.description as string);
            expect(newAddedTask?.priority).toMatch(fakeTaskDTO.priority);

            (newAddedTask as TaskDTO).title = faker.random.words(4);
            (newAddedTask as TaskDTO).description = faker.random.words(10);
            (newAddedTask as TaskDTO).priority = TaskPriorityConstants.HIGH;

            const spy = vi.spyOn(Tasks, 'saveTask');
            await Tasks.saveTask(newAddedTask as TaskDTO);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(newAddedTask);

            const updatedTask = await Tasks.getTaskByID((newAddedTask as TaskDTO).id as string);

            expect(updatedTask).toBeTruthy();
            expect(updatedTask?.title).not.toEqual(fakeTaskDTO.title);
            expect(updatedTask?.description).not.toEqual(fakeTaskDTO.description);
            expect(updatedTask?.priority).not.toEqual(fakeTaskDTO.priority);
            expect(updatedTask?.title).toEqual(newAddedTask?.title);
            expect(updatedTask?.description).toEqual(newAddedTask?.description);
            expect(updatedTask?.priority).toEqual(newAddedTask?.priority);
            expect(updatedTask?.id).toEqual(newAddedTask?.id);

            await Tasks.removeTask(updatedTask?.id as string);

        }, timeout);

        it('removeTask should remove a Task', async () => {

            const fakeTaskDTO = <TaskDTO>{
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TaskPriorityConstants.LOW
            };

            await Tasks.saveTask(fakeTaskDTO);

            const tasks = await Tasks.getAllTasks();
            const createdTask = tasks.find(x => x.title === fakeTaskDTO.title);

            const taskId = createdTask?.id as string;

            const spy = vi.spyOn(Tasks, 'removeTask');
            await Tasks.removeTask(taskId);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(taskId);

            const result = await Tasks.getTaskByID(taskId);
            expect(result).toBeNull();

        }, timeout);

        it('removeTask should exit if provided TaskId is does not exist', async () => {

            const fakeID = faker.datatype.uuid();
            const spy = vi.spyOn(Tasks, 'removeTask');
            const result = await Tasks.removeTask(fakeID);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeID);

            expect(result).toBeFalsy();

        }, timeout);

        it('getAllTasks should return a collection of TaskDTOs if Tasks are received', async () => {

            const fakeTasks : TaskDTO[]= [
                {
                    title: faker.random.words(2),
                    description: faker.random.words(10),
                    priority: TaskPriorityConstants.LOW
                },
                {
                    title: faker.random.words(3),
                    description: faker.random.words(5),
                    priority: TaskPriorityConstants.MEDIUM
                }
            ];

            for (const fakeTask of fakeTasks) {
                await Tasks.saveTask(fakeTask);
            }

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

                await Tasks.removeTask(task.id as string);
            }

        }, timeout);

        it('getTaskByID should return a TaskDTO if task with provided id exists', async () => {

            const fakeTask = <TaskDTO>{
                title: faker.random.words(2),
                description: faker.random.words(10),
                priority: TaskPriorityConstants.LOW
            };

            await Tasks.saveTask(fakeTask);

            const tasks = await Tasks.getAllTasks();
            const createdTask = tasks.find(x => x.title === fakeTask.title);
            const fakeID = createdTask?.id as string;

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

            await Tasks.removeTask(result?.id as string);

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

    });

});
