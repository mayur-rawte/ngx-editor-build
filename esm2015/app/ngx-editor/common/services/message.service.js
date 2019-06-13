import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/** time in which the message has to be cleared */
const DURATION = 7000;
let MessageService = class MessageService {
    constructor() {
        /** variable to hold the user message */
        this.message = new Subject();
    }
    /** returns the message sent by the editor */
    getMessage() {
        return this.message.asObservable();
    }
    /**
     * sends message to the editor
     *
     * @param message message to be sent
     */
    sendMessage(message) {
        this.message.next(message);
        this.clearMessageIn(DURATION);
        return;
    }
    /**
     * a short interval to clear message
     *
     * @param milliseconds time in seconds in which the message has to be cleared
     */
    clearMessageIn(milliseconds) {
        setTimeout(() => {
            this.message.next(undefined);
        }, milliseconds);
        return;
    }
};
MessageService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], MessageService);
export { MessageService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU3QixrREFBa0Q7QUFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBR3RCLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWM7SUFLekI7UUFIQSx3Q0FBd0M7UUFDaEMsWUFBTyxHQUFvQixJQUFJLE9BQU8sRUFBRSxDQUFDO0lBR2pELENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxPQUFlO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsT0FBTztJQUNULENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssY0FBYyxDQUFDLFlBQW9CO1FBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDakIsT0FBTztJQUNULENBQUM7Q0FFRixDQUFBO0FBcENZLGNBQWM7SUFEMUIsVUFBVSxFQUFFOztHQUNBLGNBQWMsQ0FvQzFCO1NBcENZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqIHRpbWUgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWQgKi9cbmNvbnN0IERVUkFUSU9OID0gNzAwMDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcblxuICAvKiogdmFyaWFibGUgdG8gaG9sZCB0aGUgdXNlciBtZXNzYWdlICovXG4gIHByaXZhdGUgbWVzc2FnZTogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8qKiByZXR1cm5zIHRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIGVkaXRvciAqL1xuICBnZXRNZXNzYWdlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kcyBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIG1lc3NhZ2UgbWVzc2FnZSB0byBiZSBzZW50XG4gICAqL1xuICBzZW5kTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLm1lc3NhZ2UubmV4dChtZXNzYWdlKTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZUluKERVUkFUSU9OKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogYSBzaG9ydCBpbnRlcnZhbCB0byBjbGVhciBtZXNzYWdlXG4gICAqXG4gICAqIEBwYXJhbSBtaWxsaXNlY29uZHMgdGltZSBpbiBzZWNvbmRzIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkXG4gICAqL1xuICBwcml2YXRlIGNsZWFyTWVzc2FnZUluKG1pbGxpc2Vjb25kczogbnVtYmVyKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLm1lc3NhZ2UubmV4dCh1bmRlZmluZWQpO1xuICAgIH0sIG1pbGxpc2Vjb25kcyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbn1cbiJdfQ==