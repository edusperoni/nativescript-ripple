import { Property } from "ui/core/dependency-observable";
import { ContentView } from "ui/content-view";

/**
 * Represents the Ripple layout.
 */
export class Ripple extends ContentView {
  public static rippleColorProperty: Property;

  /**
     * Gets the native [android widget](com.balysv.materialripple.MaterialRippleLayout) that represents the user interface for this component. Valid only when running on Android OS.
     */
  android: any /* com.balysv.materialripple.MaterialRippleLayout */;

  /**
    * Gets or sets the ripple color.
    */
  rippleColor: string;
}
