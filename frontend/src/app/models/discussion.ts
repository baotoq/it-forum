import { Timestamp } from './timestamp';
import { Thread } from './thread';

export class Discussion extends Timestamp {
  id: number;
  name: string;
  description: string;
  topicId: number;
  thread: Thread[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.topicId = obj.topicId;
      this.thread = obj.thread;
    }
  }
}
