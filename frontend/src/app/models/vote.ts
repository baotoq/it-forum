export class Vote {
  like: boolean;
  userId: number;

  constructor(obj?) {
    if (obj) {
      this.userId = obj.userId;
      this.like = obj.like;
    }
  }
}
