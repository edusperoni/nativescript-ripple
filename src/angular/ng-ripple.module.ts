import { NgModule } from '@angular/core';

import { NativeRippleDirective } from './ng-ripple.directive';
import { registerElement } from "@nativescript/angular";
import { Ripple } from "nativescript-ripple";

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