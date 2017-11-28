import { User } from './user';
import { Timestamp } from './timestamp';

export class Post extends Timestamp {
  id: number;
  point = 0;
  content: string;
  threadId: number;
  userId: number;
  createdBy: User;
  replies: Post[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.content = obj.content;
      this.threadId = obj.threadId;
      this.userId = obj.userId;
      this.createdBy = obj.createdBy;
    }
  }
}
