import type {TasksServiceReaderDrivenPort} from "../ports/tasks-service-reader-driven.port";
import {AxiosError, AxiosInstance} from "axios";
import {ApiEngine} from "../../../api-engine";
import Settings from "../../../settings";
import Eventbus from "../../../eventbus";
import type {TaskResponseDTO} from "../core/dtos/task-response.dto";
import {TaskResourceConstants} from "../core/constants/task-resource.constants";

export function RestApiReaderAdapter(): TasksServiceReaderDrivenPort {

    const engine: AxiosInstance = ApiEngine(Settings.endpoint, Eventbus);

    async function getAll(): Promise<TaskResponseDTO[]> {

        try {

            const response = await engine.get(`${TaskResourceConstants.TASKS}`);
            return response.data;

        } catch (error) {

            console.log(error); //TODO: Toaster Message for this
            return <TaskResponseDTO[]>[];

        }

    }

    async function getByID(id: string): Promise<TaskResponseDTO | null> {

        try {

            const response = await engine.get(`${TaskResourceConstants.TASKS}/${id}`);
            return response.data;

        } catch (error) {

            console.log((error as AxiosError).response?.status); //TODO: Toaster Message for this
            console.log((error as AxiosError).response?.statusText); //TODO: Toaster Message for this
            return null;

        }
    }

    return {
        getAll,
        getByID
    };
}
