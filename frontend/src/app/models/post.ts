import { User } from './user';
import { Timestamp } from './timestamp';
import { ApprovalStatus } from './approval-status';

export class Post extends Timestamp {
  id: number;
  point = 0;
  content: string;
  threadId: number;
  userId: number;
  createdBy: User;
  parentId: number;
  replies: Post[];
  approvalStatus: ApprovalStatus;

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.content = obj.content;
      this.threadId = obj.threadId;
      this.userId = obj.userId;
      this.parentId = obj.parentId;
      this.replies = obj.replies;
      this.createdBy = obj.createdBy;
    }
  }
}
