import { Wording } from './wording.model';
import { NotificationType } from '../enums/notification.enum';

export interface Notification {
    type: NotificationType;
    title: Wording;
    message: Wording;
    duration: number;
}
