import { User } from './user';
import { Timestamp } from './timestamp';
import { Post } from './post';

export class Thread extends Timestamp {
  id: number;
  title: string;
  content: string;
  views = 0;
  point = 0;
  numberOfPosts = 0;
  lastActivity: Date;
  userId: number;
  discussionId: number;
  user: User;
  posts: Post[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.title = obj.title;
      this.content = obj.content;
      this.views = obj.views;
      this.point = obj.point;
      this.numberOfPosts = obj.numberOfPosts;
      this.lastActivity = obj.lastActivity;
      this.userId = obj.userId;
      this.discussionId = obj.discussionId;
      this.user = obj.user;
      this.posts = obj.posts;
    }
  }
}
