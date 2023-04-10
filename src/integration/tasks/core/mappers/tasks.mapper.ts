import type {TasksMapperInterface} from "./tasks-mapper.interface";
import type {TaskDTO} from "../dtos/task.dto";
import type {TaskResponseDTO} from "../dtos/task-response.dto";
import type {TaskRequestDTO} from "../dtos/task-request.dto";
import {TasksStatusConstants} from "../constants/tasks-status.constants";


async function mapToTasksCollection(data: TaskResponseDTO[]): Promise<TaskDTO[]> {
    return data.map( res => (<TaskDTO>{
        id: res.id,
        title: res.title,
        description: res.description,
        complete: res.complete,
        priority: res.priority,
        status: res.complete ? TasksStatusConstants.CLOSED : TasksStatusConstants.OPEN,
        canDelete: true
    }));
}

async function mapToTaskRequest(dto: TaskDTO): Promise<TaskRequestDTO> {
    return <TaskRequestDTO> {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        complete: dto.complete,
        priority: dto.priority
    };
}

export const TasksMapper: TasksMapperInterface = {
    mapToTasksCollection,
    mapToTaskRequest
} as const;
