import { Observable } from 'tns-core-modules/data/observable';
import { NgRipple } from 'nativescript-ng-ripple';

export class HelloWorldModel extends Observable {
  public message: string;
  private ngRipple: NgRipple;

  constructor() {
    super();

    this.ngRipple = new NgRipple();
    this.message = this.ngRipple.message;
  }
}
