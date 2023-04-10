import type {TasksServiceDriverPort} from "./ports/tasks-service-driver.port";
import type {TaskDTO} from "./core/dtos/task.dto";
import type {TasksServiceReaderDrivenPort} from "./ports/tasks-service-reader-driven.port";
import type {TasksServiceWriterDrivenPort} from "./ports/tasks-service-writer-driven.port";
import type {TaskRequestDTO} from "./core/dtos/task-request.dto";
import {TasksMapper} from "./core/mappers/tasks.mapper";

export function TasksService(reader: TasksServiceReaderDrivenPort, writer: TasksServiceWriterDrivenPort):TasksServiceDriverPort {
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

    async function saveTask(dto: TaskDTO): Promise<void> {
        const requestDTO = await TasksMapper.mapToTaskRequest(dto);
        return await writer.save(requestDTO);
    }

    return {
        getAllTasks,
        getTaskByID,
        saveTask
    };
}
