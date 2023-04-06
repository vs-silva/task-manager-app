import type {TasksServiceDriverPort} from "./ports/tasks-service-driver.port";
import type {TaskDTO} from "./core/dtos/task.dto";
import type {TasksServiceReaderDrivenPort} from "./ports/tasks-service-reader-driven.port";
import {TasksMapper} from "./core/mappers/tasks.mapper";

export function TasksService(reader: TasksServiceReaderDrivenPort):TasksServiceDriverPort {
    async function getAllTasks(): Promise<TaskDTO[]> {
        const response = await reader.getAll();
        return await TasksMapper.mapToTasksCollection(response);
    }

    return {
        getAllTasks
    };
}
