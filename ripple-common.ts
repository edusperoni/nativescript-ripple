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
import { isAndroid } from "platform";

// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
const AffectsLayout = isAndroid ? PropertyMetadataSettings.None : PropertyMetadataSettings.AffectsLayout;

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

export abstract class Ripple extends ContentView {
    public static rippleColorProperty = rippleColorProperty;
    public static rippleAlphaProperty = rippleAlphaProperty;
    public static rippleDurationProperty = rippleDurationProperty;
    public static fadeDurationProperty = fadeDurationProperty;

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

    public _addChildFromBuilder(name: string, value: any) {
        // Copy inheirtable style property values
        //var originalColor = value.style.color || null;

        if (value instanceof View) {
            this.content = value;
        }

        // Reset inheritable style property values as we do not want those to be inherited
        //value.style.color = originalColor;
    }

    public abstract performRipple(x: number, y: number);
}
