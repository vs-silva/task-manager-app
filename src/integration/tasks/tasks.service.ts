import type {TasksServiceDriverPort} from "./ports/tasks-service-driver.port";
import type {TaskDTO} from "./core/dtos/task.dto";
import type {TasksServiceReaderDrivenPort} from "./ports/tasks-service-reader-driven.port";
import {TasksMapper} from "./core/mappers/tasks.mapper";

export function TasksService(reader: TasksServiceReaderDrivenPort):TasksServiceDriverPort {
    async function getAllTasks(): Promise<TaskDTO[]> {
        const response = await reader.getAll();
        return await TasksMapper.mapToTasksCollection(response);
    }

    async function getTaskByID(id: string): Promise<TaskDTO | null> {
        const response = await reader.getByID(id);

        if(!response) {
           return null;
        }

        const result = await TasksMapper.mapToTasksCollection([response]);
        return result[0];
    }

    return {
        getAllTasks,
        getTaskByID
    };
}
