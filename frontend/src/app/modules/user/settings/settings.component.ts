import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';
import { LoadingService } from '../../../components/loading/loading.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  navLinks = [
    {label: 'Profile', link: '/user/settings/profile', icon: 'user'},
    {label: 'Account', link: '/user/settings/account', icon: 'key'},
  ];

  user: User;

  @ViewChild('fileInput') fileInput;

  constructor(private loadingService: LoadingService,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.userService.getWithReputations(this.authService.currentUser().id)
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.user = resp;
      });
  }

  ngOnDestroy() {
  }

  onChangeAvatar() {
    this.fileInput.nativeElement.click();
  }

  onFileChange($event) {
    this.loadingService.progressBarStart();
    const files = this.fileInput.nativeElement.files;
    if (files.length === 0) {
      return;
    }

    this.userService.uploadAvatar(files[0])
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.user.avatar = resp;
      });
  }
}
