import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { wording } from 'src/app/core/wording';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Tokens } from 'src/app/shared/models/tokens.model';

/**
 * Test Comment For Docs
 * loginView Comment
 */

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private redirectUrl: string;
  public form: FormGroup;
  public wording = wording;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.redirectUrl = this.activatedRoute.snapshot.queryParams.redirectUrl || '/welcome';
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['1234', [Validators.required]],
      rememberMe: [false]
    });
  }

  login() {
    this.authService.login(this.form.value).subscribe((tokens: Tokens) => {
      this.authService.storeToken({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      this.router.navigate([this.redirectUrl]);
    });
  }
}
