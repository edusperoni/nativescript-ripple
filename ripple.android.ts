/***************************************************************************************
* Made for the {N} community by Brad Martin @BradWayneMartin
* https://twitter.com/BradWayneMartin
* https://github.com/bradmartin
* http://bradmartin.net
* Open Source Lib for Android : https://github.com/balysv/material-ripple
*************************************************************************************/

import * as common from './ripple-common';
import { Color } from "tns-core-modules/color";

declare var android: any;
declare var java: any;
declare var com: any;

export class Ripple extends common.Ripple {
    private _android: any; /*com.balysv.materialripple.MaterialRippleLayout;*/
    private _androidViewId: number;

    get android(): any {
        return this._android;
    }

    get _nativeView(): any {
        return this._android;
    }

    public _createUI() {
        this._android = new com.balysv.materialripple.MaterialRippleLayout(this._context);

        this._android.setRippleOverlay(true);

        if (!this._androidViewId) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);

        if (this.rippleColor) {
            this._android.setRippleColor(new Color(this.rippleColor).android);
        }

        // if (this.rippleAlpha) {
        //     console.log(this.rippleAlpha);
        //     // this._android.setRippleAlpha(this.rippleAlpha);
        // }

        // if (this.rippleDuration) {
        //     console.log(this.rippleDuration);
        //     // this._android.setRippleDuration(this.rippleDuration);
        // }

        // if (this.fadeDuration) {
        //     console.log(this.fadeDuration);
        //     // this._android.setRippleFadeDuration(this.fadeDuration);
        // }
    }

    public performRipple(x: number, y: number) {
        this._android.performRipple();
    }
}
