import { firstFocusableElement } from './utilities.js';
import { merge } from './updates.js';


/**
 * Delegates a component's focus to its first focusable shadow element.
 * 
 * This mixin serves as a polyfill for the standard `delegatesFocus` shadow
 * root property. As of April 2019, that property is only supported in Chrome.
 * 
 * @module DelegateFocusMixin
 */
export default function DelegateFocusMixin(Base) {

  // The class prototype added by the mixin.
  class DelegateFocus extends Base {

    /**
     * Returns true if the component is delegating its focus.
     * 
     * A component using `DelegateFocusMixin` will always have this property be
     * true unless a class takes measures to override it.
     * 
     * @type {boolean}
     * @default true
     */
    get delegatesFocus() {
      return true;
    }

    // If someone tries to put the focus on us, delegate the focus to the first
    // focusable element in the composed tree below our shadow root.
    focus(focusOptions) {
      if (this.shadowRoot.delegatesFocus) {
        // Native support for delegatesFocus, so don't need to do anything.
        super.focus(focusOptions);
        return;
      }
      const focusElement = firstFocusableElement(this.shadowRoot);
      if (focusElement) {
        focusElement.focus(focusOptions);
      }
    }

    get updates() {
      // The delegatesFocus spec says that the focus outline should be shown on
      // both the host and the focused subelement — which seems confusing and
      // (in our opinion) looks ugly. If the browser supports delegatesFocus we
      // suppress the host focus outline.
      const updates = {}
      if (this.shadowRoot.delegatesFocus) {
        updates.style = {
          outline: 'none'
        };
      }
      return merge(super.updates, updates);
    }

  }

  return DelegateFocus;

}
