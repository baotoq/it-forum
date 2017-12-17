import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

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

  currentUser = this.authService.currentUser();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

}
