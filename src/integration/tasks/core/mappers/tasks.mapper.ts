import type {TasksMapperInterface} from "./tasks-mapper.interface";
import type {TaskDTO} from "../dtos/task.dto";
import type {TaskResponseDTO} from "../dtos/task-response.dto";
import type {TaskRequestDTO} from "../dtos/task-request.dto";
import {TaskStatusConstants} from "../constants/task-status.constants";


async function mapToTasksCollection(data: TaskResponseDTO[]): Promise<TaskDTO[]> {
    return data.map( res => (<TaskDTO>{
        id: res.id,
        title: res.title,
        description: res.description,
        complete: res.complete,
        priority: res.priority,
        status: res.complete ? TaskStatusConstants.CLOSED : TaskStatusConstants.OPEN,
        canDelete: true
    }));
}

async function mapToTaskRequest(dto: TaskDTO): Promise<TaskRequestDTO> {

    const result: TaskRequestDTO = {
        title: dto.title,
        priority: dto.priority,
        description: dto.description || '',
        complete: dto.complete || false
    };

    if(dto.id) {
        result.id = dto.id
    }

    return result;
}

export const TasksMapper: TasksMapperInterface = {
    mapToTasksCollection,
    mapToTaskRequest
} as const;
