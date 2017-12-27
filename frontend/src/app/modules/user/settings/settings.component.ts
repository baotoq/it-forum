import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';
import { LoadingService } from '../../../components/loading/loading.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  navLinks = [
    {label: 'Profile', link: '/user/settings/profile', icon: 'user'},
    {label: 'Account', link: '/user/settings/account', icon: 'key'},
  ];

  user: User;

  constructor(private loadingService: LoadingService,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.getWithReputations(this.authService.currentUser().id)
      .subscribe(resp => {
        this.user = resp;
      });
  }
}
