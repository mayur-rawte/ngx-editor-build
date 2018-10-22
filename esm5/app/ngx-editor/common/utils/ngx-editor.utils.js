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
            var found = toolbar.filter(function (array) {
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
    for (var i in ngxEditorConfig) {
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
        var sel = window.getSelection();
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
            var sel = window.getSelection();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51dGlscy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxLQUFhLEVBQUUsT0FBWTtJQUUvRCxJQUFJLEtBQUssRUFBRTtRQUVQLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQztTQUNmO2FBQU07O2dCQUVHLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSztnQkFDOUIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztZQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDdEM7S0FDSjtTQUFNO1FBQ0gsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDTCxDQUFDOzs7Ozs7Ozs7QUFTRCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsS0FBVSxFQUFFLGVBQW9CLEVBQUUsS0FBVTtJQUUvRSxLQUFLLElBQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUM3QixJQUFJLENBQUMsRUFBRTtZQUVILElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMxQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0o7S0FDSjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsU0FBUyxDQUFDLE9BQWU7SUFDckMsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO1FBQ3JCLE9BQU8sVUFBVSxDQUFDO0tBQ3JCO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQzs7Ozs7QUFLRCxNQUFNLFVBQVUsYUFBYTtJQUN6QixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7O1lBQ2YsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakMsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDbEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCO0tBQ0o7U0FBTSxJQUFJLFFBQVEsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUN0RCxPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNqQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsS0FBSztJQUNsQyxJQUFJLEtBQUssRUFBRTtRQUNQLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTs7Z0JBQ2YsR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDakMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNLElBQUksUUFBUSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQzlDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNmLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDSjtTQUFNO1FBQ0gsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBlbmFibGUgb3IgZGlzYWJsZSB0b29sYmFyIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgdG9vbGJhciBpdGVtXG4gKiBAcGFyYW0gdG9vbGJhciB0b29sYmFyIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZTogc3RyaW5nLCB0b29sYmFyOiBhbnkpOiBib29sZWFuIHtcblxuICAgIGlmICh2YWx1ZSkge1xuXG4gICAgICAgIGlmICh0b29sYmFyWydsZW5ndGgnXSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gdG9vbGJhci5maWx0ZXIoYXJyYXkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogc2V0IGVkaXRvciBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIGNvbmZpZ3VyYXRpb24gdmlhIFtjb25maWddIHByb3BlcnR5XG4gKiBAcGFyYW0gbmd4RWRpdG9yQ29uZmlnIGRlZmF1bHQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSBpbnB1dCBkaXJlY3QgY29uZmlndXJhdGlvbiBpbnB1dHMgdmlhIGRpcmVjdGl2ZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRvckNvbmZpZ3VyYXRpb24odmFsdWU6IGFueSwgbmd4RWRpdG9yQ29uZmlnOiBhbnksIGlucHV0OiBhbnkpOiBhbnkge1xuXG4gICAgZm9yIChjb25zdCBpIGluIG5neEVkaXRvckNvbmZpZykge1xuICAgICAgICBpZiAoaSkge1xuXG4gICAgICAgICAgICBpZiAoaW5wdXRbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlW2ldID0gaW5wdXRbaV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsdWUuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtpXSA9IG5neEVkaXRvckNvbmZpZ1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiByZXR1cm4gdmVydGljYWwgaWYgdGhlIGVsZW1lbnQgaXMgdGhlIHJlc2l6ZXIgcHJvcGVydHkgaXMgc2V0IHRvIGJhc2ljXG4gKlxuICogQHBhcmFtIHJlc2l6ZXIgdHlwZSBvZiByZXNpemVyLCBlaXRoZXIgYmFzaWMgb3Igc3RhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblJlc2l6ZShyZXNpemVyOiBzdHJpbmcpOiBhbnkge1xuICAgIGlmIChyZXNpemVyID09PSAnYmFzaWMnKSB7XG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogc2F2ZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVNlbGVjdGlvbigpOiBhbnkge1xuICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKHNlbC5nZXRSYW5nZUF0ICYmIHNlbC5yYW5nZUNvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsLmdldFJhbmdlQXQoMCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiBkb2N1bWVudC5jcmVhdGVSYW5nZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogcmVzdG9yZSBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIGluXG4gKlxuICogQHBhcmFtIHJhbmdlIHNhdmVkIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgb3V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlU2VsZWN0aW9uKHJhbmdlKTogYm9vbGVhbiB7XG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIHJhbmdlLnNlbGVjdCkge1xuICAgICAgICAgICAgcmFuZ2Uuc2VsZWN0KCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbiJdfQ==