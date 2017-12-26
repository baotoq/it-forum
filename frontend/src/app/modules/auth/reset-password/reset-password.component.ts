import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreService } from '../../core/core.service';
import { LoadingService } from '../../../components/loading/loading.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;

  id: number;
  name: string;
  email: string;

  token: string;

  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private coreService: CoreService,
              private loadingService: LoadingService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.form = this.formBuilder.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });

    this.confirmPassword.valueChanges.debounceTime(200).distinctUntilChanged()
      .subscribe(value => {
        if (value !== this.password.value) this.confirmPassword.setErrors({'unmatch': true});
      });

    this.token = this.route.snapshot.params['token'];
    this.authService.validateToken(this.token)
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.id = resp.id;
        this.name = resp.name;
        this.email = resp.email;
      }, error => this.router.navigate(['/auth/login']));
  }

  ngOnDestroy() {
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.resetPassword(this.id, this.password.value, this.token)
      .finally(() => this.loading = false)
      .subscribe(() => {
        this.coreService.notifySuccess();
        this.router.navigate(['/auth/login']);
      });
  }
}
