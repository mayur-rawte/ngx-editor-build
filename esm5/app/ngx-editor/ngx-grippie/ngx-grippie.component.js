/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, HostListener } from '@angular/core';
import { NgxEditorComponent } from '../ngx-editor.component';
var NgxGrippieComponent = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param _editorComponent Editor component
     */
    function NgxGrippieComponent(_editorComponent) {
        this._editorComponent = _editorComponent;
        /**
         * previous value befor resizing the editor
         */
        this.oldY = 0;
        /**
         * set to true on mousedown event
         */
        this.grabber = false;
    }
    /**
     *
     * @param event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     */
    /**
     *
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseMove = /**
     *
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
     */
    function (event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    };
    /**
     *
     * @param event Mouseevent
     *
     * set the grabber to false on mouse up action
     */
    /**
     *
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    NgxGrippieComponent.prototype.onMouseUp = /**
     *
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    function (event) {
        this.grabber = false;
    };
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    NgxGrippieComponent.prototype.onResize = /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    function (event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    };
    NgxGrippieComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-ngx-grippie',
                    template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                    styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
                }] }
    ];
    /** @nocollapse */
    NgxGrippieComponent.ctorParameters = function () { return [
        { type: NgxEditorComponent }
    ]; };
    NgxGrippieComponent.propDecorators = {
        onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
        onMouseUp: [{ type: HostListener, args: ['document:mouseup', ['$event'],] }],
        onResize: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
    };
    return NgxGrippieComponent;
}());
export { NgxGrippieComponent };
if (false) {
    /**
     * height of the editor
     * @type {?}
     */
    NgxGrippieComponent.prototype.height;
    /**
     * previous value befor resizing the editor
     * @type {?}
     */
    NgxGrippieComponent.prototype.oldY;
    /**
     * set to true on mousedown event
     * @type {?}
     */
    NgxGrippieComponent.prototype.grabber;
    /** @type {?} */
    NgxGrippieComponent.prototype._editorComponent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdyaXBwaWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFN0Q7SUFlRTs7OztPQUlHO0lBQ0gsNkJBQW9CLGdCQUFvQztRQUFwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9COzs7O1FBVHhELFNBQUksR0FBRyxDQUFDLENBQUM7Ozs7UUFFVCxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBTzRDLENBQUM7SUFFN0Q7Ozs7O09BS0c7Ozs7Ozs7O0lBQzZDLHlDQUFXOzs7Ozs7O0lBQTNELFVBQTRELEtBQWlCO1FBRTNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDMkMsdUNBQVM7Ozs7Ozs7SUFBdkQsVUFBd0QsS0FBaUI7UUFDdkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7Ozs7O0lBRXNDLHNDQUFROzs7OztJQUEvQyxVQUFnRCxLQUFpQixFQUFFLE9BQWtCO1FBQ25GLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUMxQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQzs7Z0JBcERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQiwrdkJBQTJDOztpQkFFNUM7Ozs7Z0JBTlEsa0JBQWtCOzs7OEJBOEJ4QixZQUFZLFNBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBZ0I3QyxZQUFZLFNBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLENBQUM7MkJBSTNDLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBTXZDLDBCQUFDO0NBQUEsQUF0REQsSUFzREM7U0FoRFksbUJBQW1COzs7Ozs7SUFHOUIscUNBQWU7Ozs7O0lBRWYsbUNBQVM7Ozs7O0lBRVQsc0NBQWdCOztJQU9KLCtDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZ3JpcHBpZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcblxuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKiBwcmV2aW91cyB2YWx1ZSBiZWZvciByZXNpemluZyB0aGUgZWRpdG9yICovXG4gIG9sZFkgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXG4gIGdyYWJiZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSkgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIGlmICghdGhpcy5ncmFiYmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZWRpdG9yQ29tcG9uZW50LnJlc2l6ZVRleHRBcmVhKGV2ZW50LmNsaWVudFkgLSB0aGlzLm9sZFkpO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IE1vdXNlZXZlbnRcbiAgICpcbiAgICogc2V0IHRoZSBncmFiYmVyIHRvIGZhbHNlIG9uIG1vdXNlIHVwIGFjdGlvblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcsIFsnJGV2ZW50J10pIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuZ3JhYmJlciA9IGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSkgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHJlc2l6ZXI/OiBGdW5jdGlvbikge1xuICAgIHRoaXMuZ3JhYmJlciA9IHRydWU7XG4gICAgdGhpcy5vbGRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbn1cbiJdfQ==