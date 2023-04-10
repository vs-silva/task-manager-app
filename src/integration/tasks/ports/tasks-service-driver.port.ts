import type {TaskDTO} from "../core/dtos/task.dto";

export interface TasksServiceDriverPort {
    getAllTasks():Promise<TaskDTO[]>;
    getTaskByID(id: string): Promise<TaskDTO | null>;
    saveTask(dto: TaskDTO): Promise<void>;
    removeTask(id: string): Promise<void>;
}
