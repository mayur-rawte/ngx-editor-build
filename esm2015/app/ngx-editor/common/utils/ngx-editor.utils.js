/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * enable or disable toolbar based on configuration
 *
 * @param {?} value toolbar item
 * @param {?} toolbar toolbar configuration object
 * @return {?}
 */
export function canEnableToolbarOptions(value, toolbar) {
    if (value) {
        if (toolbar['length'] === 0) {
            return true;
        }
        else {
            /** @type {?} */
            const found = toolbar.filter(array => {
                return array.indexOf(value) !== -1;
            });
            return found.length ? true : false;
        }
    }
    else {
        return false;
    }
}
/**
 * set editor configuration
 *
 * @param {?} value configuration via [config] property
 * @param {?} ngxEditorConfig default editor configuration
 * @param {?} input direct configuration inputs via directives
 * @return {?}
 */
export function getEditorConfiguration(value, ngxEditorConfig, input) {
    for (const i in ngxEditorConfig) {
        if (i) {
            if (input[i] !== undefined) {
                value[i] = input[i];
            }
            if (!value.hasOwnProperty(i)) {
                value[i] = ngxEditorConfig[i];
            }
        }
    }
    return value;
}
/**
 * return vertical if the element is the resizer property is set to basic
 *
 * @param {?} resizer type of resizer, either basic or stack
 * @return {?}
 */
export function canResize(resizer) {
    if (resizer === 'basic') {
        return 'vertical';
    }
    return false;
}
/**
 * save selection when the editor is focussed out
 * @return {?}
 */
export function saveSelection() {
    if (window.getSelection) {
        /** @type {?} */
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    else if (document.getSelection && document.createRange) {
        return document.createRange();
    }
    return null;
}
/**
 * restore selection when the editor is focussed in
 *
 * @param {?} range saved selection when the editor is focussed out
 * @return {?}
 */
export function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            /** @type {?} */
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return true;
        }
        else if (document.getSelection && range.select) {
            range.select();
            return true;
        }
    }
    else {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxLQUFhLEVBQUUsT0FBWTtJQUUvRCxJQUFJLEtBQUssRUFBRTtRQUVQLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQztTQUNmO2FBQU07O2tCQUVHLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDO1lBRUYsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUN0QztLQUNKO1NBQU07UUFDSCxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNMLENBQUM7Ozs7Ozs7OztBQVNELE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxLQUFVLEVBQUUsZUFBb0IsRUFBRSxLQUFVO0lBRS9FLEtBQUssTUFBTSxDQUFDLElBQUksZUFBZSxFQUFFO1FBQzdCLElBQUksQ0FBQyxFQUFFO1lBRUgsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUN4QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakM7U0FDSjtLQUNKO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQzs7Ozs7OztBQU9ELE1BQU0sVUFBVSxTQUFTLENBQUMsT0FBZTtJQUNyQyxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7UUFDckIsT0FBTyxVQUFVLENBQUM7S0FDckI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDOzs7OztBQUtELE1BQU0sVUFBVSxhQUFhO0lBQ3pCLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTs7Y0FDZixHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUNsQyxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7S0FDSjtTQUFNLElBQUksUUFBUSxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3RELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQzs7Ozs7OztBQU9ELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxLQUFLO0lBQ2xDLElBQUksS0FBSyxFQUFFO1FBQ1AsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFOztrQkFDZixHQUFHLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUNqQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQztTQUNmO2FBQU0sSUFBSSxRQUFRLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDOUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO1NBQU07UUFDSCxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGVuYWJsZSBvciBkaXNhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0b29sYmFyIGl0ZW1cbiAqIEBwYXJhbSB0b29sYmFyIHRvb2xiYXIgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlOiBzdHJpbmcsIHRvb2xiYXI6IGFueSk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHRvb2xiYXJbJ2xlbmd0aCddID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0b29sYmFyLmZpbHRlcihhcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBzZXQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgY29uZmlndXJhdGlvbiB2aWEgW2NvbmZpZ10gcHJvcGVydHlcbiAqIEBwYXJhbSBuZ3hFZGl0b3JDb25maWcgZGVmYXVsdCBlZGl0b3IgY29uZmlndXJhdGlvblxuICogQHBhcmFtIGlucHV0IGRpcmVjdCBjb25maWd1cmF0aW9uIGlucHV0cyB2aWEgZGlyZWN0aXZlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih2YWx1ZTogYW55LCBuZ3hFZGl0b3JDb25maWc6IGFueSwgaW5wdXQ6IGFueSk6IGFueSB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbmd4RWRpdG9yQ29uZmlnKSB7XG4gICAgICAgIGlmIChpKSB7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dFtpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbaV0gPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW2ldID0gbmd4RWRpdG9yQ29uZmlnW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIHJldHVybiB2ZXJ0aWNhbCBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcmVzaXplciBwcm9wZXJ0eSBpcyBzZXQgdG8gYmFzaWNcbiAqXG4gKiBAcGFyYW0gcmVzaXplciB0eXBlIG9mIHJlc2l6ZXIsIGVpdGhlciBiYXNpYyBvciBzdGFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVzaXplKHJlc2l6ZXI6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHJlc2l6ZXIgPT09ICdiYXNpYycpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzYXZlIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgb3V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2VsZWN0aW9uKCk6IGFueSB7XG4gICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoc2VsLmdldFJhbmdlQXQgJiYgc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIGRvY3VtZW50LmNyZWF0ZVJhbmdlKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiByZXN0b3JlIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgaW5cbiAqXG4gKiBAcGFyYW0gcmFuZ2Ugc2F2ZWQgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc3RvcmVTZWxlY3Rpb24ocmFuZ2UpOiBib29sZWFuIHtcbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24gJiYgcmFuZ2Uuc2VsZWN0KSB7XG4gICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuIl19