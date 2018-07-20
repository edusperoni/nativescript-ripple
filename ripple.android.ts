/***************************************************************************************
 * Made for the {N} community by Brad Martin @BradWayneMartin
 * https://twitter.com/BradWayneMartin
 * https://github.com/bradmartin
 * http://bradmartin.net
 * Open Source Lib for Android : https://github.com/balysv/material-ripple
 *************************************************************************************/
/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />

import { Color } from 'tns-core-modules/color';
import * as common from './ripple-common';
import {
  fadeDurationProperty,
  rippleAlphaProperty,
  rippleBorderRadiusProperty,
  rippleColorProperty,
  rippleDelayClickProperty,
  rippleDurationProperty
} from './ripple-common';

declare var com: any;

export class Ripple extends common.Ripple {
  private _android: any = null; /*com.balysv.materialripple.MaterialRippleLayout;*/
  private _androidViewId: number;

  get android(): any {
    return this._android;
  }

  [rippleColorProperty.setNative](value: Color) {
    this.nativeView.setRippleColor(value.android);
  }

  [rippleAlphaProperty.setNative](value: number) {
    this.nativeView.setRippleAlpha(value);
  }

  [rippleDurationProperty.setNative](value: number) {
    this.nativeView.setRippleDuration(value);
  }

  [fadeDurationProperty.setNative](value: number) {
    this.nativeView.setRippleFadeDuration(value);
  }

  [rippleBorderRadiusProperty.setNative](value: number) {
    this.nativeView.setRippleRoundedCorners(value);
  }

  [rippleDelayClickProperty.setNative](value: boolean) {
    this.nativeView.setRippleDelayClick(value);
  }

  public createNativeView() {
    this._android = new com.balysv.materialripple.MaterialRippleLayout(this._context);
    this._android.setRippleOverlay(true);

    if (!this._androidViewId) this._androidViewId = android.view.View.generateViewId();
    this._android.setId(this._androidViewId);

    return this._android;
  }

  public performRipple(x: number, y: number) {
    this._android.performRipple();
  }

  public disposeNativeView() {
    this._android = undefined;
  }
}
