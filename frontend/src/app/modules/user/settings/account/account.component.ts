import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { CoreService } from '../../../core/core.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  form: FormGroup;

  loading = false;

  constructor(private formBuilder: FormBuilder,
              private coreService: CoreService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });

    this.confirmPassword.valueChanges.debounceTime(200).distinctUntilChanged()
      .subscribe(value => {
        if (value !== this.newPassword.value) this.confirmPassword.setErrors({'unmatch': true});
      });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.authService.changePassword(this.currentPassword.value, this.newPassword.value)
      .finally(() => this.loading = false)
      .subscribe(resp => {
        this.coreService.notifySuccess();
      }, resp => {
        this.coreService.notifyError(resp.error);
      });
    this.form.reset();
  }

  get currentPassword() {
    return this.form.get('currentPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
