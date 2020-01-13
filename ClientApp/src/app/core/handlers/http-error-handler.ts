import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService, NotificationType } from 'src/app/shared/services/notification.service';
import { wording } from '../wording';
import { Wording } from 'src/app/shared/models/wording.model';

/**
 * Handles HTTP error and shows it as notification
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {
  constructor(
    private notificationService: NotificationsService,
  ) { }

  handleError = (error: HttpErrorResponse): void => {
    let errorMessages: { title?: Wording, content: Wording }[] = [];

    if (error.error && error.error.globalErrors && error.error.globalErrors.length) {
      errorMessages = error.error.globalErrors.map(globalError => {
        let message = globalError.message;
        if (error.error.type === 'ForbiddenException' && error.url.includes('/api')) {
          message = `${message} ${error.url.split('/api')[1]}`;
        }

        return ({
          content: {
            en: message,
            de: message
          }
        });
      });
    } else if (error.error && error.error.fieldErrors && error.error.fieldErrors.length) {
      errorMessages = error.error.fieldErrors.map(fieldErrors => {
        const field = fieldErrors.field;
        let message = fieldErrors.message;
        if (error.error.type === 'ForbiddenException' && error.url.includes('/api')) {
          message = `${message} ${error.url.split('/api')[1]}`;
        }

        return ({
          title: {
            en: field,
            de: field,
          },
          content: {
            en: message,
            de: message
          }
        });
      });
    } else {
      const message = error.error ? error.error.message : null;
      const errorWording = message
        ? {
          content: {
            en: message,
            de: message
          }
        }
        : { content: wording.error };
      errorMessages = [errorWording];
    }

    errorMessages.forEach(errorMessageWording => this.notificationService.notify(
      NotificationType.Error,
      errorMessageWording.title ? errorMessageWording.title : wording.error,
      errorMessageWording.content
    ));
  }
}


