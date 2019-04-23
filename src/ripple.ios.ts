/***************************************************************************************
 * Made for the {N} community by Brad Martin @BradWayneMartin
 * https://twitter.com/BradWayneMartin
 * https://github.com/bradmartin
 * http://bradmartin.net
 * Modified and improved by Florian Reifschneider (@flore2003) <florian@rocketloop.de>
 *************************************************************************************/
/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />

import { Color } from 'tns-core-modules/color';
import { GestureTypes, TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import * as common from './ripple-common';

/**
 * Native delegate class that can be used to get animation callbacks in the Javascript context
 */
class AnimationDelegate extends NSObject implements CAAnimationDelegate {
  public static ObjCProtocols = [CAAnimationDelegate];

  static new(): AnimationDelegate {
    return <AnimationDelegate>super.new();
  }

  /**
   * The animationDidStart callback
   */
  animationDidStartCallback: (anim: CAAnimation) => void;

  /**
   * The animationDidStopFinished Callback
   */
  animationDidStopFinishedCallback: (anim: CAAnimation, flag: boolean) => void;

  /**
   * Initialize the delegate with callback functions
   * @param animationDidStartCallback
   * @param animationDidStopFinishedCallback
   */
  initWithCallbacks(
    animationDidStartCallback: (anim: CAAnimation) => void,
    animationDidStopFinishedCallback: (anim: CAAnimation, flag: boolean) => void
  ) {
    this.animationDidStartCallback = animationDidStartCallback;
    this.animationDidStopFinishedCallback = animationDidStopFinishedCallback;
    return this;
  }

  /**
   * Propagate the animationDidStopFinished event to the corresponding callback
   * @param anim
   * @param flag
   */
  animationDidStopFinished(anim: CAAnimation, flag: boolean) {
    if (this.animationDidStopFinishedCallback) {
      this.animationDidStopFinishedCallback(anim, flag);
    }
  }

  /**
   * Propagate the animationDidStart event to the corresponding callback
   * @param anim
   */
  animationDidStart(anim: CAAnimation) {
    if (this.animationDidStartCallback) {
      this.animationDidStartCallback(anim);
    }
  }
}

export class Ripple extends common.Ripple {
  /**
   * The current ripple view
   */
  ripple: UIView;

  /**
   * Flag that holds whether the ripple has fully extended
   */
  rippleIsFullyExtended: boolean;

  constructor() {
    super();
  }

  /**
   * Perform a simple ripple at a given location
   * @param x
   * @param y
   */
  performRipple(x: number, y: number) {
    this.createRipple(x, y);
    this.finishRipple();
  }

  /**
   * Update the ripple according to the touch gesture event
   * @param x
   * @param y
   * @param action
   */
  updateRipple(x: number, y: number, action: 'up' | 'down' | 'move' | 'cancel') {
    if (action === 'down') {
      this.startRipple(x, y);
    } else if (action === 'move' && this.ripple) {
      this.moveRipple(x, y);
    } else if (action === 'up') {
      this.finishRipple();
    }
  }

  /**
   * Create a new ripple and prepare it for animation
   * @param x
   * @param y
   */
  createRipple(x: number, y: number) {
    const nativeView = this.ios;
    const size = this.getActualSize();
    const longestSide = Math.max(size.height, size.width);
    const initialRadius = longestSide * 2.5;
    this.ripple = UIView.alloc().initWithFrame(CGRectMake(0, 0, initialRadius, initialRadius));
    this.rippleIsFullyExtended = false;
    this.ripple.layer.cornerRadius = initialRadius * 0.5;
    this.ripple.backgroundColor = new Color(
      this.rippleColor ? ((this.rippleColor as unknown) as Color).hex : '#cecece'
    ).ios;
    this.ripple.alpha = 0.5;
    this.ripple.layer.transform = CATransform3DScale(CATransform3DIdentity, 0.1, 0.1, 0);
    nativeView.insertSubviewAtIndex(this.ripple, 1);
    this.ripple.center = CGPointMake(x || 0, y || 0);
  }

  /**
   * Start a new ripple and animate it using the slow scale animation
   * @param x
   * @param y
   */
  startRipple(x: number, y: number) {
    this.createRipple(x, y);
    this.animateScaleRipple(0.1, 1, 2.5, (anim, flag) => {
      this.rippleIsFullyExtended = true;
    });
  }

  /**
   * Move the ripple to the new given location
   * @param x
   * @param y
   */
  moveRipple(x: number, y: number) {
    if (this.ripple) {
      const size = this.getActualSize();

      // We want to finish the ripple when the touch gesture leaves the container
      if (x < 0 || x > size.width || y < 0 || y > size.height) {
        this.finishRipple();
        return;
      }
      this.ripple.center = CGPointMake(x, y);
    }
  }

  /**
   * Finish the current ripple using the quick scale and fade animation
   */
  finishRipple() {
    if (this.ripple) {
      const presentationLayer = this.ripple.layer.presentationLayer();
      const currentScale = presentationLayer.valueForKeyPath('transform.scale');
      this.cancelScaleRippleAnimation();

      const currentRipple = this.ripple;
      if (!this.rippleIsFullyExtended) {
        this.animateScaleRipple(currentScale, 1, 0.5);
        this.animateFadeRipple(0.5, 0, 0.5, 0.2, (anim, flag) => {
          currentRipple.removeFromSuperview();
        });
      } else {
        this.animateFadeRipple(0.5, 0, 0.5, 0, (anim, flag) => {
          currentRipple.removeFromSuperview();
        });
      }

      this.ripple = null;
    }
  }

  /**
   * Animate the current ripple's scale
   * @param fromScale
   * @param toScale
   * @param duration
   * @param animationDidStopFinishedCallback
   * @param animationDidStartCallback
   */
  animateScaleRipple(
    fromScale: number,
    toScale: number,
    duration: number,
    animationDidStopFinishedCallback = (anim, flag) => {},
    animationDidStartCallback = anim => {}
  ) {
    const scaleAnimation: CABasicAnimation = CABasicAnimation.animationWithKeyPath('transform.scale');
    scaleAnimation.fromValue = fromScale;
    scaleAnimation.toValue = toScale;
    scaleAnimation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseOut);
    scaleAnimation.duration = duration;
    scaleAnimation.delegate = new AnimationDelegate().initWithCallbacks(
      animationDidStartCallback,
      animationDidStopFinishedCallback
    );
    this.ripple.layer.transform = CATransform3DScale(CATransform3DIdentity, toScale, toScale, 0);
    this.ripple.layer.addAnimationForKey(scaleAnimation, 'scale');
  }

  /**
   * Cancel the current ripple scale animation
   */
  cancelScaleRippleAnimation() {
    this.ripple.layer.removeAnimationForKey('scale');
  }

  /**
   * Animate the current ripple's alpha value
   * @param fromAlpha
   * @param toAlpha
   * @param duration
   * @param animationDidStopFinishedCallback
   * @param animationDidStartCallback
   */
  animateFadeRipple(
    fromAlpha: number,
    toAlpha: number,
    duration: number,
    delay: number,
    animationDidStopFinishedCallback = (anim, flag) => {},
    animationDidStartCallback = anim => {}
  ) {
    const fadeAnimation: CABasicAnimation = CABasicAnimation.animationWithKeyPath('opacity');
    fadeAnimation.fromValue = fromAlpha;
    fadeAnimation.toValue = toAlpha;
    if (delay > 0) {
      fadeAnimation.beginTime = CACurrentMediaTime() + delay;
    }
    fadeAnimation.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionEaseOut);
    fadeAnimation.duration = duration;
    const ripple = this.ripple;
    fadeAnimation.delegate = new AnimationDelegate().initWithCallbacks(anim => {
      ripple.layer.opacity = 0;
    }, animationDidStopFinishedCallback);
    this.ripple.layer.addAnimationForKey(fadeAnimation, 'fade');
  }

  /**
   * Cancel the current ripple fade animation
   */
  cancelFadeRippleAnimation() {
    this.ripple.layer.removeAnimationForKey('fade');
  }

  private tapFn: (args: TouchGestureEventData) => void;

  public onLoaded() {
    super.onLoaded();

    const nativeView: UIView = this.ios;
    nativeView.clipsToBounds = true;

    this.tapFn = (args: TouchGestureEventData) => {
      this.updateRipple(args.getX(), args.getY(), args.action);
    };
    this.on(GestureTypes.touch, this.tapFn);
  }

  public onUnloaded() {
    super.onUnloaded();

    this.off(GestureTypes.touch, this.tapFn);
  }
}
