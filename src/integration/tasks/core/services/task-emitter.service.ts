export interface TaskEmitterService {
    emit(name: string, value?: unknown): void;
}
