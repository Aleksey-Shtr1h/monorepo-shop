export interface ValidationError {
    field: string;
    message: string;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly code?: string;
    public readonly validationErrors?: ValidationError[];

    constructor(response: { status: number; message: string; code?: string; validationErrors?: ValidationError[] }) {
        super(response.message);
        this.name = 'ApiError';
        this.status = response.status;
        this.code = response.code;
        this.validationErrors = response.validationErrors;
    }
}