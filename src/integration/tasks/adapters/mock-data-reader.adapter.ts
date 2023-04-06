import type {TasksServiceReaderDrivenPort} from "../ports/tasks-service-reader-driven.port";
import type {TaskResponseDTO} from "../core/dtos/task-response.dto";
import MockData from "../../../mock-data";

export function MockDataReaderAdapter(): TasksServiceReaderDrivenPort {

    const data = MockData as TaskResponseDTO[];

    async function getAll(): Promise<TaskResponseDTO[]> {
        return data;
    }

    async function getByID(id: string): Promise<TaskResponseDTO | null> {
        const result = data.find(item => item.id === id);

        if(!result){
            return null;
        }

        return result;
    }

    return {
        getAll,
        getByID
    };
}
