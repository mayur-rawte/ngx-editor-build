import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MessageService } from '../common/services/message.service';
let NgxEditorMessageComponent = class NgxEditorMessageComponent {
    /**
     * @param _messageService service to send message to the editor
     */
    constructor(_messageService) {
        this._messageService = _messageService;
        /** property that holds the message to be displayed on the editor */
        this.ngxMessage = undefined;
        this._messageService.getMessage().subscribe((message) => this.ngxMessage = message);
    }
    /**
     * clears editor message
     */
    clearMessage() {
        this.ngxMessage = undefined;
        return;
    }
};
NgxEditorMessageComponent = tslib_1.__decorate([
    Component({
        selector: 'app-ngx-editor-message',
        template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
        styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
    }),
    tslib_1.__metadata("design:paramtypes", [MessageService])
], NgxEditorMessageComponent);
export { NgxEditorMessageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFRcEUsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFLcEM7O09BRUc7SUFDSCxZQUFvQixlQUErQjtRQUEvQixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFObkQsb0VBQW9FO1FBQ3BFLGVBQVUsR0FBRyxTQUFTLENBQUM7UUFNckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFlLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWTtRQUNWLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLE9BQU87SUFDVCxDQUFDO0NBQ0YsQ0FBQTtBQW5CWSx5QkFBeUI7SUFOckMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHdCQUF3QjtRQUNsQywrSEFBa0Q7O0tBRW5ELENBQUM7NkNBVXFDLGNBQWM7R0FSeEMseUJBQXlCLENBbUJyQztTQW5CWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItbWVzc2FnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQge1xuXG4gIC8qKiBwcm9wZXJ0eSB0aGF0IGhvbGRzIHRoZSBtZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yICovXG4gIG5neE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XG4gICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZ2V0TWVzc2FnZSgpLnN1YnNjcmliZSgobWVzc2FnZTogc3RyaW5nKSA9PiB0aGlzLm5neE1lc3NhZ2UgPSBtZXNzYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhcnMgZWRpdG9yIG1lc3NhZ2VcbiAgICovXG4gIGNsZWFyTWVzc2FnZSgpOiB2b2lkIHtcbiAgICB0aGlzLm5neE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuO1xuICB9XG59XG4iXX0=