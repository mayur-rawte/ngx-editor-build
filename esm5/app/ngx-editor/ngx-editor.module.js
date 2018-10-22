/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap';
import { NgxEditorComponent } from './ngx-editor.component';
import { NgxGrippieComponent } from './ngx-grippie/ngx-grippie.component';
import { NgxEditorMessageComponent } from './ngx-editor-message/ngx-editor-message.component';
import { NgxEditorToolbarComponent } from './ngx-editor-toolbar/ngx-editor-toolbar.component';
import { MessageService } from './common/services/message.service';
import { CommandExecutorService } from './common/services/command-executor.service';
var NgxEditorModule = /** @class */ (function () {
    function NgxEditorModule() {
    }
    NgxEditorModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule.forRoot()],
                    declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                    exports: [NgxEditorComponent, PopoverModule],
                    providers: [CommandExecutorService, MessageService]
                },] }
    ];
    return NgxEditorModule;
}());
export { NgxEditorModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUVwRjtJQUFBO0lBTytCLENBQUM7O2dCQVAvQixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ2xGLFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLHlCQUF5QixDQUFDO29CQUM3RyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUM7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLGNBQWMsQ0FBQztpQkFDcEQ7O0lBRThCLHNCQUFDO0NBQUEsQUFQaEMsSUFPZ0M7U0FBbkIsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUG9wb3Zlck1vZHVsZSB9IGZyb20gJ25neC1ib290c3RyYXAnO1xuaW1wb3J0IHsgTmd4RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hHcmlwcGllQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ3JpcHBpZS9uZ3gtZ3JpcHBpZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci1tZXNzYWdlL25neC1lZGl0b3ItbWVzc2FnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci10b29sYmFyL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBQb3BvdmVyTW9kdWxlLmZvclJvb3QoKV0sXG4gIGRlY2xhcmF0aW9uczogW05neEVkaXRvckNvbXBvbmVudCwgTmd4R3JpcHBpZUNvbXBvbmVudCwgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCwgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hFZGl0b3JDb21wb25lbnQsIFBvcG92ZXJNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLCBNZXNzYWdlU2VydmljZV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JNb2R1bGUgeyB9XG4iXX0=