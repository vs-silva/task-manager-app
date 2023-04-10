import type {TaskResponseDTO} from "../dtos/task-response.dto";
import type {TaskDTO} from "../dtos/task.dto";
import type {TaskRequestDTO} from "../dtos/task-request.dto";

export interface TasksMapperInterface {
    mapToTasksCollection(data: TaskResponseDTO[]): Promise<TaskDTO[]>;
    mapToTaskRequest(dto: TaskDTO): Promise<TaskRequestDTO>;
}
