import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CoreService } from '../../core/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../models/role';
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
      email: ['admin@gmail.com', [Validators.required, Validators.email]],
      password: ['123', Validators.required],
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
    this.loading = true;
    this.authService.login(this.email.value, this.password.value)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        if (resp.token) {
          this.authService.setToken(resp.token);
          this.coreService.notifySuccess('Login successful!');
          this.navigate();
        }
      }, error => {
        if (error.status === StatusCodes.UNAUTHORIZED) {
          this.coreService.notifyError(error.json());
        }
      });
  }

  navigate() {
    let returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (!returnUrl) {
      if (this.authService.currentUser().role === Role.Administrator)
        returnUrl = '/admin';
    } else {
      returnUrl = returnUrl === '/auth/login' ? '/' : returnUrl;
    }
    this.router.navigateByUrl(returnUrl);
  }
}
