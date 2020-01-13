import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SettingsService } from './settings.service';
import { NzModalService, ModalOptionsForService } from 'ng-zorro-antd';
import { wording } from 'src/app/core/wording';

export type modalType = 'confirm' | 'info' | 'success' | 'warning' | 'create' | 'error';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    constructor(
        private modalService: NzModalService,
        private settingsService: SettingsService
    ) { }

    private openModal(type: modalType) {
        const confirmed: Subject<boolean> = new Subject<boolean>();


        this.modalService[type as any]({
            ...this.options(confirmed),
        });

        return confirmed.asObservable();
    }

    private options(confirmed: Subject<boolean>): ModalOptionsForService {
        return ({
            nzWidth: 'fit-content',
            nzClosable: true,
            nzOkText: wording.yes[this.settingsService.language.value],
            nzCancelText: wording.no[this.settingsService.language.value],
            nzTitle: wording.doYouWantToLeave[this.settingsService.language.value],
            nzContent: wording.youHaveUnsavedChanges[this.settingsService.language.value],
            nzOnOk: () => confirmed.next(true),
            nzOnCancel: () => confirmed.next(false)
        });
    }
    confirm = (): Observable<boolean> => {
        return this.openModal('confirm');
    }

    warning = (): Observable<boolean> => {
        return this.openModal('warning');
    }

    info = (): Observable<boolean> => {
        return this.openModal('info');
    }

    success = (): Observable<boolean> => {
        return this.openModal('success');
    }

    create = (): Observable<boolean> => {
        return this.openModal('create');
    }

    error = (): Observable<boolean> => {
        return this.openModal('error');
    }
}
