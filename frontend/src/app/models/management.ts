import { User } from './user';
import { Topic } from './topic';

export class Management {
  userId: number;
  user: User;
  topicId: number;
  topic: Topic;

  constructor(obj?) {
    this.topicId = obj.topicId;
  }
}
