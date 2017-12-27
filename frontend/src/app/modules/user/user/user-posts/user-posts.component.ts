import { Component, OnInit } from '@angular/core';
import { Post } from '../../../../models/post';
import { UserService } from '../../user.service';
import { LoadingService } from '../../../../components/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { OrderByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit {
  posts: Post[];

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.getUserPosts(this.route.parent.snapshot.params['userId'])
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['-dateCreated']);
        this.onPageChange();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.posts.slice(startIndex, startIndex + this.pageSize);
  }
}
