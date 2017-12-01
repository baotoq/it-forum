import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../../models/role';
import { Thread } from '../../../../../models/thread';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-thread-header',
  templateUrl: './thread-header.component.html',
  styleUrls: ['./thread-header.component.scss'],
})
export class ThreadHeaderComponent implements OnInit {
  @Input() thread: Thread;

  role = Role;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  get authenticated() {
    return this.authService.isAuthenticated();
  }
}
