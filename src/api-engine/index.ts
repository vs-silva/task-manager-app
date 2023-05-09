import axios, {AxiosInstance} from "axios";
import type {InternalAxiosRequestConfig, AxiosResponse} from "axios";
import type {TaskEmitterService} from "../integration/tasks/core/services/task-emitter.service";
import {ApiEngineEventTypeConstants} from "./constants/api-engine-event-type.constants";

export function ApiEngine(baseURL: string, emitter?: TaskEmitterService) : AxiosInstance {

    const engine = axios.create({
        baseURL: baseURL,
        timeout: ( 60 * 1000 ),
        timeoutErrorMessage: 'Timeout error. Please verify service availability and network connection.',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    engine.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        emitter?.emit(ApiEngineEventTypeConstants.SERVICE_REQUEST_STARTED);
        return config;

    },handleRejectError);

    engine.interceptors.response.use((response: AxiosResponse) => {
        emitter?.emit(ApiEngineEventTypeConstants.SERVICE_REQUEST_ENDED);
        return response;
    },handleRejectError);

    function handleRejectError(error: object): object {
        emitter?.emit(ApiEngineEventTypeConstants.SERVICE_REQUEST_ENDED);
        return Promise.reject(error);
    }

    return engine;
}
