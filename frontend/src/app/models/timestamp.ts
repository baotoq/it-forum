export class Timestamp {
  dateCreated: Date;
  dateModified: Date;
  dateDeleted: Date;

  constructor(obj) {
    if (obj) {
      this.dateCreated = obj.dateCreated;
      this.dateModified = obj.dateModified;
      this.dateDeleted = obj.dateDeleted;
    }
  }
}
