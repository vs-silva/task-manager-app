import type {TasksServiceWriterDrivenPort} from "../ports/tasks-service-writer-driven.port";
import type {TaskRequestDTO} from "../core/dtos/task-request.dto";
import {ApiEngine} from "../../../api-engine";
import Settings from "../../../settings";
import Eventbus from "../../../eventbus";
import {AxiosInstance} from "axios";
import {TaskResourceConstants} from "../core/constants/task-resource.constants";

export function RestApiWriterAdapter(): TasksServiceWriterDrivenPort {

    const engine: AxiosInstance = ApiEngine(Settings.endpoint, Eventbus);

    async function save(dto: TaskRequestDTO): Promise<void> {

        try{

            if(dto.id) {
                await engine.put(`${TaskResourceConstants.TASKS}/${dto.id}`, dto);
                return;
            }

            await engine.post(`${TaskResourceConstants.TASKS}`, dto);
            return;

        } catch (error) {
            console.log(error); //TODO: Toaster Message for this
            return;
        }
    }

    async function remove(id: string): Promise<void> {

        try {

            const response = await engine.delete(`${TaskResourceConstants.TASKS}/${id}`);
            return response.data;

        } catch (error) {

            console.log(error); //TODO: Toaster Message for this
            return;

        }


    }

    return {
        remove,
        save
    };
}
