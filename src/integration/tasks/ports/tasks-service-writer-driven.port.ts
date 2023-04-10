import type {TaskRequestDTO} from "../core/dtos/task-request.dto";

export interface TasksServiceWriterDrivenPort {
    save(dto: TaskRequestDTO): Promise<void>;
    remove(id: string): Promise<void>;
}
