import { NgModule } from '@angular/core';

import { NativeRippleDirective } from './ng-ripple.directive';
import { registerElement } from "nativescript-angular/element-registry";
import { Ripple } from "../ripple-view";

registerElement("Ripple", () => Ripple);

@NgModule({
  imports: [],
  declarations: [
    NativeRippleDirective,
  ],
  exports: [
    NativeRippleDirective,
  ],
  providers: [],
})
export class NgRippleModule { }