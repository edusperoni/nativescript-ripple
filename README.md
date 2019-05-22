# Nativescript Angular Native Ripple Plugin

This plugin aims to bring a native (or close to native) ripple implementation on Android and iOS. The android version uses a `RippleDrawable` and conserves the previous background, as well as CSS styles.

This is heavily based on https://github.com/bradmartin/nativescript-ripple with some improvements:

* It doesn't override the CSS on Android anymore
* iOS ripple is closer to the Android ripple.
## Installation

```javascript
tns plugin add nativescript-ng-ripple
```

## **BREAKING CHANGES**

### v2.0

- Ripple is now applied to the foreground by default on Android. (see `rippleLayer`)
- Ripple color is now modified by an alpha parameter meaning a ripple color of `rgba(255,255,255,1)` turns into `rgba(255,255,255,0.25)` (default behavior unchanged). See `rippleColorAlpha` property.
- Due to native implementation of ripple, the color is at most at `50%` alpha at any time, this behavior has been replicated to iOS. Together with `rippleColorAlpha`, the behavior should be consistent across platforms.

## Usage 

This will only work on Android Lollipop 5.0 or later and any version of iOS.

### Import the NgRippleModule

If you're using other modules that change the background (like https://github.com/Especializa/nativescript-ng-shadow), ensure to import it LAST, otherwise the Ripple background will be overwritten.

```	
import { NgRippleModule } from 'nativescript-ng-ripple';

@NgModule({
    imports: [
        NgRippleModule,
        // ...
    ],
    // ...
})
export class MyModule { }
```

### Use it in the templates:

**ENSURE TO BIND A TAP LISTENER, OR THIS WON'T WORK ON ANDROID**

```<Label ripple text="my label text" (tap)="tapfn()"></Label>```

```
<StackLayout ripple rippleColor="#00ff00" style="padding: 30; border-radius: 10;" (tap)="tapfn()">
<Label text="this is inside the layout!"></Label>
</StackLayout>
```

### Implementation details

On Android, if the view does not have a background, we assign a transparent one. Otherwise, turning the screen off and then on again makes the background the same as the mask color (black).

### Ripple Options

`rippleColor` sets the ripple color. Examples: `"#ffffff"` | `"rgba(255,255,255,0.5)"`.

`rippleColorAlpha` sets the ripple color alpha (multiplicative). Default: `0.25`. **NOTE:** This is multiplicative to a 0.5 alpha given by the native class `RippleDrawable`. This same value is hardcoded in iOS to make both platforms behave the same.

`rippleLayer` sets the layer the ripple is applied to (**ANDROID ONLY**). Allowed values: `foreground` (default on API>=23) | `background`. Setting this to `background` will make the ripple only appear on the View's background (meaning it won't appear in front of an image, for example).

`ripple` can be set to "off" (`ripple="off"`) to disable the ripple. This will also disable ripple effects on Views that have them natively (like `Button`).

### Known Issues

#### No Ripple on Android

If your Ripple is not working on Android, try the following:

1. Verify the view you're applying the Ripple to has a `tap` event
2. If the view is a Text-like view (Buttons, Labels, etc), there is a bug that prevents any `foreground` to be applied to it when `textWrap` is not `true` and `textAlignment` is `center` or `right`. There are many fixes (only one is needed):
    1. Wrap the View in another layout (like a `GridLayout`)
    2. Change the `rippleLayer` to `background`
    3. Use `textWrap="true"`
    4. Disable `HorizontallyScrolling` for your View (`yourLabel.android.setHorizontallyScrolling(false);`). Warning: this is set to true every time `textAlignment` changes

    
## License

Apache License Version 2.0, January 2004
