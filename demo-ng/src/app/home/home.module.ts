import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { NgRippleModule } from "nativescript-ng-ripple";

import { registerElement } from "nativescript-angular/element-registry";
import { RippleView } from "nativescript-ng-ripple/ripple-view";

registerElement("Ripple", () => RippleView);

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
        NgRippleModule
    ],
    declarations: [
        HomeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
