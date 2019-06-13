import * as tslib_1 from "tslib";
import { Component, HostListener } from '@angular/core';
import { NgxEditorComponent } from '../ngx-editor.component';
let NgxGrippieComponent = class NgxGrippieComponent {
    /**
     * Constructor
     *
     * @param _editorComponent Editor component
     */
    constructor(_editorComponent) {
        this._editorComponent = _editorComponent;
        /** previous value befor resizing the editor */
        this.oldY = 0;
        /** set to true on mousedown event */
        this.grabber = false;
    }
    /**
     *
     * @param event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     */
    onMouseMove(event) {
        if (!this.grabber) {
            return;
        }
        this._editorComponent.resizeTextArea(event.clientY - this.oldY);
        this.oldY = event.clientY;
    }
    /**
     *
     * @param event Mouseevent
     *
     * set the grabber to false on mouse up action
     */
    onMouseUp(event) {
        this.grabber = false;
    }
    onResize(event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    }
};
tslib_1.__decorate([
    HostListener('document:mousemove', ['$event']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [MouseEvent]),
    tslib_1.__metadata("design:returntype", void 0)
], NgxGrippieComponent.prototype, "onMouseMove", null);
tslib_1.__decorate([
    HostListener('document:mouseup', ['$event']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [MouseEvent]),
    tslib_1.__metadata("design:returntype", void 0)
], NgxGrippieComponent.prototype, "onMouseUp", null);
tslib_1.__decorate([
    HostListener('mousedown', ['$event']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [MouseEvent, Function]),
    tslib_1.__metadata("design:returntype", void 0)
], NgxGrippieComponent.prototype, "onResize", null);
NgxGrippieComponent = tslib_1.__decorate([
    Component({
        selector: 'app-ngx-grippie',
        template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
        styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
    }),
    tslib_1.__metadata("design:paramtypes", [NgxEditorComponent])
], NgxGrippieComponent);
export { NgxGrippieComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdyaXBwaWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFRN0QsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFTOUI7Ozs7T0FJRztJQUNILFlBQW9CLGdCQUFvQztRQUFwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9CO1FBVnhELCtDQUErQztRQUMvQyxTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ1QscUNBQXFDO1FBQ3JDLFlBQU8sR0FBRyxLQUFLLENBQUM7SUFPNEMsQ0FBQztJQUU3RDs7Ozs7T0FLRztJQUM2QyxXQUFXLENBQUMsS0FBaUI7UUFFM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQzJDLFNBQVMsQ0FBQyxLQUFpQjtRQUN2RSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRXNDLFFBQVEsQ0FBQyxLQUFpQixFQUFFLE9BQWtCO1FBQ25GLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUMxQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztDQUVGLENBQUE7QUExQmlEO0lBQS9DLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs2Q0FBb0IsVUFBVTs7c0RBUTVFO0FBUTZDO0lBQTdDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs2Q0FBa0IsVUFBVTs7b0RBRXhFO0FBRXNDO0lBQXRDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7NkNBQWlCLFVBQVUsRUFBWSxRQUFROzttREFJcEY7QUE5Q1UsbUJBQW1CO0lBTi9CLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsK3ZCQUEyQzs7S0FFNUMsQ0FBQzs2Q0FnQnNDLGtCQUFrQjtHQWQ3QyxtQkFBbUIsQ0FnRC9CO1NBaERZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZ3JpcHBpZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcblxuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKiBwcmV2aW91cyB2YWx1ZSBiZWZvciByZXNpemluZyB0aGUgZWRpdG9yICovXG4gIG9sZFkgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXG4gIGdyYWJiZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSkgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIGlmICghdGhpcy5ncmFiYmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZWRpdG9yQ29tcG9uZW50LnJlc2l6ZVRleHRBcmVhKGV2ZW50LmNsaWVudFkgLSB0aGlzLm9sZFkpO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IE1vdXNlZXZlbnRcbiAgICpcbiAgICogc2V0IHRoZSBncmFiYmVyIHRvIGZhbHNlIG9uIG1vdXNlIHVwIGFjdGlvblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcsIFsnJGV2ZW50J10pIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuZ3JhYmJlciA9IGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSkgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHJlc2l6ZXI/OiBGdW5jdGlvbikge1xuICAgIHRoaXMuZ3JhYmJlciA9IHRydWU7XG4gICAgdGhpcy5vbGRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbn1cbiJdfQ==