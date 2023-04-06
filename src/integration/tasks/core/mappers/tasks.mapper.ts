import type {TasksResponseMapper} from "./tasks-response.mapper";
import type {TaskDTO} from "../dtos/task.dto";
import type {TaskResponseDTO} from "../dtos/task-response.dto";
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

export const TasksMapper: TasksResponseMapper = {
    mapToTasksCollection
} as const;
