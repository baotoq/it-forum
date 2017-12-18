import { Timestamp } from './timestamp';
import { Thread } from './thread';
import { Management } from './management';

export class Topic extends Timestamp {
  id: number;
  name: string;
  description: string;
  parentId: number;
  parent: Topic;
  subTopics: Topic[];
  numberOfThreads = 0;
  numberOfNewThreads = 0;
  threads: Thread[];
  managements: Management[];

  checked = false;

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
    }
  }
}
