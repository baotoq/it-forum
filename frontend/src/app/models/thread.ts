import { User } from './user';
import { Timestamp } from './timestamp';
import { Post } from './post';
import { Tag } from './tag';
import { Topic } from './topic';

export class Thread extends Timestamp {
  id: number;
  title: string;
  views = 0;
  pinned = false;
  point = 0;
  visited = false;
  numberOfPosts = 0;
  lastActivity: Date;
  userId: number;
  topicId: number;
  createdBy: User;
  posts: Post[];
  tags: Tag[];
  topic: Topic;

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
      this.topicId = obj.topicId;
      this.createdBy = obj.createdBy;
      this.posts = obj.posts;
      this.tags = obj.tags;
    }
  }
}
