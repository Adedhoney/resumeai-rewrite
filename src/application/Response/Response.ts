export enum ResponseStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    ERROR = 'error',
}

export interface IResponse<T extends object> {
    status: ResponseStatus;
    message: string;
    success: boolean;
    data: T;
}

export class ResponseDTO implements IResponse<object> {
    status: ResponseStatus;
    message: string;
    success: boolean;
    data: object;

    constructor(
        status: ResponseStatus,
        message: string,
        success: boolean,
        data: object = {},
    ) {
        this.status = status;
        this.message = message;
        this.success = success;
        this.data = data;
    }
}
