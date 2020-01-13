import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';
import { SettingsService } from './settings.service';
import { Wording } from '../models/wording';

export interface Notification {
    type: NotificationType;
    title: Wording;
    message: Wording;
    duration: number;
}

export enum NotificationType {
    Blank = 'Blank',
    Error = 'Error',
    Info = 'Info',
    Success = 'Success',
    Warning = 'Warning'
}

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private notification: Subject<Notification> = new Subject();
    readonly notification$: Observable<Notification> = this.notification.asObservable();

    constructor(
        private nzNotification: NzNotificationService,
        private settingsService: SettingsService
    ) {
        this.initNotifications();
    }

    public initNotifications(): void {
        this.notification$.subscribe((notification: Notification) => {
            const params = { nzDuration: notification.duration, nzAnimate: true };
            const title = notification.title[this.settingsService.language.value];
            const message = notification.message[this.settingsService.language.value];

            switch (notification.type) {
                case NotificationType.Success:
                    this.nzNotification.success(title, message, params);
                    break;
                case NotificationType.Error:
                    this.nzNotification.error(title, message, params);
                    break;
                case NotificationType.Warning:
                    this.nzNotification.warning(title, message, params);
                    break;
                default:
                    this.nzNotification.warning(title, message, params);
            }
        });
    }

    public notify(type: NotificationType, title: Wording, message: Wording, duration: number = 4000): void {
        this.notification.next({ type, title, message, duration });
    }

    public clearNotifications() {
        this.nzNotification.remove();
    }
}
