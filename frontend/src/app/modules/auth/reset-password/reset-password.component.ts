import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.params['token']);
  }

}
