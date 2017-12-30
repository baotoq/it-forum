import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
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
export class UserPostsComponent implements OnInit, OnDestroy {
  posts: Post[];

  currentPage = 1;
  pageSize = 10;
  paginatedData = [];

  user$;

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService,
              private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.loadingService.progressBarStart();
    this.userService.getUserPosts(this.route.parent.snapshot.params['userId'])
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.progressBarStop())
      .subscribe(resp => {
        this.posts = this.orderByPipe.transform(resp, ['-dateCreated']);
        if (this.posts.length > 0) {
          this.user$ = this.userService.get(this.posts[0].createdById);
        }
        this.onPageChange();
      });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.posts.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnDestroy() {
  }
}
