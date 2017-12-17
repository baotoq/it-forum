import { Component, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { UserService } from '../../user.service';
import { LoadingService } from '../../../../components/loading/loading.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  posts: Post[];

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.userService.getUserPosts(this.route.parent.snapshot.params['userId'])
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.posts = resp;
      });
  }
}
