import { Timestamp } from './timestamp';
import { Thread } from './thread';

export class Discussion extends Timestamp {
  id: number;
  name: string;
  description: string;
  numberOfThreads = 0;
  topicId: number;
  threads: Thread[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.numberOfThreads = obj.numberOfThreads;
      this.topicId = obj.topicId;
      this.threads = obj.threads;
    }
  }
}
