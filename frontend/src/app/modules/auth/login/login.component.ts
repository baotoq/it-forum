import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CoreService } from '../../core/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../models/role';
import { StatusCodes } from '../../../models/status-codes';

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
    const query = this.route.snapshot.queryParams['returnUrl'];
    let returnUrl = '/';
    if (!query) {
      if (this.authService.currentUser().role === Role.Administrator)
        returnUrl = '/admin';
    } else {
      returnUrl = query === '/auth/login' ? '/' : query;
    }
    this.router.navigateByUrl(returnUrl);
  }
}
