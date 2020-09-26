# Nativescript-Ripple

This plugin aims to bring a native (or close to native) ripple implementation on Android and iOS. The android version uses a `RippleDrawable` and conserves the previous background, as well as CSS styles.

## Installation

```javascript
tns plugin add nativescript-ripple
```
## Usage 

This will only work on Android Lollipop 5.0 or later and any version of iOS.

### XML

**ENSURE TO BIND A TAP LISTENER TO THE CHILD ELEMENT, OR THIS WON'T WORK ON ANDROID**

```html
<Page 
  xmlns="http://schemas.nativescript.org/tns.xsd" 
  xmlns:RL="nativescript-ripple" loaded="pageLoaded">
  <ActionBar title="Ripples for Every Android" backgroundColor="#3489db" color="#fff" />
  <ScrollView>
    <StackLayout>

      <RL:Ripple rippleColor="#d50000">
        <Label text="Red Ripples!!!" class="message" textWrap="true" />
      </RL:Ripple>

      <RL:Ripple rippleColor="#fff000">
        <Image src="~/images/batman.png" margin="10" stretch="aspectFit" />
      </RL:Ripple>

      <RL:Ripple>
        <Label text="Default Ripple" class="message" textWrap="true" />
      </RL:Ripple>

      <RL:Ripple rippleColor="#fff" backgroundColor="#FF4081" borderRadius="30" height="60" width="60" >
        <Label text="B" fontSize="30" color="#fff" verticalAlignment="center" horizontalAlignment="center" textWrap="true" tap="{{ tapEvent }}" />
      </RL:Ripple>

      <RL:Ripple  rippleColor="#c8c8c8" class="label-button">
        <Label text="Lighter Ripple" textWrap="true" tap="{{ tapEvent }}" />
      </RL:Ripple>

      <RL:Ripple rippleColor="#f5f5f5" margin="15" tap="{{ tapEvent }}" class="dark-button">
        <Label text="Possibilities" color="#fff" padding="10" textWrap="true" tap="{{ tapEvent }}" />
      </RL:Ripple>
 
    </StackLayout>
  </ScrollView>
</Page>
```

### Ripple Options

`rippleColor` sets the ripple color. Examples: `"#ffffff"` | `"rgba(255,255,255,0.5)"`.

`rippleColorAlpha` sets the ripple color alpha (multiplicative). Default: `0.25`. **NOTE:** This is multiplicative to a 0.5 alpha given by the native class `RippleDrawable`. This same value is hardcoded in iOS to make both platforms behave the same.

`rippleLayer` sets the layer the ripple is applied to (**ANDROID ONLY**). Allowed values: `foreground` (default on API>=23) | `background`. Setting this to `background` will make the ripple only appear on the View's background (meaning it won't appear in front of an image, for example).

`rippleEnabled` can be set to "false" (`rippleEnabled="false"`) to disable the ripple. This will also disable ripple effects on Views that have them natively (like `Button`).

### Angular

#### Import the NgRippleModule

If you're using other modules that change the background (like https://github.com/Especializa/nativescript-ng-shadow), ensure to import it LAST, otherwise the Ripple background will be overwritten.

```	
import { NgRippleModule } from 'nativescript-ripple/angular';

@NgModule({
    imports: [
        NgRippleModule,
        // ...
    ],
    // ...
})
export class MyModule { }
```

#### Use it in the templates:

**ENSURE TO BIND A TAP LISTENER, OR THIS WON'T WORK ON ANDROID**

```<Label ripple text="my label text" (tap)="tapfn()"></Label>```

```html
<StackLayout ripple rippleColor="#00ff00" style="padding: 30; border-radius: 10;" (tap)="tapfn()">
<Label text="this is inside the layout!"></Label>
</StackLayout>
```

#### Implementation details

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
