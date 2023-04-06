import type {TaskResponseDTO} from "../dtos/task-response.dto";
import type {TaskDTO} from "../dtos/task.dto";

export interface TasksResponseMapper {
    mapToTasksCollection(data: TaskResponseDTO[]): Promise<TaskDTO[]>;
}
