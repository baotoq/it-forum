import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Thread } from '../../../../models/thread';
import { AuthService } from '../../../auth/auth.service';
import { Role } from '../../../../models/role';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss'],
})
export class ThreadDetailComponent implements OnInit {
  @Input() thread: Thread;
  @Output() replySuccess = new EventEmitter<any>();

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
