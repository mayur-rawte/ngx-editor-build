import * as tslib_1 from "tslib";
import { Component, Input, Output, ViewChild, EventEmitter, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import { CommandExecutorService } from './common/services/command-executor.service';
import { MessageService } from './common/services/message.service';
import { ngxEditorConfig, codeMirrorConfig } from './common/ngx-editor.defaults';
import * as Utils from './common/utils/ngx-editor.utils';
var NgxEditorComponent = /** @class */ (function () {
    /**
     * @param _messageService service to send message to the editor message component
     * @param _commandExecutor executes command from the toolbar
     * @param _renderer access and manipulate the dom element
     */
    function NgxEditorComponent(_messageService, _commandExecutor, _renderer) {
        this._messageService = _messageService;
        this._commandExecutor = _commandExecutor;
        this._renderer = _renderer;
        /**
         * The editor can be resized vertically.
         *
         * `basic` resizer enables the html5 reszier. Check here https://www.w3schools.com/cssref/css3_pr_resize.asp
         *
         * `stack` resizer enable a resizer that looks like as if in https://stackoverflow.com
         */
        this.resizer = 'stack';
        /**
         * The config property is a JSON object
         *
         * All avaibale inputs inputs can be provided in the configuration as JSON
         * inputs provided directly are considered as top priority
         */
        this.config = ngxEditorConfig;
        /** emits `blur` event when focused out from the textarea */
        this.blur = new EventEmitter();
        /** emits `focus` event when focused in to the textarea */
        this.focus = new EventEmitter();
        this.Utils = Utils;
        this.codeEditorMode = false;
        this.ngxCodeMirror = undefined;
    }
    NgxEditorComponent_1 = NgxEditorComponent;
    /**
     * events
     */
    NgxEditorComponent.prototype.onTextAreaFocus = function () {
        this.focus.emit('focus');
        return;
    };
    /** focus the text area when the editor is focussed */
    NgxEditorComponent.prototype.onEditorFocus = function () {
        this.textArea.nativeElement.focus();
    };
    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    NgxEditorComponent.prototype.onContentChange = function (html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
            this.togglePlaceholder(html);
        }
        return;
    };
    NgxEditorComponent.prototype.onTextAreaBlur = function () {
        /** save selection if focussed out */
        this._commandExecutor.savedSelection = Utils.saveSelection();
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        this.blur.emit('blur');
        return;
    };
    /**
     * resizing text area
     *
     * @param offsetY vertical height of the eidtable portion of the editor
     */
    NgxEditorComponent.prototype.resizeTextArea = function (offsetY) {
        var newHeight = parseInt(this.height, 10);
        newHeight += offsetY;
        this.height = newHeight + 'px';
        this.textArea.nativeElement.style.height = this.height;
        /**
         * update code-editor height only on editor mode
         */
        if (this.codeEditorMode) {
            this.ngxCodeMirror.setSize('100%', this.height);
        }
        return;
    };
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param commandName name of the command to be executed
     */
    NgxEditorComponent.prototype.executeCommand = function (commandName) {
        if (commandName === 'code') {
            this.toggleCodeEditor();
            return;
        }
        try {
            this._commandExecutor.execute(commandName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        return;
    };
    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    NgxEditorComponent.prototype.writeValue = function (value) {
        this.togglePlaceholder(value);
        if (value === null || value === undefined || value === '' || value === '<br>') {
            value = null;
        }
        this.refreshView(value);
    };
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    NgxEditorComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    NgxEditorComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    NgxEditorComponent.prototype.refreshView = function (value) {
        var normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    };
    /**
     * toggle between codeview and editor
     */
    NgxEditorComponent.prototype.toggleCodeEditor = function () {
        this.codeEditorMode = !this.codeEditorMode;
        if (this.codeEditorMode) {
            this.ngxCodeMirror = CodeMirror.fromTextArea(this.codeEditor.nativeElement, codeMirrorConfig);
            /** set value of the code editor */
            this.ngxCodeMirror.setValue(this.textArea.nativeElement.innerHTML);
            /** sets height of the code editor as same as the height of the textArea */
            this.ngxCodeMirror.setSize('100%', this.height);
        }
        else {
            /** remove/ destroy code editor */
            this.ngxCodeMirror.toTextArea();
            /** update the model value and html content on the contenteditable */
            this.refreshView(this.ngxCodeMirror.getValue());
            this.onContentChange(this.ngxCodeMirror.getValue());
        }
        return;
    };
    /**
     * toggles placeholder based on input string
     *
     * @param value A HTML string from the editor
     */
    NgxEditorComponent.prototype.togglePlaceholder = function (value) {
        if (!value || value === '<br>' || value === '') {
            this._renderer.addClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        else {
            this._renderer.removeClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        return;
    };
    /**
     * returns a json containing input params
     */
    NgxEditorComponent.prototype.getCollectiveParams = function () {
        return {
            editable: this.editable,
            spellcheck: this.spellcheck,
            placeholder: this.placeholder,
            translate: this.translate,
            height: this.height,
            minHeight: this.minHeight,
            width: this.width,
            minWidth: this.minWidth,
            enableToolbar: this.enableToolbar,
            showToolbar: this.showToolbar,
            imageEndPoint: this.imageEndPoint,
            toolbar: this.toolbar
        };
    };
    NgxEditorComponent.prototype.ngOnInit = function () {
        /**
         * set configuartion
         */
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    };
    var NgxEditorComponent_1;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NgxEditorComponent.prototype, "editable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NgxEditorComponent.prototype, "spellcheck", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "translate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "height", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "minHeight", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "width", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "minWidth", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "toolbar", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "resizer", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "config", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NgxEditorComponent.prototype, "showToolbar", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], NgxEditorComponent.prototype, "enableToolbar", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], NgxEditorComponent.prototype, "imageEndPoint", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], NgxEditorComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], NgxEditorComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        ViewChild('ngxTextArea', { static: true }),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "textArea", void 0);
    tslib_1.__decorate([
        ViewChild('ngxCodeEditor', { static: true }),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "codeEditor", void 0);
    tslib_1.__decorate([
        ViewChild('ngxWrapper', { static: true }),
        tslib_1.__metadata("design:type", Object)
    ], NgxEditorComponent.prototype, "ngxWrapper", void 0);
    NgxEditorComponent = NgxEditorComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'app-ngx-editor',
            template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" [hidden]=\"codeEditorMode\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n      [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\" (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <textarea [attr.placeholder]=\"placeholder || config['placeholder']\" [hidden]=\"true\" #ngxCodeEditor></textarea>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return NgxEditorComponent_1; }),
                    multi: true
                }
            ],
            styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}.ngx-editor ::ng-deep .CodeMirror{border:1px solid #ddd;z-index:2}.ngx-editor ::ng-deep .CodeMirror .CodeMirror-placeholder{color:#6c757d}"]
        }),
        tslib_1.__metadata("design:paramtypes", [MessageService,
            CommandExecutorService,
            Renderer2])
    ], NgxEditorComponent);
    return NgxEditorComponent;
}());
export { NgxEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQzNDLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUNwQyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLHdDQUF3QyxDQUFDO0FBRWhELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUVqRSxPQUFPLEVBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0UsT0FBTyxLQUFLLEtBQUssTUFBTSxpQ0FBaUMsQ0FBQztBQWV6RDtJQW9FRTs7OztPQUlHO0lBQ0gsNEJBQ1UsZUFBK0IsRUFDL0IsZ0JBQXdDLEVBQ3hDLFNBQW9CO1FBRnBCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXdCO1FBQ3hDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUE5QzlCOzs7Ozs7V0FNRztRQUNNLFlBQU8sR0FBRyxPQUFPLENBQUM7UUFDM0I7Ozs7O1dBS0c7UUFDTSxXQUFNLEdBQUcsZUFBZSxDQUFDO1FBUWxDLDREQUE0RDtRQUNsRCxTQUFJLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbEUsMERBQTBEO1FBQ2hELFVBQUssR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQU1u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UyxFQUFFO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLG9CQUFrQixFQUFsQixDQUFrQixDQUFDO29CQUNqRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGOztTQUNGLENBQUM7aURBNEUyQixjQUFjO1lBQ2Isc0JBQXNCO1lBQzdCLFNBQVM7T0E1RW5CLGtCQUFrQixDQXlSOUI7SUFBRCx5QkFBQztDQUFBLEFBelJELElBeVJDO1NBelJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcic7XG5pbXBvcnQgJ2NvZGVtaXJyb3IvYWRkb24vZGlzcGxheS9wbGFjZWhvbGRlci5qcyc7XG5pbXBvcnQgJ2NvZGVtaXJyb3IvbW9kZS9odG1sbWl4ZWQvaHRtbG1peGVkLmpzJztcblxuaW1wb3J0IHtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuaW1wb3J0IHtuZ3hFZGl0b3JDb25maWcsIGNvZGVNaXJyb3JDb25maWd9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4RWRpdG9yQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG5cbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cbiAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XG4gIC8qKiBUaGUgc3BlbGxjaGVjayBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgZWxlbWVudCBpcyB0byBoYXZlIGl0cyBzcGVsbGluZyBhbmQgZ3JhbW1hciBjaGVja2VkIG9yIG5vdC4gKi9cbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcbiAgLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgdGV4dEFyZWEgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0cmFuc2xhdGUgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudCBzaG91bGQgYmUgdHJhbnNsYXRlZCBvciBub3QuXG4gICAqXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxuICAgKi9cbiAgQElucHV0KCkgdHJhbnNsYXRlOiBzdHJpbmc7XG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIGhlaWdodCBmb3IgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgV2lkdGggb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluV2lkdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQ2hlY2sgbmd4RWRpdG9yQ29uZmlnIGZvciB0b29sYmFyIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIGVuYWJsZSBhbGwgdG9vbGJhclxuICAgKi9cbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xuICAvKipcbiAgICogVGhlIGVkaXRvciBjYW4gYmUgcmVzaXplZCB2ZXJ0aWNhbGx5LlxuICAgKlxuICAgKiBgYmFzaWNgIHJlc2l6ZXIgZW5hYmxlcyB0aGUgaHRtbDUgcmVzemllci4gQ2hlY2sgaGVyZSBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2Nzc3JlZi9jc3MzX3ByX3Jlc2l6ZS5hc3BcbiAgICpcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cbiAgICovXG4gIEBJbnB1dCgpIHJlc2l6ZXIgPSAnc3RhY2snO1xuICAvKipcbiAgICogVGhlIGNvbmZpZyBwcm9wZXJ0eSBpcyBhIEpTT04gb2JqZWN0XG4gICAqXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXG4gICAqIGlucHV0cyBwcm92aWRlZCBkaXJlY3RseSBhcmUgY29uc2lkZXJlZCBhcyB0b3AgcHJpb3JpdHlcbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcbiAgLyoqIFdlYXRoZXIgdG8gc2hvdyBvciBoaWRlIHRvb2xiYXIgKi9cbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIGVuYWJsZVRvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBFbmRwb2ludCBmb3Igd2hpY2ggdGhlIGltYWdlIHRvIGJlIHVwbG9hZGVkICovXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcblxuICAvKiogZW1pdHMgYGJsdXJgIGV2ZW50IHdoZW4gZm9jdXNlZCBvdXQgZnJvbSB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIC8qKiBlbWl0cyBgZm9jdXNgIGV2ZW50IHdoZW4gZm9jdXNlZCBpbiB0byB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGZvY3VzOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ25neFRleHRBcmVhJywge3N0YXRpYzogdHJ1ZX0pIHRleHRBcmVhOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ25neENvZGVFZGl0b3InLCB7c3RhdGljOiB0cnVlfSkgY29kZUVkaXRvcjogYW55O1xuICBAVmlld0NoaWxkKCduZ3hXcmFwcGVyJywge3N0YXRpYzogdHJ1ZX0pIG5neFdyYXBwZXI6IGFueTtcblxuICBVdGlsczogYW55ID0gVXRpbHM7XG4gIGNvZGVFZGl0b3JNb2RlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBuZ3hDb2RlTWlycm9yOiBhbnkgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQHBhcmFtIF9tZXNzYWdlU2VydmljZSBzZXJ2aWNlIHRvIHNlbmQgbWVzc2FnZSB0byB0aGUgZWRpdG9yIG1lc3NhZ2UgY29tcG9uZW50XG4gICAqIEBwYXJhbSBfY29tbWFuZEV4ZWN1dG9yIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxuICAgKiBAcGFyYW0gX3JlbmRlcmVyIGFjY2VzcyBhbmQgbWFuaXB1bGF0ZSB0aGUgZG9tIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcbiAgICBwcml2YXRlIF9jb21tYW5kRXhlY3V0b3I6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgLyoqXG4gICAqIGV2ZW50c1xuICAgKi9cbiAgb25UZXh0QXJlYUZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuZm9jdXMuZW1pdCgnZm9jdXMnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogZm9jdXMgdGhlIHRleHQgYXJlYSB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgKi9cbiAgb25FZGl0b3JGb2N1cygpIHtcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlZCBmcm9tIHRoZSBjb250ZW50ZWRpdGFibGUgc2VjdGlvbiB3aGlsZSB0aGUgaW5wdXQgcHJvcGVydHkgY2hhbmdlc1xuICAgKiBAcGFyYW0gaHRtbCBodG1sIHN0cmluZyBmcm9tIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgb25Db250ZW50Q2hhbmdlKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKGh0bWwpO1xuICAgICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcihodG1sKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBvblRleHRBcmVhQmx1cigpOiB2b2lkIHtcblxuICAgIC8qKiBzYXZlIHNlbGVjdGlvbiBpZiBmb2N1c3NlZCBvdXQgKi9cbiAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3Iuc2F2ZWRTZWxlY3Rpb24gPSBVdGlscy5zYXZlU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub25Ub3VjaGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICB0aGlzLmJsdXIuZW1pdCgnYmx1cicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXNpemluZyB0ZXh0IGFyZWFcbiAgICpcbiAgICogQHBhcmFtIG9mZnNldFkgdmVydGljYWwgaGVpZ2h0IG9mIHRoZSBlaWR0YWJsZSBwb3J0aW9uIG9mIHRoZSBlZGl0b3JcbiAgICovXG4gIHJlc2l6ZVRleHRBcmVhKG9mZnNldFk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBuZXdIZWlnaHQgPSBwYXJzZUludCh0aGlzLmhlaWdodCwgMTApO1xuICAgIG5ld0hlaWdodCArPSBvZmZzZXRZO1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgY29kZS1lZGl0b3IgaGVpZ2h0IG9ubHkgb24gZWRpdG9yIG1vZGVcbiAgICAgKi9cbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yTW9kZSkge1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnNldFNpemUoJzEwMCUnLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBlZGl0b3IgYWN0aW9ucywgaS5lLiwgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmROYW1lIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmIChjb21tYW5kTmFtZSA9PT0gJ2NvZGUnKSB7XG4gICAgICB0aGlzLnRvZ2dsZUNvZGVFZGl0b3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLmV4ZWN1dGUoY29tbWFuZE5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICB0aGlzLnRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJzxicj4nKSB7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5yZWZyZXNoVmlldyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIGNoYW5nZSBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIGZuIGEgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICAgKiB3aGVuIHRoZSBjb250cm9sIHJlY2VpdmVzIGEgdG91Y2ggZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZWZyZXNoIHZpZXcvSFRNTCBvZiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBodG1sIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcbiAgICovXG4gIHJlZnJlc2hWaWV3KHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LCAnaW5uZXJIVE1MJywgbm9ybWFsaXplZFZhbHVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogdG9nZ2xlIGJldHdlZW4gY29kZXZpZXcgYW5kIGVkaXRvclxuICAgKi9cbiAgdG9nZ2xlQ29kZUVkaXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGVFZGl0b3JNb2RlID0gIXRoaXMuY29kZUVkaXRvck1vZGU7XG5cbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yTW9kZSkge1xuXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSh0aGlzLmNvZGVFZGl0b3IubmF0aXZlRWxlbWVudCwgY29kZU1pcnJvckNvbmZpZyk7XG5cbiAgICAgIC8qKiBzZXQgdmFsdWUgb2YgdGhlIGNvZGUgZWRpdG9yICovXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3Iuc2V0VmFsdWUodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG5cbiAgICAgIC8qKiBzZXRzIGhlaWdodCBvZiB0aGUgY29kZSBlZGl0b3IgYXMgc2FtZSBhcyB0aGUgaGVpZ2h0IG9mIHRoZSB0ZXh0QXJlYSAqL1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnNldFNpemUoJzEwMCUnLCB0aGlzLmhlaWdodCk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvKiogcmVtb3ZlLyBkZXN0cm95IGNvZGUgZWRpdG9yICovXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3IudG9UZXh0QXJlYSgpO1xuXG4gICAgICAvKiogdXBkYXRlIHRoZSBtb2RlbCB2YWx1ZSBhbmQgaHRtbCBjb250ZW50IG9uIHRoZSBjb250ZW50ZWRpdGFibGUgKi9cbiAgICAgIHRoaXMucmVmcmVzaFZpZXcodGhpcy5uZ3hDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UodGhpcy5uZ3hDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuXG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b2dnbGVzIHBsYWNlaG9sZGVyIGJhc2VkIG9uIGlucHV0IHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQSBIVE1MIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcbiAgICovXG4gIHRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSAnPGJyPicgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEganNvbiBjb250YWluaW5nIGlucHV0IHBhcmFtc1xuICAgKi9cbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgIGVuYWJsZVRvb2xiYXI6IHRoaXMuZW5hYmxlVG9vbGJhcixcbiAgICAgIHNob3dUb29sYmFyOiB0aGlzLnNob3dUb29sYmFyLFxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxuICAgICAgdG9vbGJhcjogdGhpcy50b29sYmFyXG4gICAgfTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8qKlxuICAgICAqIHNldCBjb25maWd1YXJ0aW9uXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy5leGVjdXRlQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnKTtcblxuICB9XG5cbn1cbiJdfQ==