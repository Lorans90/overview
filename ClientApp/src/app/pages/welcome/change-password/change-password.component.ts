import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { wording } from 'src/app/core/wording';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  wording = wording;
  public changePaswordForm = new FormGroup({
    oldPassword: new FormControl(null, { validators: [Validators.required] }),
    newPassword: new FormControl(null, { validators: [Validators.required, Validators.minLength(4)] }),
    confirmPassword: new FormControl(null, {
      validators: [this.passwordMatchValidator]
    }),
  });


  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } {
    if (!control.parent) { return null; }
    return control.parent.get('newPassword').value === control.value
      ? null
      : { mismatch: true };
  }

  ngOnInit() { }

  submitForm() {
    this.userService.changePassword(this.changePaswordForm.value)
      .subscribe(() => {
        this.authService.refreshToken().subscribe();
        this.changePaswordForm.reset();
      });
    // this.messageboxService.showNotification('Neues Passwort wurde gespeichert', '', 'success');
  }
  validateConfirmPassword(): void {
    setTimeout(() => this.changePaswordForm.controls.confirmPassword.updateValueAndValidity());
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.changePaswordForm.reset();
    Object.keys(this.changePaswordForm.controls).forEach(key => {
      this.changePaswordForm.controls[key].markAsPristine();
      this.changePaswordForm.controls[key].updateValueAndValidity();
    });
  }
}
