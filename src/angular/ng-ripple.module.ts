import { NgModule } from '@angular/core';

import { NativeRippleDirective } from './ng-ripple.directive';
import { registerElement } from "nativescript-angular/element-registry";
import { RippleView } from "../ripple-view";

registerElement("Ripple", () => RippleView);

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