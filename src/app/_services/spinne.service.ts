import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  public count = 0;
  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false);
    if (this.count <= 0) this.visibility.next(false);
  }

  show() {
    this.visibility.next(true);
    this.count++;
  }

  hide() {
    if (this.count >= 1) this.count--;
    if (this.count <= 0) {
      setTimeout(() => {
        this.visibility.next(false);
      }, 0);
    }
  }
  hideAll() {
    this.count = 0;
    this.visibility.next(false);
  }
}
