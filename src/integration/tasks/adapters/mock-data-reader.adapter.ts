import type {TasksServiceReaderDrivenPort} from "../ports/tasks-service-reader-driven.port";
import type {TaskResponseDTO} from "../core/dtos/task-response.dto";
import MockData from "../../../mock-data";

export function MockDataReaderAdapter(): TasksServiceReaderDrivenPort {

    const data = MockData as TaskResponseDTO[];

    async function getAll(): Promise<TaskResponseDTO[]> {
        return data;
    }

    return {
        getAll
    };
}
