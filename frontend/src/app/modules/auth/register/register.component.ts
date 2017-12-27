import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CoreService } from '../../core/core.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;

  constructor(private authService: AuthService,
              private coreService: CoreService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.createForm();
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });

    this.email.valueChanges.debounceTime(200).distinctUntilChanged().startWith()
      .flatMap(value => {
        this.loading = true;
        if (!value || this.email.hasError('email')) return Observable.of(null);
        return this.authService.isExistEmail(value);
      })
      .subscribe(resp => {
        if (resp === true) this.email.setErrors({'unique': true});
        this.loading = false;
      });

    this.confirmPassword.valueChanges.debounceTime(200).distinctUntilChanged()
      .subscribe(value => {
        if (value !== this.password.value) this.confirmPassword.setErrors({'unmatch': true});
      });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const user = new User({
      name: this.name.value,
      email: this.email.value,
      password: this.password.value,
    });

    this.authService.register(user)
      .finally(() => this.loading = false)
      .subscribe(() => {
        this.coreService.notifySuccess('Register Success!');
        this.router.navigate(['/auth/login']);
      });
  }
}
