import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NotificationType } from 'src/app/shared/enums/notification.enum';
import { NotificationsService } from 'src/app/shared/services/notification.service';
import { wording } from '../wording';
import { HttpErrorHandler } from './http-error-handler';

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
