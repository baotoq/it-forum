export class Topic {
  id: number;
  name: string;
  description: string;
  createdDate: Date;

  constructor(obj?) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.createdDate = obj.createdDate;
    }
  }
}
