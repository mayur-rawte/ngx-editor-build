import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MessageService } from '../common/services/message.service';
var NgxEditorMessageComponent = /** @class */ (function () {
    /**
     * @param _messageService service to send message to the editor
     */
    function NgxEditorMessageComponent(_messageService) {
        var _this = this;
        this._messageService = _messageService;
        /** property that holds the message to be displayed on the editor */
        this.ngxMessage = undefined;
        this._messageService.getMessage().subscribe(function (message) { return _this.ngxMessage = message; });
    }
    /**
     * clears editor message
     */
    NgxEditorMessageComponent.prototype.clearMessage = function () {
        this.ngxMessage = undefined;
        return;
    };
    NgxEditorMessageComponent = tslib_1.__decorate([
        Component({
            selector: 'app-ngx-editor-message',
            template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
            styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
        }),
        tslib_1.__metadata("design:paramtypes", [MessageService])
    ], NgxEditorMessageComponent);
    return NgxEditorMessageComponent;
}());
export { NgxEditorMessageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFRcEU7SUFLRTs7T0FFRztJQUNILG1DQUFvQixlQUErQjtRQUFuRCxpQkFFQztRQUZtQixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFObkQsb0VBQW9FO1FBQ3BFLGVBQVUsR0FBRyxTQUFTLENBQUM7UUFNckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQyxPQUFlLElBQUssT0FBQSxLQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFRDs7T0FFRztJQUNILGdEQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixPQUFPO0lBQ1QsQ0FBQztJQWxCVSx5QkFBeUI7UUFOckMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQywrSEFBa0Q7O1NBRW5ELENBQUM7aURBVXFDLGNBQWM7T0FSeEMseUJBQXlCLENBbUJyQztJQUFELGdDQUFDO0NBQUEsQUFuQkQsSUFtQkM7U0FuQlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yLW1lc3NhZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IHtcblxuICAvKiogcHJvcGVydHkgdGhhdCBob2xkcyB0aGUgbWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQgb24gdGhlIGVkaXRvciAqL1xuICBuZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xuICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLmdldE1lc3NhZ2UoKS5zdWJzY3JpYmUoKG1lc3NhZ2U6IHN0cmluZykgPT4gdGhpcy5uZ3hNZXNzYWdlID0gbWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYXJzIGVkaXRvciBtZXNzYWdlXG4gICAqL1xuICBjbGVhck1lc3NhZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5uZ3hNZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIHJldHVybjtcbiAgfVxufVxuIl19