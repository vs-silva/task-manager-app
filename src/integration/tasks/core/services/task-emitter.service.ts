export interface TaskEmitterService {
    emit(name: string, value?: string): void;
}
