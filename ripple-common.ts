/***************************************************************************************
* Made for the {N} community by Brad Martin @BradWayneMartin
* https://twitter.com/BradWayneMartin
* https://github.com/bradmartin
* http://bradmartin.net
*************************************************************************************/

import { DependencyObservable, PropertyChangeData, Property, PropertyMetadataSettings } from "tns-core-modules/ui/core/dependency-observable";
import { ContentView } from "tns-core-modules/ui/content-view";
import { View } from "tns-core-modules/ui/core/view";
import { Color } from "tns-core-modules/color";
import {isAndroid} from "tns-core-modules/platform";

// on Android we explicitly set propertySettings to None because android will invalidate its layout (skip unnecessary native call).
const AffectsLayout = isAndroid ? PropertyMetadataSettings.None : PropertyMetadataSettings.AffectsLayout;
declare var android, java, com: any;



export const rippleColorProperty = new Property<Ripple, string>({
    name: "rippleColor", affectsLayout: true
});
rippleColorProperty.register(Ripple);


export const rippleAlphaProperty = new Property<Ripple, string>({
    name: "rippleAlpha", affectsLayout: true
});
rippleAlphaProperty.register(Ripple);


export const rippleDurationProperty = new Property<Ripple, string>({
    name: "rippleDuration", affectsLayout: true
});
rippleDurationProperty.register(Ripple);


export const fadeDurationProperty = new Property<Ripple, string>({
    name: "fadeDuration", affectsLayout: true
});
fadeDurationProperty.register(Ripple);

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
