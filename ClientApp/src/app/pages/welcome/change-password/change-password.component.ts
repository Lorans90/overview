import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { wording } from 'src/app/core/wording';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    wording = wording;
    public form = new FormGroup({
        oldPassword: new FormControl(null, { validators: [Validators.required] }),
        newPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(4)] }),
        confirmPassword: new FormControl(null, {
            validators: [this.passwordMatchValidator]
        }),
    });


    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    passwordMatchValidator(control: AbstractControl): { [key: string]: any } {
        if (!control.parent) { return null; }
        return control.parent.get('newPassword').value === control.value
            ? null
            : { mismatch: true };
    }

    ngOnInit() { }

    submitForm() {
        this.userService.changePassword(this.form.value)
            .subscribe(() => {
                this.authService.forceLogout();
            });
        // this.messageboxService.showNotification('Neues Passwort wurde gespeichert', '', 'success');
    }
    validateConfirmPassword(): void {
        setTimeout(() => this.form.controls.confirmPassword.updateValueAndValidity());
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.form.reset();
        Object.keys(this.form.controls).forEach(key => {
            this.form.controls[key].markAsPristine();
            this.form.controls[key].updateValueAndValidity();
        });
    }
}
