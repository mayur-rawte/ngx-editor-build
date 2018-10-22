/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
        /**
         * emits `blur` event when focused out from the textarea
         */
        this.blur = new EventEmitter();
        /**
         * emits `focus` event when focused in to the textarea
         */
        this.focus = new EventEmitter();
        this.Utils = Utils;
        this.codeEditorMode = false;
        this.ngxCodeMirror = undefined;
    }
    /**
     * events
     */
    /**
     * events
     * @return {?}
     */
    NgxEditorComponent.prototype.onTextAreaFocus = /**
     * events
     * @return {?}
     */
    function () {
        this.focus.emit('focus');
        return;
    };
    /** focus the text area when the editor is focussed */
    /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    NgxEditorComponent.prototype.onEditorFocus = /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    function () {
        this.textArea.nativeElement.focus();
    };
    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    NgxEditorComponent.prototype.onContentChange = /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    function (html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
            this.togglePlaceholder(html);
        }
        return;
    };
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.onTextAreaBlur = /**
     * @return {?}
     */
    function () {
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
    /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.resizeTextArea = /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    function (offsetY) {
        /** @type {?} */
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
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    NgxEditorComponent.prototype.executeCommand = /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    function (commandName) {
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
    /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    NgxEditorComponent.prototype.writeValue = /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    function (value) {
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
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnChange = /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    NgxEditorComponent.prototype.registerOnTouched = /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /**
     * refresh view/HTML of the editor
     *
     * @param value html string from the editor
     */
    /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.refreshView = /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    function (value) {
        /** @type {?} */
        var normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    };
    /**
     * toggle between codeview and editor
     */
    /**
     * toggle between codeview and editor
     * @return {?}
     */
    NgxEditorComponent.prototype.toggleCodeEditor = /**
     * toggle between codeview and editor
     * @return {?}
     */
    function () {
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
    /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    NgxEditorComponent.prototype.togglePlaceholder = /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    function (value) {
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
    /**
     * returns a json containing input params
     * @return {?}
     */
    NgxEditorComponent.prototype.getCollectiveParams = /**
     * returns a json containing input params
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    NgxEditorComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        /**
         * set configuartion
         */
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    };
    NgxEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-ngx-editor',
                    template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" [hidden]=\"codeEditorMode\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n      [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\" (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <textarea [attr.placeholder]=\"placeholder || config['placeholder']\" [hidden]=\"true\" #ngxCodeEditor></textarea>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NgxEditorComponent; }),
                            multi: true
                        }
                    ],
                    styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}.ngx-editor ::ng-deep .CodeMirror{border:1px solid #ddd;z-index:2}.ngx-editor ::ng-deep .CodeMirror .CodeMirror-placeholder{color:#6c757d}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorComponent.ctorParameters = function () { return [
        { type: MessageService },
        { type: CommandExecutorService },
        { type: Renderer2 }
    ]; };
    NgxEditorComponent.propDecorators = {
        editable: [{ type: Input }],
        spellcheck: [{ type: Input }],
        placeholder: [{ type: Input }],
        translate: [{ type: Input }],
        height: [{ type: Input }],
        minHeight: [{ type: Input }],
        width: [{ type: Input }],
        minWidth: [{ type: Input }],
        toolbar: [{ type: Input }],
        resizer: [{ type: Input }],
        config: [{ type: Input }],
        showToolbar: [{ type: Input }],
        enableToolbar: [{ type: Input }],
        imageEndPoint: [{ type: Input }],
        blur: [{ type: Output }],
        focus: [{ type: Output }],
        textArea: [{ type: ViewChild, args: ['ngxTextArea',] }],
        codeEditor: [{ type: ViewChild, args: ['ngxCodeEditor',] }],
        ngxWrapper: [{ type: ViewChild, args: ['ngxWrapper',] }]
    };
    return NgxEditorComponent;
}());
export { NgxEditorComponent };
if (false) {
    /**
     * Specifies weather the textarea to be editable or not
     * @type {?}
     */
    NgxEditorComponent.prototype.editable;
    /**
     * The spellcheck property specifies whether the element is to have its spelling and grammar checked or not.
     * @type {?}
     */
    NgxEditorComponent.prototype.spellcheck;
    /**
     * Placeholder for the textArea
     * @type {?}
     */
    NgxEditorComponent.prototype.placeholder;
    /**
     * The translate property specifies whether the content of an element should be translated or not.
     *
     * Check https://www.w3schools.com/tags/att_global_translate.asp for more information and browser support
     * @type {?}
     */
    NgxEditorComponent.prototype.translate;
    /**
     * Sets height of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.height;
    /**
     * Sets minimum height for the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.minHeight;
    /**
     * Sets Width of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.width;
    /**
     * Sets minimum width of the editor
     * @type {?}
     */
    NgxEditorComponent.prototype.minWidth;
    /**
     * Toolbar accepts an array which specifies the options to be enabled for the toolbar
     *
     * Check ngxEditorConfig for toolbar configuration
     *
     * Passing an empty array will enable all toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.toolbar;
    /**
     * The editor can be resized vertically.
     *
     * `basic` resizer enables the html5 reszier. Check here https://www.w3schools.com/cssref/css3_pr_resize.asp
     *
     * `stack` resizer enable a resizer that looks like as if in https://stackoverflow.com
     * @type {?}
     */
    NgxEditorComponent.prototype.resizer;
    /**
     * The config property is a JSON object
     *
     * All avaibale inputs inputs can be provided in the configuration as JSON
     * inputs provided directly are considered as top priority
     * @type {?}
     */
    NgxEditorComponent.prototype.config;
    /**
     * Weather to show or hide toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.showToolbar;
    /**
     * Weather to enable or disable the toolbar
     * @type {?}
     */
    NgxEditorComponent.prototype.enableToolbar;
    /**
     * Endpoint for which the image to be uploaded
     * @type {?}
     */
    NgxEditorComponent.prototype.imageEndPoint;
    /**
     * emits `blur` event when focused out from the textarea
     * @type {?}
     */
    NgxEditorComponent.prototype.blur;
    /**
     * emits `focus` event when focused in to the textarea
     * @type {?}
     */
    NgxEditorComponent.prototype.focus;
    /** @type {?} */
    NgxEditorComponent.prototype.textArea;
    /** @type {?} */
    NgxEditorComponent.prototype.codeEditor;
    /** @type {?} */
    NgxEditorComponent.prototype.ngxWrapper;
    /** @type {?} */
    NgxEditorComponent.prototype.Utils;
    /** @type {?} */
    NgxEditorComponent.prototype.codeEditorMode;
    /** @type {?} */
    NgxEditorComponent.prototype.ngxCodeMirror;
    /** @type {?} */
    NgxEditorComponent.prototype.onChange;
    /** @type {?} */
    NgxEditorComponent.prototype.onTouched;
    /** @type {?} */
    NgxEditorComponent.prototype._messageService;
    /** @type {?} */
    NgxEditorComponent.prototype._commandExecutor;
    /** @type {?} */
    NgxEditorComponent.prototype._renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZWRpdG9yLyIsInNvdXJjZXMiOlsiYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQzNDLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUNwQyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyx5Q0FBeUMsQ0FBQztBQUNqRCxPQUFPLHdDQUF3QyxDQUFDO0FBRWhELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUVqRSxPQUFPLEVBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0UsT0FBTyxLQUFLLEtBQUssTUFBTSxpQ0FBaUMsQ0FBQztBQUV6RDtJQWlGRTs7OztPQUlHO0lBQ0gsNEJBQ1UsZUFBK0IsRUFDL0IsZ0JBQXdDLEVBQ3hDLFNBQW9CO1FBRnBCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXdCO1FBQ3hDLGNBQVMsR0FBVCxTQUFTLENBQVc7Ozs7Ozs7O1FBdkNyQixZQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O1FBT2xCLFdBQU0sR0FBRyxlQUFlLENBQUM7Ozs7UUFTeEIsU0FBSSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDOzs7O1FBRXhELFVBQUssR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQU1uRSxVQUFLLEdBQVEsS0FBSyxDQUFDO1FBQ25CLG1CQUFj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Ozs7Ozs7O0lBTzNCLG9DQUFrQzs7Ozs7SUFFbEMseUNBQThCOzs7OztJQUU5QiwyQ0FBZ0M7Ozs7O0lBRWhDLDJDQUErQjs7Ozs7SUFHL0Isa0NBQWtFOzs7OztJQUVsRSxtQ0FBbUU7O0lBRW5FLHNDQUF3Qzs7SUFDeEMsd0NBQTRDOztJQUM1Qyx3Q0FBeUM7O0lBRXpDLG1DQUFtQjs7SUFDbkIsNENBQXVCOztJQUV2QiwyQ0FBdUM7O0lBQ3ZDLHNDQUEwQzs7SUFDMUMsdUNBQThCOztJQVE1Qiw2Q0FBdUM7O0lBQ3ZDLDhDQUFnRDs7SUFDaEQsdUNBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCxcbiAgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIGZvcndhcmRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgQ29kZU1pcnJvciBmcm9tICdjb2RlbWlycm9yJztcbmltcG9ydCAnY29kZW1pcnJvci9hZGRvbi9kaXNwbGF5L3BsYWNlaG9sZGVyLmpzJztcbmltcG9ydCAnY29kZW1pcnJvci9tb2RlL2h0bWxtaXhlZC9odG1sbWl4ZWQuanMnO1xuXG5pbXBvcnQge0NvbW1hbmRFeGVjdXRvclNlcnZpY2V9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL2NvbW1hbmQtZXhlY3V0b3Iuc2VydmljZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuXG5pbXBvcnQge25neEVkaXRvckNvbmZpZywgY29kZU1pcnJvckNvbmZpZ30gZnJvbSAnLi9jb21tb24vbmd4LWVkaXRvci5kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3InLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3IuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ3hFZGl0b3JDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAvKiogU3BlY2lmaWVzIHdlYXRoZXIgdGhlIHRleHRhcmVhIHRvIGJlIGVkaXRhYmxlIG9yIG5vdCAqL1xuICBASW5wdXQoKSBlZGl0YWJsZTogYm9vbGVhbjtcbiAgLyoqIFRoZSBzcGVsbGNoZWNrIHByb3BlcnR5IHNwZWNpZmllcyB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIHRvIGhhdmUgaXRzIHNwZWxsaW5nIGFuZCBncmFtbWFyIGNoZWNrZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKSBzcGVsbGNoZWNrOiBib29sZWFuO1xuICAvKiogUGxhY2Vob2xkZXIgZm9yIHRoZSB0ZXh0QXJlYSAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGVudCBvZiBhbiBlbGVtZW50IHNob3VsZCBiZSB0cmFuc2xhdGVkIG9yIG5vdC5cbiAgICpcbiAgICogQ2hlY2sgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL2F0dF9nbG9iYWxfdHJhbnNsYXRlLmFzcCBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhbmQgYnJvd3NlciBzdXBwb3J0XG4gICAqL1xuICBASW5wdXQoKSB0cmFuc2xhdGU6IHN0cmluZztcbiAgLyoqIFNldHMgaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XG4gIC8qKiBTZXRzIG1pbmltdW0gaGVpZ2h0IGZvciB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIG1pbkhlaWdodDogc3RyaW5nO1xuICAvKiogU2V0cyBXaWR0aCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmc7XG4gIC8qKiBTZXRzIG1pbmltdW0gd2lkdGggb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBtaW5XaWR0aDogc3RyaW5nO1xuICAvKipcbiAgICogVG9vbGJhciBhY2NlcHRzIGFuIGFycmF5IHdoaWNoIHNwZWNpZmllcyB0aGUgb3B0aW9ucyB0byBiZSBlbmFibGVkIGZvciB0aGUgdG9vbGJhclxuICAgKlxuICAgKiBDaGVjayBuZ3hFZGl0b3JDb25maWcgZm9yIHRvb2xiYXIgY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBQYXNzaW5nIGFuIGVtcHR5IGFycmF5IHdpbGwgZW5hYmxlIGFsbCB0b29sYmFyXG4gICAqL1xuICBASW5wdXQoKSB0b29sYmFyOiBPYmplY3Q7XG4gIC8qKlxuICAgKiBUaGUgZWRpdG9yIGNhbiBiZSByZXNpemVkIHZlcnRpY2FsbHkuXG4gICAqXG4gICAqIGBiYXNpY2AgcmVzaXplciBlbmFibGVzIHRoZSBodG1sNSByZXN6aWVyLiBDaGVjayBoZXJlIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vY3NzcmVmL2NzczNfcHJfcmVzaXplLmFzcFxuICAgKlxuICAgKiBgc3RhY2tgIHJlc2l6ZXIgZW5hYmxlIGEgcmVzaXplciB0aGF0IGxvb2tzIGxpa2UgYXMgaWYgaW4gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbVxuICAgKi9cbiAgQElucHV0KCkgcmVzaXplciA9ICdzdGFjayc7XG4gIC8qKlxuICAgKiBUaGUgY29uZmlnIHByb3BlcnR5IGlzIGEgSlNPTiBvYmplY3RcbiAgICpcbiAgICogQWxsIGF2YWliYWxlIGlucHV0cyBpbnB1dHMgY2FuIGJlIHByb3ZpZGVkIGluIHRoZSBjb25maWd1cmF0aW9uIGFzIEpTT05cbiAgICogaW5wdXRzIHByb3ZpZGVkIGRpcmVjdGx5IGFyZSBjb25zaWRlcmVkIGFzIHRvcCBwcmlvcml0eVxuICAgKi9cbiAgQElucHV0KCkgY29uZmlnID0gbmd4RWRpdG9yQ29uZmlnO1xuICAvKiogV2VhdGhlciB0byBzaG93IG9yIGhpZGUgdG9vbGJhciAqL1xuICBASW5wdXQoKSBzaG93VG9vbGJhcjogYm9vbGVhbjtcbiAgLyoqIFdlYXRoZXIgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIHRvb2xiYXIgKi9cbiAgQElucHV0KCkgZW5hYmxlVG9vbGJhcjogYm9vbGVhbjtcbiAgLyoqIEVuZHBvaW50IGZvciB3aGljaCB0aGUgaW1hZ2UgdG8gYmUgdXBsb2FkZWQgKi9cbiAgQElucHV0KCkgaW1hZ2VFbmRQb2ludDogc3RyaW5nO1xuXG4gIC8qKiBlbWl0cyBgYmx1cmAgZXZlbnQgd2hlbiBmb2N1c2VkIG91dCBmcm9tIHRoZSB0ZXh0YXJlYSAqL1xuICBAT3V0cHV0KCkgYmx1cjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgLyoqIGVtaXRzIGBmb2N1c2AgZXZlbnQgd2hlbiBmb2N1c2VkIGluIHRvIHRoZSB0ZXh0YXJlYSAqL1xuICBAT3V0cHV0KCkgZm9jdXM6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgQFZpZXdDaGlsZCgnbmd4VGV4dEFyZWEnKSB0ZXh0QXJlYTogYW55O1xuICBAVmlld0NoaWxkKCduZ3hDb2RlRWRpdG9yJykgY29kZUVkaXRvcjogYW55O1xuICBAVmlld0NoaWxkKCduZ3hXcmFwcGVyJykgbmd4V3JhcHBlcjogYW55O1xuXG4gIFV0aWxzOiBhbnkgPSBVdGlscztcbiAgY29kZUVkaXRvck1vZGUgPSBmYWxzZTtcblxuICBwcml2YXRlIG5neENvZGVNaXJyb3I6IGFueSA9IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25Ub3VjaGVkOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gX21lc3NhZ2VTZXJ2aWNlIHNlcnZpY2UgdG8gc2VuZCBtZXNzYWdlIHRvIHRoZSBlZGl0b3IgbWVzc2FnZSBjb21wb25lbnRcbiAgICogQHBhcmFtIF9jb21tYW5kRXhlY3V0b3IgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqIEBwYXJhbSBfcmVuZGVyZXIgYWNjZXNzIGFuZCBtYW5pcHVsYXRlIHRoZSBkb20gZWxlbWVudFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvcjogQ29tbWFuZEV4ZWN1dG9yU2VydmljZSxcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICAvKipcbiAgICogZXZlbnRzXG4gICAqL1xuICBvblRleHRBcmVhRm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1cy5lbWl0KCdmb2N1cycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBmb2N1cyB0aGUgdGV4dCBhcmVhIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCAqL1xuICBvbkVkaXRvckZvY3VzKCkge1xuICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIGZyb20gdGhlIGNvbnRlbnRlZGl0YWJsZSBzZWN0aW9uIHdoaWxlIHRoZSBpbnB1dCBwcm9wZXJ0eSBjaGFuZ2VzXG4gICAqIEBwYXJhbSBodG1sIGh0bWwgc3RyaW5nIGZyb20gY29udGVudGVkaXRhYmxlXG4gICAqL1xuICBvbkNvbnRlbnRDaGFuZ2UoaHRtbDogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UoaHRtbCk7XG4gICAgICB0aGlzLnRvZ2dsZVBsYWNlaG9sZGVyKGh0bWwpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uVGV4dEFyZWFCbHVyKCk6IHZvaWQge1xuXG4gICAgLyoqIHNhdmUgc2VsZWN0aW9uIGlmIGZvY3Vzc2VkIG91dCAqL1xuICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvci5zYXZlZFNlbGVjdGlvbiA9IFV0aWxzLnNhdmVTZWxlY3Rpb24oKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5vblRvdWNoZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICAgIHRoaXMuYmx1ci5lbWl0KCdibHVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlc2l6aW5nIHRleHQgYXJlYVxuICAgKlxuICAgKiBAcGFyYW0gb2Zmc2V0WSB2ZXJ0aWNhbCBoZWlnaHQgb2YgdGhlIGVpZHRhYmxlIHBvcnRpb24gb2YgdGhlIGVkaXRvclxuICAgKi9cbiAgcmVzaXplVGV4dEFyZWEob2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XG4gICAgbGV0IG5ld0hlaWdodCA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0LCAxMCk7XG4gICAgbmV3SGVpZ2h0ICs9IG9mZnNldFk7XG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSBjb2RlLWVkaXRvciBoZWlnaHQgb25seSBvbiBlZGl0b3IgbW9kZVxuICAgICAqL1xuICAgIGlmICh0aGlzLmNvZGVFZGl0b3JNb2RlKSB7XG4gICAgICB0aGlzLm5neENvZGVNaXJyb3Iuc2V0U2l6ZSgnMTAwJScsIHRoaXMuaGVpZ2h0KTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGVkaXRvciBhY3Rpb25zLCBpLmUuLCBleGVjdXRlcyBjb21tYW5kIGZyb20gdG9vbGJhclxuICAgKlxuICAgKiBAcGFyYW0gY29tbWFuZE5hbWUgbmFtZSBvZiB0aGUgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgZXhlY3V0ZUNvbW1hbmQoY29tbWFuZE5hbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKGNvbW1hbmROYW1lID09PSAnY29kZScpIHtcbiAgICAgIHRoaXMudG9nZ2xlQ29kZUVkaXRvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3IuZXhlY3V0ZShjb21tYW5kTmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhIG5ldyB2YWx1ZSB0byB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHZhbHVlIHRvIGJlIGV4ZWN1dGVkIHdoZW4gdGhlcmUgaXMgYSBjaGFuZ2UgaW4gY29udGVudGVkaXRhYmxlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcblxuICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIodmFsdWUpO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnPGJyPicpIHtcbiAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlZnJlc2hWaWV3KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICAgKiB3aGVuIHRoZSBjb250cm9sIHJlY2VpdmVzIGEgY2hhbmdlIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSB0b3VjaCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIGZuIGEgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIHJlZnJlc2ggdmlldy9IVE1MIG9mIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIGh0bWwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxuICAgKi9cbiAgcmVmcmVzaFZpZXcodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlID09PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCBub3JtYWxpemVkVmFsdWUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b2dnbGUgYmV0d2VlbiBjb2RldmlldyBhbmQgZWRpdG9yXG4gICAqL1xuICB0b2dnbGVDb2RlRWRpdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuY29kZUVkaXRvck1vZGUgPSAhdGhpcy5jb2RlRWRpdG9yTW9kZTtcblxuICAgIGlmICh0aGlzLmNvZGVFZGl0b3JNb2RlKSB7XG5cbiAgICAgIHRoaXMubmd4Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKHRoaXMuY29kZUVkaXRvci5uYXRpdmVFbGVtZW50LCBjb2RlTWlycm9yQ29uZmlnKTtcblxuICAgICAgLyoqIHNldCB2YWx1ZSBvZiB0aGUgY29kZSBlZGl0b3IgKi9cbiAgICAgIHRoaXMubmd4Q29kZU1pcnJvci5zZXRWYWx1ZSh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcblxuICAgICAgLyoqIHNldHMgaGVpZ2h0IG9mIHRoZSBjb2RlIGVkaXRvciBhcyBzYW1lIGFzIHRoZSBoZWlnaHQgb2YgdGhlIHRleHRBcmVhICovXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3Iuc2V0U2l6ZSgnMTAwJScsIHRoaXMuaGVpZ2h0KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIC8qKiByZW1vdmUvIGRlc3Ryb3kgY29kZSBlZGl0b3IgKi9cbiAgICAgIHRoaXMubmd4Q29kZU1pcnJvci50b1RleHRBcmVhKCk7XG5cbiAgICAgIC8qKiB1cGRhdGUgdGhlIG1vZGVsIHZhbHVlIGFuZCBodG1sIGNvbnRlbnQgb24gdGhlIGNvbnRlbnRlZGl0YWJsZSAqL1xuICAgICAgdGhpcy5yZWZyZXNoVmlldyh0aGlzLm5neENvZGVNaXJyb3IuZ2V0VmFsdWUoKSk7XG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZSh0aGlzLm5neENvZGVNaXJyb3IuZ2V0VmFsdWUoKSk7XG5cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvZ2dsZXMgcGxhY2Vob2xkZXIgYmFzZWQgb24gaW5wdXQgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBIEhUTUwgc3RyaW5nIGZyb20gdGhlIGVkaXRvclxuICAgKi9cbiAgdG9nZ2xlUGxhY2Vob2xkZXIodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT09ICc8YnI+JyB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMubmd4V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2hvdy1wbGFjZWhvbGRlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBqc29uIGNvbnRhaW5pbmcgaW5wdXQgcGFyYW1zXG4gICAqL1xuICBnZXRDb2xsZWN0aXZlUGFyYW1zKCk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxuICAgICAgc3BlbGxjaGVjazogdGhpcy5zcGVsbGNoZWNrLFxuICAgICAgcGxhY2Vob2xkZXI6IHRoaXMucGxhY2Vob2xkZXIsXG4gICAgICB0cmFuc2xhdGU6IHRoaXMudHJhbnNsYXRlLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIG1pbkhlaWdodDogdGhpcy5taW5IZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIG1pbldpZHRoOiB0aGlzLm1pbldpZHRoLFxuICAgICAgZW5hYmxlVG9vbGJhcjogdGhpcy5lbmFibGVUb29sYmFyLFxuICAgICAgc2hvd1Rvb2xiYXI6IHRoaXMuc2hvd1Rvb2xiYXIsXG4gICAgICBpbWFnZUVuZFBvaW50OiB0aGlzLmltYWdlRW5kUG9pbnQsXG4gICAgICB0b29sYmFyOiB0aGlzLnRvb2xiYXJcbiAgICB9O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLyoqXG4gICAgICogc2V0IGNvbmZpZ3VhcnRpb25cbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMuVXRpbHMuZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih0aGlzLmNvbmZpZywgbmd4RWRpdG9yQ29uZmlnLCB0aGlzLmdldENvbGxlY3RpdmVQYXJhbXMoKSk7XG5cbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICB0aGlzLmV4ZWN1dGVDb21tYW5kKCdlbmFibGVPYmplY3RSZXNpemluZycpO1xuXG4gIH1cblxufVxuIl19