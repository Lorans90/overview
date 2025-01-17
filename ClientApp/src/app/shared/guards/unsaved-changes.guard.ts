import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from '../services/confirmation.service';

export interface DirtyComponent {
    customValidation?: () => Observable<boolean>;
    form?: FormGroup;
}

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<DirtyComponent> {

    constructor(private confirmationService: ConfirmationService) { }

    isClean(component: DirtyComponent) {
        if (component.customValidation) {
            return component.customValidation();
        } else if (component.form) {
            return !component.form.dirty;
        }
        return true;
    }

    canDeactivate(component: DirtyComponent): boolean | Observable<boolean> {
        return this.isClean(component)
            ? true
            : this.confirmationService.confirm();
    }
}
