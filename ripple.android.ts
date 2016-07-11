/***************************************************************************************
* Made for the {N} community by Brad Martin @BradWayneMartin
* https://twitter.com/BradWayneMartin
* https://github.com/bradmartin
* http://bradmartin.net
* Open Source Lib : https://github.com/balysv/material-ripple
*************************************************************************************/

import { DependencyObservable, PropertyChangeData, Property, PropertyMetadataSettings } from "ui/core/dependency-observable";
import { ContentView } from "ui/content-view";
import { View } from "ui/core/view";
import { PropertyMetadata } from "ui/core/proxy";
import { Color } from "color";
import {isAndroid} from "platform";


// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
let AffectsLayout = isAndroid ? PropertyMetadataSettings.None : PropertyMetadataSettings.AffectsLayout;


declare var android, java, com: any;


const rippleColorProperty = new Property(
    "rippleColor",
    "Ripple",
    new PropertyMetadata("", AffectsLayout)
);

const rippleAlphaProperty = new Property(
    "rippleAlpha",
    "Ripple",
    new PropertyMetadata("", AffectsLayout)
);

const rippleDurationProperty = new Property(
    "rippleDuration",
    "Ripple",
    new PropertyMetadata("", AffectsLayout)
);

const fadeDurationProperty = new Property(
    "fadeDuration",
    "Ripple",
    new PropertyMetadata("", AffectsLayout)
);

export class Ripple extends ContentView {
    private _android: com.balysv.materialripple.MaterialRippleLayout;
    private _androidViewId: number;
    public static rippleColorProperty = rippleColorProperty;
    public static rippleAlphaProperty = rippleAlphaProperty;
    public static rippleDurationProperty = rippleDurationProperty;
    public static fadeDurationProperty = fadeDurationProperty;

    constructor() {
        super();
    }

    get android(): any {
        return this._android;
    }

    get _nativeView(): any {
        return this._android;
    }

    get rippleColor(): string {
        return this._getValue(Ripple.rippleColorProperty);
    }
    set rippleColor(value: string) {
        this._setValue(Ripple.rippleColorProperty, value);
    }

    get rippleAlpha(): any {
        return this._getValue(Ripple.rippleAlphaProperty);
    }
    set rippleAlpha(value: any) {
        this._setValue(Ripple.rippleAlphaProperty, value);
    }

    get rippleDuration(): any {
        return this._getValue(Ripple.rippleDurationProperty);
    }
    set rippleDuration(value: any) {
        this._setValue(Ripple.rippleDurationProperty, value);
    }

    get fadeDuration(): any {
        return this._getValue(Ripple.fadeDurationProperty);
    }
    set fadeDuration(value: any) {
        this._setValue(Ripple.fadeDurationProperty, value);
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


    public _addChildFromBuilder(name: string, value: any) {
        // Copy inheirtable style property values
        var originalColor = value.style.color || null;

        if (value instanceof View) {
            this.content = value;
        }

        // Reset inheritable style property values as we do not want those to be inherited
        value.style.color = originalColor;
    }



    public performRipple() {
        this._android.performRipple();
    }


}