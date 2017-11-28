import { Timestamp } from './timestamp';
import { Thread } from './thread';

export class Topic extends Timestamp {
  id: number;
  name: string;
  description: string;
  subTopics: Topic[];
  numberOfThreads = 0;
  threads: Thread[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
    }
  }
}
