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
const DURATION = 7000;
export class MessageService {
    constructor() {
        /**
         * variable to hold the user message
         */
        this.message = new Subject();
    }
    /**
     * returns the message sent by the editor
     * @return {?}
     */
    getMessage() {
        return this.message.asObservable();
    }
    /**
     * sends message to the editor
     *
     * @param {?} message message to be sent
     * @return {?}
     */
    sendMessage(message) {
        this.message.next(message);
        this.clearMessageIn(DURATION);
        return;
    }
    /**
     * a short interval to clear message
     *
     * @param {?} milliseconds time in seconds in which the message has to be cleared
     * @return {?}
     */
    clearMessageIn(milliseconds) {
        setTimeout(() => {
            this.message.next(undefined);
        }, milliseconds);
        return;
    }
}
MessageService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MessageService.ctorParameters = () => [];
if (false) {
    /**
     * variable to hold the user message
     * @type {?}
     */
    MessageService.prototype.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7TUFHdkIsUUFBUSxHQUFHLElBQUk7QUFHckIsTUFBTSxPQUFPLGNBQWM7SUFLekI7Ozs7UUFGUSxZQUFPLEdBQW9CLElBQUksT0FBTyxFQUFFLENBQUM7SUFHakQsQ0FBQzs7Ozs7SUFHRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JDLENBQUM7Ozs7Ozs7SUFPRCxXQUFXLENBQUMsT0FBZTtRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLE9BQU87SUFDVCxDQUFDOzs7Ozs7O0lBT08sY0FBYyxDQUFDLFlBQW9CO1FBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDakIsT0FBTztJQUNULENBQUM7OztZQW5DRixVQUFVOzs7Ozs7Ozs7SUFJVCxpQ0FBaUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIHRpbWUgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWQgKi9cbmNvbnN0IERVUkFUSU9OID0gNzAwMDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcblxuICAvKiogdmFyaWFibGUgdG8gaG9sZCB0aGUgdXNlciBtZXNzYWdlICovXG4gIHByaXZhdGUgbWVzc2FnZTogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIGVkaXRvciAqL1xuICBnZXRNZXNzYWdlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kcyBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2UgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBzZW5kTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1lc3NhZ2UubmV4dChtZXNzYWdlKTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZUluKERVUkFUSU9OKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogYSBzaG9ydCBpbnRlcnZhbCB0byBjbGVhciBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHMgdGltZSBpbiBzZWNvbmRzIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkXG4gICAqL1xuICBwcml2YXRlIGNsZWFyTWVzc2FnZUluKG1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2UubmV4dCh1bmRlZmluZWQpO1xuICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbn1cbiJdfQ==