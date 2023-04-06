import type {TaskDTO} from "../core/dtos/task.dto";

export interface TasksServiceDriverPort {
    getAllTasks():Promise<TaskDTO[]>;
}
