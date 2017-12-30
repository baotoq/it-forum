import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CoreService } from '../../core/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCodes } from '../../shared/common/status-codes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private coreService: CoreService,
              private router: Router,
              private route: ActivatedRoute) {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.email.value, this.password.value)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        if (resp.token) {
          this.authService.setToken(resp.token);
          this.coreService.notifySuccess('Login successful!');
          this.navigate();
        }
      }, resp => {
        if (resp.status === StatusCodes.UNAUTHORIZED || resp.status === StatusCodes.BAD_REQUEST) {
          this.coreService.notifyError(resp.error);
        } else if (resp.status === StatusCodes.FORBIDDEN) {
          this.coreService.notifyWarning(resp.error);
        }
        this.password.reset();
      });
  }

  navigate() {
    let returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (!returnUrl) {
      returnUrl = '/';
    }
    this.router.navigateByUrl(returnUrl);
  }
}
