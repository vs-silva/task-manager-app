import type {TaskDTO} from "../dtos/task.dto";

export interface TaskEmitterService {
    emit(name: string, value?: unknown): void;
}
