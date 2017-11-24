import { User } from './user';
import { Timestamp } from './timestamp';
import { Post } from './post';
import { Tag } from './tag';

export class Thread extends Timestamp {
  id: number;
  title: string;
  views = 0;
  pinned = false;
  point = 0;
  numberOfPosts = 0;
  lastActivity: Date;
  userId: number;
  discussionId: number;
  user: User;
  posts: Post[];
  tags: Tag[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.title = obj.title;
      this.views = obj.views;
      this.point = obj.point;
      this.numberOfPosts = obj.numberOfPosts;
      this.lastActivity = obj.lastActivity;
      this.userId = obj.userId;
      this.discussionId = obj.discussionId;
      this.user = obj.user;
      this.posts = obj.posts;
      this.tags = obj.tags;
    }
  }
}
