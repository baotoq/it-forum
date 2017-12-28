import { Timestamp } from './timestamp';
import { Thread } from './thread';

export class Tag extends Timestamp {
  id: number;
  name: string;
  usage = 0;
  threads: Thread[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.threads = obj.threads;
    }
  }
}
