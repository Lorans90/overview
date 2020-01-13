import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorHandler } from './http-error-handler';
import { NotificationsService, NotificationType } from 'src/app/shared/services/notification.service';
import { wording } from '../wording';

/**
 * Handles error and shows it as notification
 * @see: https://medium.com/@amcdnl/global-error-handling-with-angular2-6b992bdfb59c
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private injector: Injector,
        private httpErrorHandler: HttpErrorHandler,
    ) { }

    handleError = (error: Error): void => {
        // if (error instanceof HttpErrorResponse) {
        //     // this.httpErrorHandler.handleError(error);
        // } else {
        const IWordingError = {
            en: error.message,
            de: error.message
        };

        const notificationService = this.injector.get(NotificationsService);
        notificationService.notify(NotificationType.Error, wording.error, IWordingError);
        throw error;
        // }
    }
}
