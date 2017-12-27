import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../user.service';
import { User } from '../../../../models/user';
import { LoadingService } from '../../../../components/loading/loading.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(private loadingService: LoadingService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.userService.getWithReputations(this.authService.currentUser().id)
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.user = resp;
      });
  }
}
