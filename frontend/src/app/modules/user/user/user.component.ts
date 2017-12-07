import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  navLinks = [
    {label: 'Profile', link: '/user/profile', icon: 'user'},
    {label: 'Account', link: '/user/account', icon: 'key'},
  ];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  get currentUser() {
    return this.authService.currentUser();
  }
}
