import type {TaskResponseDTO} from "../core/dtos/task-response.dto";

export interface TasksServiceReaderDrivenPort {
    getAll():Promise<TaskResponseDTO[]>;
}
