import type {TasksServiceWriterDrivenPort} from "../ports/tasks-service-writer-driven.port";
import MockData from "../../../mock-data";
import type {TaskRequestDTO} from "../core/dtos/task-request.dto";
import { v4 as uuidv4 } from 'uuid';

export function MockDataWriterAdapter(): TasksServiceWriterDrivenPort {
    const data = MockData as TaskRequestDTO[];

    async function save(dto: TaskRequestDTO): Promise<void> {
        if(!dto.id) {
            dto.id = uuidv4();
        }

        data.push(dto);
    }

    return {
      save
    };
}
