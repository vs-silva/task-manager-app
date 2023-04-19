export interface TaskDTO {
    id?: string;
    title: string;
    description?: string;
    status?: string;
    priority: string;
    complete?: boolean;
    canDelete?: boolean;
}
