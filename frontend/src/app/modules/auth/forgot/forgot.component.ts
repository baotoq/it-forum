import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  emailControl = new FormControl(null, Validators.email);

  loading = false;

  success = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.emailControl.valueChanges.debounceTime(200).distinctUntilChanged().startWith()
      .flatMap(value => {
        this.loading = true;
        if (!value || this.emailControl.hasError('email')) return Observable.of(null);
        return this.authService.isExistEmail(value);
      })
      .subscribe(resp => {
        if (resp === false) this.emailControl.setErrors({'notfound': true});
        this.loading = false;
      });
  }

  onSubmit() {
    if (this.emailControl.invalid) return;

    this.loading = true;
    this.authService.forgot(this.emailControl.value)
      .finally(() => this.loading = false)
      .subscribe(() => this.success = true);
  }
}
