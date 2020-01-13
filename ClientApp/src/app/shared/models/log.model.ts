import { Wording } from './wording.model';

export interface LogInfo {
    message: Wording;
    subject: string;
}

export interface Log {
    message: Wording;
    date: Date;
    subject: string;
    unseen?: boolean;
    id: number;
    type: LogType;
}

export enum LogType {
    error,
    warning,
    notification
}
