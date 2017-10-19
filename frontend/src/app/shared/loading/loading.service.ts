import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoadingService {
  status = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  start = () => this.status.next(true);
  stop = () => this.status.next(false);
}
