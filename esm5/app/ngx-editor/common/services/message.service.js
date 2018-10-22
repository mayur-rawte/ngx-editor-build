/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * time in which the message has to be cleared
 * @type {?}
 */
var DURATION = 7000;
var MessageService = /** @class */ (function () {
    function MessageService() {
        /**
         * variable to hold the user message
         */
        this.message = new Subject();
    }
    /** returns the message sent by the editor */
    /**
     * returns the message sent by the editor
     * @return {?}
     */
    MessageService.prototype.getMessage = /**
     * returns the message sent by the editor
     * @return {?}
     */
    function () {
        return this.message.asObservable();
    };
    /**
     * sends message to the editor
     *
     * @param message message to be sent
     */
    /**
     * sends message to the editor
     *
     * @param {?} message message to be sent
     * @return {?}
     */
    MessageService.prototype.sendMessage = /**
     * sends message to the editor
     *
     * @param {?} message message to be sent
     * @return {?}
     */
    function (message) {
        this.message.next(message);
        this.clearMessageIn(DURATION);
        return;
    };
    /**
     * a short interval to clear message
     *
     * @param milliseconds time in seconds in which the message has to be cleared
     */
    /**
     * a short interval to clear message
     *
     * @param {?} milliseconds time in seconds in which the message has to be cleared
     * @return {?}
     */
    MessageService.prototype.clearMessageIn = /**
     * a short interval to clear message
     *
     * @param {?} milliseconds time in seconds in which the message has to be cleared
     * @return {?}
     */
    function (milliseconds) {
        var _this = this;
        setTimeout(function () {
            _this.message.next(undefined);
        }, milliseconds);
        return;
    };
    MessageService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MessageService.ctorParameters = function () { return []; };
    return MessageService;
}());
export { MessageService };
if (false) {
    /**
     * variable to hold the user message
     * @type {?}
     */
    MessageService.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7SUFHdkIsUUFBUSxHQUFHLElBQUk7QUFFckI7SUFNRTs7OztRQUZRLFlBQU8sR0FBb0IsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUdqRCxDQUFDO0lBRUQsNkNBQTZDOzs7OztJQUM3QyxtQ0FBVTs7OztJQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7O0lBQ0gsb0NBQVc7Ozs7OztJQUFYLFVBQVksT0FBZTtRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLE9BQU87SUFDVCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNLLHVDQUFjOzs7Ozs7SUFBdEIsVUFBdUIsWUFBb0I7UUFBM0MsaUJBS0M7UUFKQyxVQUFVLENBQUM7WUFDVCxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDakIsT0FBTztJQUNULENBQUM7O2dCQW5DRixVQUFVOzs7O0lBcUNYLHFCQUFDO0NBQUEsQUFyQ0QsSUFxQ0M7U0FwQ1ksY0FBYzs7Ozs7O0lBR3pCLGlDQUFpRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKiogdGltZSBpbiB3aGljaCB0aGUgbWVzc2FnZSBoYXMgdG8gYmUgY2xlYXJlZCAqL1xuY29uc3QgRFVSQVRJT04gPSA3MDAwO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZVNlcnZpY2Uge1xuXG4gIC8qKiB2YXJpYWJsZSB0byBob2xkIHRoZSB1c2VyIG1lc3NhZ2UgKi9cbiAgcHJpdmF0ZSBtZXNzYWdlOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqIHJldHVybnMgdGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgZWRpdG9yICovXG4gIGdldE1lc3NhZ2UoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmRzIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZSBtZXNzYWdlIHRvIGJlIHNlbnRcbiAgICovXG4gIHNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubWVzc2FnZS5uZXh0KG1lc3NhZ2UpO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlSW4oRFVSQVRJT04pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBhIHNob3J0IGludGVydmFsIHRvIGNsZWFyIG1lc3NhZ2VcbiAgICpcbiAgICogQHBhcmFtIG1pbGxpc2Vjb25kcyB0aW1lIGluIHNlY29uZHMgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWRcbiAgICovXG4gIHByaXZhdGUgY2xlYXJNZXNzYWdlSW4obWlsbGlzZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZS5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSwgbWlsbGlzZWNvbmRzKTtcbiAgICByZXR1cm47XG4gIH1cblxufVxuIl19