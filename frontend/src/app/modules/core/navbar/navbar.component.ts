import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() showSidenavToggle = false;
  @Output() sidenavToggle = new EventEmitter<any>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  get returnUrl() {
    const query = this.route.snapshot.queryParams['returnUrl'];
    return query ? query : this.router.routerState.snapshot.url;
  }

  gotoProfile() {
    this.router.navigate(['/user/settings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get authenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
