import { User } from './user';
import { Timestamp } from './timestamp';

export class Post extends Timestamp {
  id: number;
  point = 0;
  content: string;
  threadId: number;
  userId: number;
  createdBy: User;
  postId: number;
  quotes: Post[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.content = obj.content;
      this.threadId = obj.threadId;
      this.userId = obj.userId;
      this.postId = obj.postId;
      this.quotes = obj.quotes;
      this.createdBy = obj.createdBy;
    }
  }
}
