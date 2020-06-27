import { NotificationType } from '../enums/notification.enum';
import { Wording } from './wording.model';

export interface Notification {
    type: NotificationType;
    title: Wording;
    message: Wording;
    duration: number;
}
