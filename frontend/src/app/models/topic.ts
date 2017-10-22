import { Timestamp } from './timestamp';
import { Discussion } from './discussion';

export class Topic extends Timestamp {
  id: number;
  name: string;
  description: string;
  discussions: Discussion[];

  constructor(obj?) {
    super(obj);
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.discussions = obj.discussion;
    }
  }
}