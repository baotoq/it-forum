import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../user.service';
import { User } from '../../../../models/user';
import { LoadingService } from '../../../../components/loading/loading.service';
import { CoreService } from '../../../core/core.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;

  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  form: FormGroup;
  loading = false;

  edit = false;

  constructor(private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private coreService: CoreService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.get(this.authService.currentUser().id)
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.user = resp;

        this.form = this.formBuilder.group({
          name: [this.user.name, Validators.required],
          phone: [this.user.phone],
          birthdate: [this.user.birthdate],
        });
      });
  }

  ngOnDestroy() {
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = new User();
    payload.name = this.name.value;
    payload.phone = this.phone.value;
    payload.birthdate = this.birthdate.value;

    this.userService.updateProfile(payload)
      .subscribe(() => {
        this.loading = false;
        this.edit = false;
        this.coreService.notifySuccess();
      });
  }

  get name() {
    return this.form.get('name');
  }

  get phone() {
    return this.form.get('phone');
  }

  get birthdate() {
    return this.form.get('birthdate');
  }
}
