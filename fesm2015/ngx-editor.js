import { Injectable, Component, Input, Output, ViewChild, EventEmitter, Renderer2, forwardRef, HostListener, NgModule } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NG_VALUE_ACCESSOR, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fromTextArea } from 'codemirror';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * enable or disable toolbar based on configuration
 *
 * @param {?} value toolbar item
 * @param {?} toolbar toolbar configuration object
 * @return {?}
 */
function canEnableToolbarOptions(value, toolbar) {
    if (value) {
        if (toolbar['length'] === 0) {
            return true;
        }
        else {
            /** @type {?} */
            const found = toolbar.filter(array => {
                return array.indexOf(value) !== -1;
            });
            return found.length ? true : false;
        }
    }
    else {
        return false;
    }
}
/**
 * set editor configuration
 *
 * @param {?} value configuration via [config] property
 * @param {?} ngxEditorConfig default editor configuration
 * @param {?} input direct configuration inputs via directives
 * @return {?}
 */
function getEditorConfiguration(value, ngxEditorConfig, input) {
    for (const i in ngxEditorConfig) {
        if (i) {
            if (input[i] !== undefined) {
                value[i] = input[i];
            }
            if (!value.hasOwnProperty(i)) {
                value[i] = ngxEditorConfig[i];
            }
        }
    }
    return value;
}
/**
 * return vertical if the element is the resizer property is set to basic
 *
 * @param {?} resizer type of resizer, either basic or stack
 * @return {?}
 */
function canResize(resizer) {
    if (resizer === 'basic') {
        return 'vertical';
    }
    return false;
}
/**
 * save selection when the editor is focussed out
 * @return {?}
 */
function saveSelection() {
    if (window.getSelection) {
        /** @type {?} */
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    }
    else if (document.getSelection && document.createRange) {
        return document.createRange();
    }
    return null;
}
/**
 * restore selection when the editor is focussed in
 *
 * @param {?} range saved selection when the editor is focussed out
 * @return {?}
 */
function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            /** @type {?} */
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return true;
        }
        else if (document.getSelection && range.select) {
            range.select();
            return true;
        }
    }
    else {
        return false;
    }
}

var Utils = /*#__PURE__*/Object.freeze({
    canEnableToolbarOptions: canEnableToolbarOptions,
    getEditorConfiguration: getEditorConfiguration,
    canResize: canResize,
    saveSelection: saveSelection,
    restoreSelection: restoreSelection
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class CommandExecutorService {
    /**
     *
     * @param {?} _http HTTP Client for making http requests
     */
    constructor(_http) {
        this._http = _http;
        /**
         * saves the selection from the editor when focussed out
         */
        this.savedSelection = undefined;
    }
    /**
     * executes command from the toolbar
     *
     * @param {?} command command to be executed
     * @return {?}
     */
    execute(command) {
        if (!this.savedSelection && command !== 'enableObjectResizing') {
            throw new Error('Range out of Editor');
        }
        if (command === 'enableObjectResizing') {
            document.execCommand('enableObjectResizing', true, 'true');
            return;
        }
        if (command === 'blockquote') {
            document.execCommand('formatBlock', false, 'blockquote');
            return;
        }
        if (command === 'removeBlockquote') {
            document.execCommand('formatBlock', false, 'div');
            return;
        }
        document.execCommand(command, false, null);
        return;
    }
    /**
     * inserts image in the editor
     *
     * @param {?} imageURI url of the image to be inserted
     * @return {?}
     */
    insertImage(imageURI) {
        if (this.savedSelection) {
            if (imageURI) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    /** @type {?} */
                    const inserted = document.execCommand('insertImage', false, imageURI);
                    if (!inserted) {
                        throw new Error('Invalid URL');
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    }
    /**
     * inserts image in the editor
     *
     * @param {?} videParams url of the image to be inserted
     * @return {?}
     */
    insertVideo(videParams) {
        if (this.savedSelection) {
            if (videParams) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isYoutubeLink(videParams.videoUrl)) {
                        /** @type {?} */
                        const youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                            + 'src="' + videParams.videoUrl + '"></iframe>';
                        this.insertHtml(youtubeURL);
                    }
                    else if (this.checkTagSupportInBrowser('video')) {
                        if (this.isValidURL(videParams.videoUrl)) {
                            /** @type {?} */
                            const videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
                                + ' controls="true"><source src="' + videParams.videoUrl + '"></video>';
                            this.insertHtml(videoSrc);
                        }
                        else {
                            throw new Error('Invalid video URL');
                        }
                    }
                    else {
                        throw new Error('Unable to insert video');
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    }
    /**
     * checks the input url is a valid youtube URL or not
     *
     * @param {?} url Youtue URL
     * @return {?}
     */
    isYoutubeLink(url) {
        /** @type {?} */
        const ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
        return ytRegExp.test(url);
    }
    /**
     * check whether the string is a valid url or not
     * @param {?} url url
     * @return {?}
     */
    isValidURL(url) {
        /** @type {?} */
        const urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return urlRegExp.test(url);
    }
    /**
     * uploads image to the server
     *
     * @param {?} file file that has to be uploaded
     * @param {?} endPoint enpoint to which the image has to be uploaded
     * @param {?=} headers
     * @return {?}
     */
    uploadImage(file, endPoint, headers) {
        if (!endPoint) {
            throw new Error('Image Endpoint isn`t provided or invalid');
        }
        /** @type {?} */
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            /** @type {?} */
            let requestHeader = new HttpHeaders();
            /** @type {?} */
            const headerKeys = Object.keys(headers);
            for (const headerKey of headerKeys) {
                requestHeader = requestHeader.set(headerKey, headers[headerKey]);
            }
            /** @type {?} */
            const req = new HttpRequest('POST', endPoint, formData, {
                reportProgress: true,
                headers: requestHeader
            });
            return this._http.request(req);
        }
        else {
            throw new Error('Invalid Image');
        }
    }
    /**
     * inserts link in the editor
     *
     * @param {?} params parameters that holds the information for the link
     * @return {?}
     */
    createLink(params) {
        if (this.savedSelection) {
            /**
             * check whether the saved selection contains a range or plain selection
             */
            if (params.urlNewTab) {
                /** @type {?} */
                const newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                if (document.getSelection().type !== 'Range') {
                    /** @type {?} */
                    const restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        this.insertHtml(newUrl);
                    }
                }
                else {
                    throw new Error('Only new links can be inserted. You cannot edit URL`s');
                }
            }
            else {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    document.execCommand('createLink', false, params.urlLink);
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    }
    /**
     * insert color either font or background
     *
     * @param {?} color color to be inserted
     * @param {?} where where the color has to be inserted either text/background
     * @return {?}
     */
    insertColor(color, where) {
        if (this.savedSelection) {
            /** @type {?} */
            const restored = restoreSelection(this.savedSelection);
            if (restored && this.checkSelection()) {
                if (where === 'textColor') {
                    document.execCommand('foreColor', false, color);
                }
                else {
                    document.execCommand('hiliteColor', false, color);
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
        return;
    }
    /**
     * set font size for text
     *
     * @param {?} fontSize font-size to be set
     * @return {?}
     */
    setFontSize(fontSize) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontSize)) {
                        /** @type {?} */
                        const fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                    else {
                        /** @type {?} */
                        const fontPx = '<span style="font-size: ' + fontSize + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    }
    /**
     * set font name/family for text
     *
     * @param {?} fontName font-family to be set
     * @return {?}
     */
    setFontName(fontName) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                const restored = restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontName)) {
                        /** @type {?} */
                        const fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                    else {
                        /** @type {?} */
                        const fontFamily = '<span style="font-family: ' + fontName + ';">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                }
            }
        }
        else {
            throw new Error('Range out of the editor');
        }
    }
    /**
     * insert HTML
     * @param {?} html
     * @return {?}
     */
    insertHtml(html) {
        /** @type {?} */
        const isHTMLInserted = document.execCommand('insertHTML', false, html);
        if (!isHTMLInserted) {
            throw new Error('Unable to perform the operation');
        }
        return;
    }
    /**
     * check whether the value is a number or string
     * if number return true
     * else return false
     * @param {?} value
     * @return {?}
     */
    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
    /**
     * delete the text at selected range and return the value
     * @return {?}
     */
    deleteAndGetElement() {
        /** @type {?} */
        let slectedText;
        if (this.savedSelection) {
            slectedText = this.savedSelection.toString();
            this.savedSelection.deleteContents();
            return slectedText;
        }
        return false;
    }
    /**
     * check any slection is made or not
     * @return {?}
     */
    checkSelection() {
        /** @type {?} */
        const slectedText = this.savedSelection.toString();
        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }
    /**
     * check tag is supported by browser or not
     *
     * @param {?} tag HTML tag
     * @return {?}
     */
    checkTagSupportInBrowser(tag) {
        return !(document.createElement(tag) instanceof HTMLUnknownElement);
    }
}
CommandExecutorService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CommandExecutorService.ctorParameters = () => [
    { type: HttpClient }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * time in which the message has to be cleared
 * @type {?}
 */
const DURATION = 7000;
class MessageService {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * toolbar default configuration
 * @type {?}
 */
const ngxEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    imageEndPoint: '',
    toolbar: [
        ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
        ['fontName', 'fontSize', 'color'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
        ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
        ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
        ['link', 'unlink', 'image', 'video'],
        ['code']
    ],
    headers: {},
    responseEndPoint: null,
    appendImageEndPointToResponse: true
};
/**
 * codemirror configuaration
 * @type {?}
 */
const codeMirrorConfig = {
    lineNumbers: true,
    gutter: true,
    lineWrapping: true,
    mode: 'htmlmixed',
    autofocus: true,
    htmlMode: true
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorComponent {
    /**
     * @param {?} _messageService service to send message to the editor message component
     * @param {?} _commandExecutor executes command from the toolbar
     * @param {?} _renderer access and manipulate the dom element
     */
    constructor(_messageService, _commandExecutor, _renderer) {
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
     * @return {?}
     */
    onTextAreaFocus() {
        this.focus.emit('focus');
        return;
    }
    /**
     * focus the text area when the editor is focussed
     * @return {?}
     */
    onEditorFocus() {
        this.textArea.nativeElement.focus();
    }
    /**
     * Executed from the contenteditable section while the input property changes
     * @param {?} html html string from contenteditable
     * @return {?}
     */
    onContentChange(html) {
        if (typeof this.onChange === 'function') {
            this.onChange(html);
            this.togglePlaceholder(html);
        }
        return;
    }
    /**
     * @return {?}
     */
    onTextAreaBlur() {
        /** save selection if focussed out */
        this._commandExecutor.savedSelection = saveSelection();
        if (typeof this.onTouched === 'function') {
            this.onTouched();
        }
        this.blur.emit('blur');
        return;
    }
    /**
     * resizing text area
     *
     * @param {?} offsetY vertical height of the eidtable portion of the editor
     * @return {?}
     */
    resizeTextArea(offsetY) {
        /** @type {?} */
        let newHeight = parseInt(this.height, 10);
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
    }
    /**
     * editor actions, i.e., executes command from toolbar
     *
     * @param {?} commandName name of the command to be executed
     * @return {?}
     */
    executeCommand(commandName) {
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
    }
    /**
     * Write a new value to the element.
     *
     * @param {?} value value to be executed when there is a change in contenteditable
     * @return {?}
     */
    writeValue(value) {
        this.togglePlaceholder(value);
        if (value === null || value === undefined || value === '' || value === '<br>') {
            value = null;
        }
        this.refreshView(value);
    }
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param {?} fn a function
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * refresh view/HTML of the editor
     *
     * @param {?} value html string from the editor
     * @return {?}
     */
    refreshView(value) {
        /** @type {?} */
        const normalizedValue = value === null ? '' : value;
        this._renderer.setProperty(this.textArea.nativeElement, 'innerHTML', normalizedValue);
        return;
    }
    /**
     * toggle between codeview and editor
     * @return {?}
     */
    toggleCodeEditor() {
        this.codeEditorMode = !this.codeEditorMode;
        if (this.codeEditorMode) {
            this.ngxCodeMirror = fromTextArea(this.codeEditor.nativeElement, codeMirrorConfig);
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
    }
    /**
     * toggles placeholder based on input string
     *
     * @param {?} value A HTML string from the editor
     * @return {?}
     */
    togglePlaceholder(value) {
        if (!value || value === '<br>' || value === '') {
            this._renderer.addClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        else {
            this._renderer.removeClass(this.ngxWrapper.nativeElement, 'show-placeholder');
        }
        return;
    }
    /**
     * returns a json containing input params
     * @return {?}
     */
    getCollectiveParams() {
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
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /**
         * set configuartion
         */
        this.config = this.Utils.getEditorConfiguration(this.config, ngxEditorConfig, this.getCollectiveParams());
        this.height = this.height || this.textArea.nativeElement.offsetHeight;
        this.executeCommand('enableObjectResizing');
    }
}
NgxEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor',
                template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" [hidden]=\"codeEditorMode\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n      [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\" (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <textarea [attr.placeholder]=\"placeholder || config['placeholder']\" [hidden]=\"true\" #ngxCodeEditor></textarea>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NgxEditorComponent),
                        multi: true
                    }
                ],
                styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}.ngx-editor ::ng-deep .CodeMirror{border:1px solid #ddd;z-index:2}.ngx-editor ::ng-deep .CodeMirror .CodeMirror-placeholder{color:#6c757d}"]
            }] }
];
/** @nocollapse */
NgxEditorComponent.ctorParameters = () => [
    { type: MessageService },
    { type: CommandExecutorService },
    { type: Renderer2 }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxGrippieComponent {
    /**
     * Constructor
     *
     * @param {?} _editorComponent Editor component
     */
    constructor(_editorComponent) {
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
     * @param {?} event Mouseevent
     *
     * Update the height of the editor when the grabber is dragged
     * @return {?}
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
     * @param {?} event Mouseevent
     *
     * set the grabber to false on mouse up action
     * @return {?}
     */
    onMouseUp(event) {
        this.grabber = false;
    }
    /**
     * @param {?} event
     * @param {?=} resizer
     * @return {?}
     */
    onResize(event, resizer) {
        this.grabber = true;
        this.oldY = event.clientY;
        event.preventDefault();
    }
}
NgxGrippieComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-grippie',
                template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
            }] }
];
/** @nocollapse */
NgxGrippieComponent.ctorParameters = () => [
    { type: NgxEditorComponent }
];
NgxGrippieComponent.propDecorators = {
    onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }],
    onMouseUp: [{ type: HostListener, args: ['document:mouseup', ['$event'],] }],
    onResize: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorMessageComponent {
    /**
     * @param {?} _messageService service to send message to the editor
     */
    constructor(_messageService) {
        this._messageService = _messageService;
        /**
         * property that holds the message to be displayed on the editor
         */
        this.ngxMessage = undefined;
        this._messageService.getMessage().subscribe((message) => this.ngxMessage = message);
    }
    /**
     * clears editor message
     * @return {?}
     */
    clearMessage() {
        this.ngxMessage = undefined;
        return;
    }
}
NgxEditorMessageComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-message',
                template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
                styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
            }] }
];
/** @nocollapse */
NgxEditorMessageComponent.ctorParameters = () => [
    { type: MessageService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorToolbarComponent {
    /**
     * @param {?} _popOverConfig
     * @param {?} _formBuilder
     * @param {?} _messageService
     * @param {?} _commandExecutorService
     */
    constructor(_popOverConfig, _formBuilder, _messageService, _commandExecutorService) {
        this._popOverConfig = _popOverConfig;
        this._formBuilder = _formBuilder;
        this._messageService = _messageService;
        this._commandExecutorService = _commandExecutorService;
        /**
         * set to false when image is being uploaded
         */
        this.uploadComplete = true;
        /**
         * upload percentage
         */
        this.updloadPercentage = 0;
        /**
         * set to true when the image is being uploaded
         */
        this.isUploading = false;
        /**
         * which tab to active for color insetion
         */
        this.selectedColorTab = 'textColor';
        /**
         * font family name
         */
        this.fontName = '';
        /**
         * font size
         */
        this.fontSize = '';
        /**
         * hex color code
         */
        this.hexColor = '';
        /**
         * show/hide image uploader
         */
        this.isImageUploader = false;
        /**
         * Emits an event when a toolbar button is clicked
         */
        this.execute = new EventEmitter();
        this._popOverConfig.outsideClick = true;
        this._popOverConfig.placement = 'bottom';
        this._popOverConfig.container = 'body';
    }
    /**
     * enable or diable toolbar based on configuration
     *
     * @param {?} value name of the toolbar buttons
     * @return {?}
     */
    canEnableToolbarOptions(value) {
        return canEnableToolbarOptions(value, this.config['toolbar']);
    }
    /**
     * triggers command from the toolbar to be executed and emits an event
     *
     * @param {?} command name of the command to be executed
     * @return {?}
     */
    triggerCommand(command) {
        this.execute.emit(command);
    }
    /**
     * create URL insert form
     * @return {?}
     */
    buildUrlForm() {
        this.urlForm = this._formBuilder.group({
            urlLink: ['', [Validators.required]],
            urlText: ['', [Validators.required]],
            urlNewTab: [true]
        });
        return;
    }
    /**
     * inserts link in the editor
     * @return {?}
     */
    insertLink() {
        try {
            this._commandExecutorService.createLink(this.urlForm.value);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildUrlForm();
        /** close inset URL pop up */
        this.urlPopover.hide();
        return;
    }
    /**
     * create insert image form
     * @return {?}
     */
    buildImageForm() {
        this.imageForm = this._formBuilder.group({
            imageUrl: ['', [Validators.required]]
        });
        return;
    }
    /**
     * create insert image form
     * @return {?}
     */
    buildVideoForm() {
        this.videoForm = this._formBuilder.group({
            videoUrl: ['', [Validators.required]],
            height: [''],
            width: ['']
        });
        return;
    }
    /**
     * Executed when file is selected
     *
     * @param {?} e onChange event
     * @return {?}
     */
    onFileChange(e) {
        this.uploadComplete = false;
        this.isUploading = true;
        if (e.target.files.length > 0) {
            /** @type {?} */
            const file = e.target.files[0];
            try {
                this._commandExecutorService.uploadImage(file, this.config.imageEndPoint, this.config.headers).subscribe(event => {
                    if (event.type) {
                        this.updloadPercentage = Math.round(100 * event.loaded / event.total);
                    }
                    if (event instanceof HttpResponse) {
                        try {
                            if (this.config.responseEndPoint) {
                                this._commandExecutorService.insertImage(this.config.responseEndPoint + event.body.url);
                            }
                            else {
                                this._commandExecutorService.insertImage(event.body.url);
                            }
                        }
                        catch (error) {
                            this._messageService.sendMessage(error.message);
                        }
                        this.uploadComplete = true;
                        this.isUploading = false;
                    }
                });
            }
            catch (error) {
                this._messageService.sendMessage(error.message);
                this.uploadComplete = true;
                this.isUploading = false;
            }
        }
        return;
    }
    /**
     * insert image in the editor
     * @return {?}
     */
    insertImage() {
        try {
            this._commandExecutorService.insertImage(this.imageForm.value.imageUrl);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildImageForm();
        /** close inset URL pop up */
        this.imagePopover.hide();
        return;
    }
    /**
     * insert image in the editor
     * @return {?}
     */
    insertVideo() {
        try {
            this._commandExecutorService.insertVideo(this.videoForm.value);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        /** reset form to default */
        this.buildVideoForm();
        /** close inset URL pop up */
        this.videoPopover.hide();
        return;
    }
    /**
     * inser text/background color
     * @param {?} color
     * @param {?} where
     * @return {?}
     */
    insertColor(color, where) {
        try {
            this._commandExecutorService.insertColor(color, where);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.colorPopover.hide();
        return;
    }
    /**
     * set font size
     * @param {?} fontSize
     * @return {?}
     */
    setFontSize(fontSize) {
        try {
            this._commandExecutorService.setFontSize(fontSize);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.fontSizePopover.hide();
        return;
    }
    /**
     * set font Name/family
     * @param {?} fontName
     * @return {?}
     */
    setFontName(fontName) {
        try {
            this._commandExecutorService.setFontName(fontName);
        }
        catch (error) {
            this._messageService.sendMessage(error.message);
        }
        this.fontSizePopover.hide();
        return;
    }
    /**
     * allow only numbers
     *
     * @param {?} event keypress event
     * @return {?}
     */
    onlyNumbers(event) {
        return event.charCode >= 48 && event.charCode <= 57;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.buildUrlForm();
        this.buildImageForm();
        this.buildVideoForm();
    }
}
NgxEditorToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-ngx-editor-toolbar',
                template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\"\n            (click)=\"triggerCommand('bold')\"\n            title=\"Bold\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\"\n            (click)=\"triggerCommand('italic')\"\n            title=\"Italic\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\"\n            (click)=\"triggerCommand('underline')\"\n            title=\"Underline\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\"\n            (click)=\"triggerCommand('strikeThrough')\"\n            title=\"Strikethrough\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\"\n            (click)=\"triggerCommand('superscript')\"\n            title=\"Superscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\"\n            (click)=\"triggerCommand('subscript')\"\n            title=\"Subscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n            title=\"Font Family\"\n            [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n            title=\"Font Size\"\n            [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n            title=\"Color Picker\"\n            [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\"\n            (click)=\"triggerCommand('justifyLeft')\"\n            title=\"Justify Left\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\"\n            (click)=\"triggerCommand('justifyCenter')\"\n            title=\"Justify Center\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\"\n            (click)=\"triggerCommand('justifyRight')\"\n            title=\"Justify Right\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\"\n            (click)=\"triggerCommand('justifyFull')\"\n            title=\"Justify\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\"\n            (click)=\"triggerCommand('indent')\"\n            title=\"Indent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\"\n            (click)=\"triggerCommand('outdent')\"\n            title=\"Outdent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\"\n            (click)=\"triggerCommand('cut')\" title=\"Cut\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\"\n            (click)=\"triggerCommand('copy')\"\n            title=\"Copy\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-clone\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\"\n            (click)=\"triggerCommand('delete')\"\n            title=\"Delete\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\"\n            (click)=\"triggerCommand('removeFormat')\"\n            title=\"Clear Formatting\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\"\n            (click)=\"triggerCommand('undo')\"\n            title=\"Undo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\"\n            (click)=\"triggerCommand('redo')\"\n            title=\"Redo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\"\n            (click)=\"triggerCommand('insertParagraph')\"\n            title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\"\n            (click)=\"triggerCommand('blockquote')\"\n            title=\"Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\"\n            (click)=\"triggerCommand('removeBlockquote')\"\n            title=\"Remove Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\"\n            (click)=\"triggerCommand('insertHorizontalRule')\"\n            title=\"Horizontal Line\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\"\n            (click)=\"triggerCommand('insertUnorderedList')\"\n            title=\"Unordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\"\n            (click)=\"triggerCommand('insertOrderedList')\"\n            title=\"Ordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n            [popover]=\"insertLinkTemplate\"\n            title=\"Insert Link\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\"\n            (click)=\"triggerCommand('unlink')\"\n            title=\"Unlink\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n            title=\"Insert Image\"\n            [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-image\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n            title=\"Insert Video\"\n            [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('code')\"\n            (click)=\"triggerCommand('code')\"\n            title=\"View Code\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-code\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n               required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">Open in new tab</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fas fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fas fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"></div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"></div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Choose Image</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Uploading Image</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\"\n                   [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n                   required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\"\n             [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n             [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fas fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n                 required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"height (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"width (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Text</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Background</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <form autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"hexInput\" class=\"small\">Hex Color</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"hexInput\" name=\"hexInput\" maxlength=\"7\" placeholder=\"HEX Color\"\n                 [(ngModel)]=\"hexColor\"\n                 required>\n        </div>\n        <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(hexColor, selectedColorTab)\">Submit\n        </button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Font size in px/rem\"\n               [(ngModel)]=\"fontSize\"\n               required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\"\n               placeholder=\"Ex: 'Times New Roman', Times, serif\"\n               [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n",
                providers: [PopoverConfig],
                styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{background-color:#f5f5f5;font-size:.8rem;padding:.2rem;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;float:left;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;text-align:center;display:inline-block;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
            }] }
];
/** @nocollapse */
NgxEditorToolbarComponent.ctorParameters = () => [
    { type: PopoverConfig },
    { type: FormBuilder },
    { type: MessageService },
    { type: CommandExecutorService }
];
NgxEditorToolbarComponent.propDecorators = {
    config: [{ type: Input }],
    urlPopover: [{ type: ViewChild, args: ['urlPopover',] }],
    imagePopover: [{ type: ViewChild, args: ['imagePopover',] }],
    videoPopover: [{ type: ViewChild, args: ['videoPopover',] }],
    fontSizePopover: [{ type: ViewChild, args: ['fontSizePopover',] }],
    colorPopover: [{ type: ViewChild, args: ['colorPopover',] }],
    execute: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxEditorModule {
}
NgxEditorModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, ReactiveFormsModule, PopoverModule.forRoot()],
                declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                exports: [NgxEditorComponent, PopoverModule],
                providers: [CommandExecutorService, MessageService]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgxEditorModule, CommandExecutorService as ɵc, MessageService as ɵb, NgxEditorMessageComponent as ɵe, NgxEditorToolbarComponent as ɵf, NgxEditorComponent as ɵa, NgxGrippieComponent as ɵd };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscy50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWdyaXBwaWUvbmd4LWdyaXBwaWUuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItbWVzc2FnZS9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL25neC1lZGl0b3IubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZW5hYmxlIG9yIGRpc2FibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHZhbHVlIHRvb2xiYXIgaXRlbVxuICogQHBhcmFtIHRvb2xiYXIgdG9vbGJhciBjb25maWd1cmF0aW9uIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuRW5hYmxlVG9vbGJhck9wdGlvbnModmFsdWU6IHN0cmluZywgdG9vbGJhcjogYW55KTogYm9vbGVhbiB7XG5cbiAgICBpZiAodmFsdWUpIHtcblxuICAgICAgICBpZiAodG9vbGJhclsnbGVuZ3RoJ10gPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IHRvb2xiYXIuZmlsdGVyKGFycmF5ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmb3VuZC5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIHNldCBlZGl0b3IgY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSBjb25maWd1cmF0aW9uIHZpYSBbY29uZmlnXSBwcm9wZXJ0eVxuICogQHBhcmFtIG5neEVkaXRvckNvbmZpZyBkZWZhdWx0IGVkaXRvciBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gaW5wdXQgZGlyZWN0IGNvbmZpZ3VyYXRpb24gaW5wdXRzIHZpYSBkaXJlY3RpdmVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3JDb25maWd1cmF0aW9uKHZhbHVlOiBhbnksIG5neEVkaXRvckNvbmZpZzogYW55LCBpbnB1dDogYW55KTogYW55IHtcblxuICAgIGZvciAoY29uc3QgaSBpbiBuZ3hFZGl0b3JDb25maWcpIHtcbiAgICAgICAgaWYgKGkpIHtcblxuICAgICAgICAgICAgaWYgKGlucHV0W2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVtpXSA9IGlucHV0W2ldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbHVlLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbaV0gPSBuZ3hFZGl0b3JDb25maWdbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogcmV0dXJuIHZlcnRpY2FsIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByZXNpemVyIHByb3BlcnR5IGlzIHNldCB0byBiYXNpY1xuICpcbiAqIEBwYXJhbSByZXNpemVyIHR5cGUgb2YgcmVzaXplciwgZWl0aGVyIGJhc2ljIG9yIHN0YWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXNpemUocmVzaXplcjogc3RyaW5nKTogYW55IHtcbiAgICBpZiAocmVzaXplciA9PT0gJ2Jhc2ljJykge1xuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNhdmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTZWxlY3Rpb24oKTogYW55IHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIGlmIChzZWwuZ2V0UmFuZ2VBdCAmJiBzZWwucmFuZ2VDb3VudCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbC5nZXRSYW5nZUF0KDApO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24gJiYgZG9jdW1lbnQuY3JlYXRlUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIHJlc3RvcmUgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBpblxuICpcbiAqIEBwYXJhbSByYW5nZSBzYXZlZCBzZWxlY3Rpb24gd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkIG91dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZVNlbGVjdGlvbihyYW5nZSk6IGJvb2xlYW4ge1xuICAgIGlmIChyYW5nZSkge1xuICAgICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbiAmJiByYW5nZS5zZWxlY3QpIHtcbiAgICAgICAgICAgIHJhbmdlLnNlbGVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB7XG5cbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXG4gIHNhdmVkU2VsZWN0aW9uOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBfaHR0cCBIVFRQIENsaWVudCBmb3IgbWFraW5nIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHBDbGllbnQpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBleGVjdXRlcyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICghdGhpcy5zYXZlZFNlbGVjdGlvbiAmJiBjb21tYW5kICE9PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiBFZGl0b3InKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2VuYWJsZU9iamVjdFJlc2l6aW5nJykge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJywgdHJ1ZSwgJ3RydWUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2Jsb2NrcXVvdGUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ3JlbW92ZUJsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQsIGZhbHNlLCBudWxsKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVVSSSB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRJbWFnZShpbWFnZVVSSTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIGlmIChpbWFnZVVSSSkge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGNvbnN0IGluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEltYWdlJywgZmFsc2UsIGltYWdlVVJJKTtcbiAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVVJMJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmlkZVBhcmFtcyB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKHZpZGVQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1lvdXR1YmVMaW5rKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICsgJ3NyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoeW91dHViZVVSTCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkVVJMKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgICArICcgY29udHJvbHM9XCJ0cnVlXCI+PHNvdXJjZSBzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L3ZpZGVvPic7XG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh2aWRlb1NyYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmlkZW8gVVJMJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gaW5zZXJ0IHZpZGVvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyB0aGUgaW5wdXQgdXJsIGlzIGEgdmFsaWQgeW91dHViZSBVUkwgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBpc1lvdXR1YmVMaW5rKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcbiAgICByZXR1cm4geXRSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBpcyBhIHZhbGlkIHVybCBvciBub3RcbiAgICogQHBhcmFtIHVybCB1cmxcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZFVSTCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcbiAgICByZXR1cm4gdXJsUmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGxvYWRzIGltYWdlIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHBhcmFtIGZpbGUgZmlsZSB0aGF0IGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKiBAcGFyYW0gZW5kUG9pbnQgZW5wb2ludCB0byB3aGljaCB0aGUgaW1hZ2UgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqL1xuICB1cGxvYWRJbWFnZShmaWxlOiBGaWxlLCBlbmRQb2ludDogc3RyaW5nLCBoZWFkZXJzPzogYW55KTogYW55IHtcblxuICAgIGlmICghZW5kUG9pbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgRW5kcG9pbnQgaXNuYHQgcHJvdmlkZWQgb3IgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgaWYgKGZpbGUpIHtcblxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cbiAgICAgIGxldCByZXF1ZXN0SGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgICBjb25zdCBoZWFkZXJLZXlzID0gT2JqZWN0LmtleXMoaGVhZGVycyk7XG4gICAgICBmb3IgKGNvbnN0IGhlYWRlcktleSBvZiBoZWFkZXJLZXlzKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXIgPSByZXF1ZXN0SGVhZGVyLnNldChoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBlbmRQb2ludCwgZm9ybURhdGEsIHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHJlcXVlc3RIZWFkZXJcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgcGFyYW1ldGVycyB0aGF0IGhvbGRzIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpbmtcbiAgICovXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGNoZWNrIHdoZXRoZXIgdGhlIHNhdmVkIHNlbGVjdGlvbiBjb250YWlucyBhIHJhbmdlIG9yIHBsYWluIHNlbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xuICAgICAgICBjb25zdCBuZXdVcmwgPSAnPGEgaHJlZj1cIicgKyBwYXJhbXMudXJsTGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgcGFyYW1zLnVybFRleHQgKyAnPC9hPic7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcbiAgICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjcmVhdGVMaW5rJywgZmFsc2UsIHBhcmFtcy51cmxMaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydCBjb2xvciBlaXRoZXIgZm9udCBvciBiYWNrZ3JvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjb2xvciBjb2xvciB0byBiZSBpbnNlcnRlZFxuICAgKiBAcGFyYW0gd2hlcmUgd2hlcmUgdGhlIGNvbG9yIGhhcyB0byBiZSBpbnNlcnRlZCBlaXRoZXIgdGV4dC9iYWNrZ3JvdW5kXG4gICAqL1xuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgaWYgKHJlc3RvcmVkICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgICBpZiAod2hlcmUgPT09ICd0ZXh0Q29sb3InKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2hpbGl0ZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogc2V0IGZvbnQgc2l6ZSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udFNpemUgZm9udC1zaXplIHRvIGJlIHNldFxuICAgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udFNpemUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBuYW1lL2ZhbWlseSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udE5hbWUgZm9udC1mYW1pbHkgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJ3B4O1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IEhUTUwgKi9cbiAgcHJpdmF0ZSBpbnNlcnRIdG1sKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgaXNIVE1MSW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBodG1sKTtcblxuICAgIGlmICghaXNIVE1MSW5zZXJ0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvbicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBhIG51bWJlciBvciBzdHJpbmdcbiAgICogaWYgbnVtYmVyIHJldHVybiB0cnVlXG4gICAqIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAqL1xuICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9eLXswLDF9XFxkKyQvLnRlc3QodmFsdWUpO1xuICB9XG5cbiAgLyoqIGRlbGV0ZSB0aGUgdGV4dCBhdCBzZWxlY3RlZCByYW5nZSBhbmQgcmV0dXJuIHRoZSB2YWx1ZSAqL1xuICBwcml2YXRlIGRlbGV0ZUFuZEdldEVsZW1lbnQoKTogYW55IHtcblxuICAgIGxldCBzbGVjdGVkVGV4dDtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuc2F2ZWRTZWxlY3Rpb24uZGVsZXRlQ29udGVudHMoKTtcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfVxuXG4gIC8qKiBjaGVjayBhbnkgc2xlY3Rpb24gaXMgbWFkZSBvciBub3QgKi9cbiAgcHJpdmF0ZSBjaGVja1NlbGVjdGlvbigpOiBhbnkge1xuXG4gICAgY29uc3Qgc2xlY3RlZFRleHQgPSB0aGlzLnNhdmVkU2VsZWN0aW9uLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoc2xlY3RlZFRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFNlbGVjdGlvbiBNYWRlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgdGFnIGlzIHN1cHBvcnRlZCBieSBicm93c2VyIG9yIG5vdFxuICAgKlxuICAgKiBAcGFyYW0gdGFnIEhUTUwgdGFnXG4gICAqL1xuICBwcml2YXRlIGNoZWNrVGFnU3VwcG9ydEluQnJvd3Nlcih0YWc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKSBpbnN0YW5jZW9mIEhUTUxVbmtub3duRWxlbWVudCk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiB0aW1lIGluIHdoaWNoIHRoZSBtZXNzYWdlIGhhcyB0byBiZSBjbGVhcmVkICovXG5jb25zdCBEVVJBVElPTiA9IDcwMDA7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXNzYWdlU2VydmljZSB7XG5cbiAgLyoqIHZhcmlhYmxlIHRvIGhvbGQgdGhlIHVzZXIgbWVzc2FnZSAqL1xuICBwcml2YXRlIG1lc3NhZ2U6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvKiogcmV0dXJucyB0aGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBlZGl0b3IgKi9cbiAgZ2V0TWVzc2FnZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogc2VuZHMgbWVzc2FnZSB0byB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBtZXNzYWdlIG1lc3NhZ2UgdG8gYmUgc2VudFxuICAgKi9cbiAgc2VuZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlLm5leHQobWVzc2FnZSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VJbihEVVJBVElPTik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGEgc2hvcnQgaW50ZXJ2YWwgdG8gY2xlYXIgbWVzc2FnZVxuICAgKlxuICAgKiBAcGFyYW0gbWlsbGlzZWNvbmRzIHRpbWUgaW4gc2Vjb25kcyBpbiB3aGljaCB0aGUgbWVzc2FnZSBoYXMgdG8gYmUgY2xlYXJlZFxuICAgKi9cbiAgcHJpdmF0ZSBjbGVhck1lc3NhZ2VJbihtaWxsaXNlY29uZHM6IG51bWJlcik6IHZvaWQge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5tZXNzYWdlLm5leHQodW5kZWZpbmVkKTtcbiAgICB9LCBtaWxsaXNlY29uZHMpO1xuICAgIHJldHVybjtcbiAgfVxuXG59XG4iLCIvKipcbiAqIHRvb2xiYXIgZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBuZ3hFZGl0b3JDb25maWcgPSB7XG4gIGVkaXRhYmxlOiB0cnVlLFxuICBzcGVsbGNoZWNrOiB0cnVlLFxuICBoZWlnaHQ6ICdhdXRvJyxcbiAgbWluSGVpZ2h0OiAnMCcsXG4gIHdpZHRoOiAnYXV0bycsXG4gIG1pbldpZHRoOiAnMCcsXG4gIHRyYW5zbGF0ZTogJ3llcycsXG4gIGVuYWJsZVRvb2xiYXI6IHRydWUsXG4gIHNob3dUb29sYmFyOiB0cnVlLFxuICBwbGFjZWhvbGRlcjogJ0VudGVyIHRleHQgaGVyZS4uLicsXG4gIGltYWdlRW5kUG9pbnQ6ICcnLFxuICB0b29sYmFyOiBbXG4gICAgWydib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdXBlcnNjcmlwdCcsICdzdWJzY3JpcHQnXSxcbiAgICBbJ2ZvbnROYW1lJywgJ2ZvbnRTaXplJywgJ2NvbG9yJ10sXG4gICAgWydqdXN0aWZ5TGVmdCcsICdqdXN0aWZ5Q2VudGVyJywgJ2p1c3RpZnlSaWdodCcsICdqdXN0aWZ5RnVsbCcsICdpbmRlbnQnLCAnb3V0ZGVudCddLFxuICAgIFsnY3V0JywgJ2NvcHknLCAnZGVsZXRlJywgJ3JlbW92ZUZvcm1hdCcsICd1bmRvJywgJ3JlZG8nXSxcbiAgICBbJ3BhcmFncmFwaCcsICdibG9ja3F1b3RlJywgJ3JlbW92ZUJsb2NrcXVvdGUnLCAnaG9yaXpvbnRhbExpbmUnLCAnb3JkZXJlZExpc3QnLCAndW5vcmRlcmVkTGlzdCddLFxuICAgIFsnbGluaycsICd1bmxpbmsnLCAnaW1hZ2UnLCAndmlkZW8nXSxcbiAgICBbJ2NvZGUnXVxuICBdLFxuICBoZWFkZXJzOiB7fSxcbiAgcmVzcG9uc2VFbmRQb2ludDogbnVsbCxcbiAgYXBwZW5kSW1hZ2VFbmRQb2ludFRvUmVzcG9uc2U6IHRydWVcbn07XG5cbi8qKlxuICogY29kZW1pcnJvciBjb25maWd1YXJhdGlvblxuICovXG5leHBvcnQgY29uc3QgY29kZU1pcnJvckNvbmZpZyA9IHtcbiAgbGluZU51bWJlcnM6IHRydWUsXG4gIGd1dHRlcjogdHJ1ZSxcbiAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICBtb2RlOiAnaHRtbG1peGVkJyxcbiAgYXV0b2ZvY3VzOiB0cnVlLFxuICBodG1sTW9kZTogdHJ1ZVxufTtcbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsXG4gIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcic7XG5pbXBvcnQgJ2NvZGVtaXJyb3IvYWRkb24vZGlzcGxheS9wbGFjZWhvbGRlci5qcyc7XG5pbXBvcnQgJ2NvZGVtaXJyb3IvbW9kZS9odG1sbWl4ZWQvaHRtbG1peGVkLmpzJztcblxuaW1wb3J0IHtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuaW1wb3J0IHtuZ3hFZGl0b3JDb25maWcsIGNvZGVNaXJyb3JDb25maWd9IGZyb20gJy4vY29tbW9uL25neC1lZGl0b3IuZGVmYXVsdHMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmd4RWRpdG9yQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG5cbiAgLyoqIFNwZWNpZmllcyB3ZWF0aGVyIHRoZSB0ZXh0YXJlYSB0byBiZSBlZGl0YWJsZSBvciBub3QgKi9cbiAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XG4gIC8qKiBUaGUgc3BlbGxjaGVjayBwcm9wZXJ0eSBzcGVjaWZpZXMgd2hldGhlciB0aGUgZWxlbWVudCBpcyB0byBoYXZlIGl0cyBzcGVsbGluZyBhbmQgZ3JhbW1hciBjaGVja2VkIG9yIG5vdC4gKi9cbiAgQElucHV0KCkgc3BlbGxjaGVjazogYm9vbGVhbjtcbiAgLyoqIFBsYWNlaG9sZGVyIGZvciB0aGUgdGV4dEFyZWEgKi9cbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0cmFuc2xhdGUgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudCBzaG91bGQgYmUgdHJhbnNsYXRlZCBvciBub3QuXG4gICAqXG4gICAqIENoZWNrIGh0dHBzOi8vd3d3Lnczc2Nob29scy5jb20vdGFncy9hdHRfZ2xvYmFsX3RyYW5zbGF0ZS5hc3AgZm9yIG1vcmUgaW5mb3JtYXRpb24gYW5kIGJyb3dzZXIgc3VwcG9ydFxuICAgKi9cbiAgQElucHV0KCkgdHJhbnNsYXRlOiBzdHJpbmc7XG4gIC8qKiBTZXRzIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIGhlaWdodCBmb3IgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBtaW5IZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgV2lkdGggb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuICAvKiogU2V0cyBtaW5pbXVtIHdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluV2lkdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRvb2xiYXIgYWNjZXB0cyBhbiBhcnJheSB3aGljaCBzcGVjaWZpZXMgdGhlIG9wdGlvbnMgdG8gYmUgZW5hYmxlZCBmb3IgdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQ2hlY2sgbmd4RWRpdG9yQ29uZmlnIGZvciB0b29sYmFyIGNvbmZpZ3VyYXRpb25cbiAgICpcbiAgICogUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIGVuYWJsZSBhbGwgdG9vbGJhclxuICAgKi9cbiAgQElucHV0KCkgdG9vbGJhcjogT2JqZWN0O1xuICAvKipcbiAgICogVGhlIGVkaXRvciBjYW4gYmUgcmVzaXplZCB2ZXJ0aWNhbGx5LlxuICAgKlxuICAgKiBgYmFzaWNgIHJlc2l6ZXIgZW5hYmxlcyB0aGUgaHRtbDUgcmVzemllci4gQ2hlY2sgaGVyZSBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL2Nzc3JlZi9jc3MzX3ByX3Jlc2l6ZS5hc3BcbiAgICpcbiAgICogYHN0YWNrYCByZXNpemVyIGVuYWJsZSBhIHJlc2l6ZXIgdGhhdCBsb29rcyBsaWtlIGFzIGlmIGluIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb21cbiAgICovXG4gIEBJbnB1dCgpIHJlc2l6ZXIgPSAnc3RhY2snO1xuICAvKipcbiAgICogVGhlIGNvbmZpZyBwcm9wZXJ0eSBpcyBhIEpTT04gb2JqZWN0XG4gICAqXG4gICAqIEFsbCBhdmFpYmFsZSBpbnB1dHMgaW5wdXRzIGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgY29uZmlndXJhdGlvbiBhcyBKU09OXG4gICAqIGlucHV0cyBwcm92aWRlZCBkaXJlY3RseSBhcmUgY29uc2lkZXJlZCBhcyB0b3AgcHJpb3JpdHlcbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZyA9IG5neEVkaXRvckNvbmZpZztcbiAgLyoqIFdlYXRoZXIgdG8gc2hvdyBvciBoaWRlIHRvb2xiYXIgKi9cbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBXZWF0aGVyIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIGVuYWJsZVRvb2xiYXI6IGJvb2xlYW47XG4gIC8qKiBFbmRwb2ludCBmb3Igd2hpY2ggdGhlIGltYWdlIHRvIGJlIHVwbG9hZGVkICovXG4gIEBJbnB1dCgpIGltYWdlRW5kUG9pbnQ6IHN0cmluZztcblxuICAvKiogZW1pdHMgYGJsdXJgIGV2ZW50IHdoZW4gZm9jdXNlZCBvdXQgZnJvbSB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGJsdXI6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIC8qKiBlbWl0cyBgZm9jdXNgIGV2ZW50IHdoZW4gZm9jdXNlZCBpbiB0byB0aGUgdGV4dGFyZWEgKi9cbiAgQE91dHB1dCgpIGZvY3VzOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ25neFRleHRBcmVhJykgdGV4dEFyZWE6IGFueTtcbiAgQFZpZXdDaGlsZCgnbmd4Q29kZUVkaXRvcicpIGNvZGVFZGl0b3I6IGFueTtcbiAgQFZpZXdDaGlsZCgnbmd4V3JhcHBlcicpIG5neFdyYXBwZXI6IGFueTtcblxuICBVdGlsczogYW55ID0gVXRpbHM7XG4gIGNvZGVFZGl0b3JNb2RlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBuZ3hDb2RlTWlycm9yOiBhbnkgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICBwcml2YXRlIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQHBhcmFtIF9tZXNzYWdlU2VydmljZSBzZXJ2aWNlIHRvIHNlbmQgbWVzc2FnZSB0byB0aGUgZWRpdG9yIG1lc3NhZ2UgY29tcG9uZW50XG4gICAqIEBwYXJhbSBfY29tbWFuZEV4ZWN1dG9yIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxuICAgKiBAcGFyYW0gX3JlbmRlcmVyIGFjY2VzcyBhbmQgbWFuaXB1bGF0ZSB0aGUgZG9tIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcbiAgICBwcml2YXRlIF9jb21tYW5kRXhlY3V0b3I6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgLyoqXG4gICAqIGV2ZW50c1xuICAgKi9cbiAgb25UZXh0QXJlYUZvY3VzKCk6IHZvaWQge1xuICAgIHRoaXMuZm9jdXMuZW1pdCgnZm9jdXMnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogZm9jdXMgdGhlIHRleHQgYXJlYSB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgKi9cbiAgb25FZGl0b3JGb2N1cygpIHtcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlZCBmcm9tIHRoZSBjb250ZW50ZWRpdGFibGUgc2VjdGlvbiB3aGlsZSB0aGUgaW5wdXQgcHJvcGVydHkgY2hhbmdlc1xuICAgKiBAcGFyYW0gaHRtbCBodG1sIHN0cmluZyBmcm9tIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgb25Db250ZW50Q2hhbmdlKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKGh0bWwpO1xuICAgICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcihodG1sKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBvblRleHRBcmVhQmx1cigpOiB2b2lkIHtcblxuICAgIC8qKiBzYXZlIHNlbGVjdGlvbiBpZiBmb2N1c3NlZCBvdXQgKi9cbiAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3Iuc2F2ZWRTZWxlY3Rpb24gPSBVdGlscy5zYXZlU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMub25Ub3VjaGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICB0aGlzLmJsdXIuZW1pdCgnYmx1cicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXNpemluZyB0ZXh0IGFyZWFcbiAgICpcbiAgICogQHBhcmFtIG9mZnNldFkgdmVydGljYWwgaGVpZ2h0IG9mIHRoZSBlaWR0YWJsZSBwb3J0aW9uIG9mIHRoZSBlZGl0b3JcbiAgICovXG4gIHJlc2l6ZVRleHRBcmVhKG9mZnNldFk6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBuZXdIZWlnaHQgPSBwYXJzZUludCh0aGlzLmhlaWdodCwgMTApO1xuICAgIG5ld0hlaWdodCArPSBvZmZzZXRZO1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgY29kZS1lZGl0b3IgaGVpZ2h0IG9ubHkgb24gZWRpdG9yIG1vZGVcbiAgICAgKi9cbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yTW9kZSkge1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnNldFNpemUoJzEwMCUnLCB0aGlzLmhlaWdodCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBlZGl0b3IgYWN0aW9ucywgaS5lLiwgZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmROYW1lIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGVDb21tYW5kKGNvbW1hbmROYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmIChjb21tYW5kTmFtZSA9PT0gJ2NvZGUnKSB7XG4gICAgICB0aGlzLnRvZ2dsZUNvZGVFZGl0b3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLmV4ZWN1dGUoY29tbWFuZE5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZSB0byBiZSBleGVjdXRlZCB3aGVuIHRoZXJlIGlzIGEgY2hhbmdlIGluIGNvbnRlbnRlZGl0YWJsZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICB0aGlzLnRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gJzxicj4nKSB7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5yZWZyZXNoVmlldyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIGNoYW5nZSBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIGZuIGEgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICAgKiB3aGVuIHRoZSBjb250cm9sIHJlY2VpdmVzIGEgdG91Y2ggZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZWZyZXNoIHZpZXcvSFRNTCBvZiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBodG1sIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcbiAgICovXG4gIHJlZnJlc2hWaWV3KHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LCAnaW5uZXJIVE1MJywgbm9ybWFsaXplZFZhbHVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogdG9nZ2xlIGJldHdlZW4gY29kZXZpZXcgYW5kIGVkaXRvclxuICAgKi9cbiAgdG9nZ2xlQ29kZUVkaXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLmNvZGVFZGl0b3JNb2RlID0gIXRoaXMuY29kZUVkaXRvck1vZGU7XG5cbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yTW9kZSkge1xuXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSh0aGlzLmNvZGVFZGl0b3IubmF0aXZlRWxlbWVudCwgY29kZU1pcnJvckNvbmZpZyk7XG5cbiAgICAgIC8qKiBzZXQgdmFsdWUgb2YgdGhlIGNvZGUgZWRpdG9yICovXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3Iuc2V0VmFsdWUodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG5cbiAgICAgIC8qKiBzZXRzIGhlaWdodCBvZiB0aGUgY29kZSBlZGl0b3IgYXMgc2FtZSBhcyB0aGUgaGVpZ2h0IG9mIHRoZSB0ZXh0QXJlYSAqL1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnNldFNpemUoJzEwMCUnLCB0aGlzLmhlaWdodCk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvKiogcmVtb3ZlLyBkZXN0cm95IGNvZGUgZWRpdG9yICovXG4gICAgICB0aGlzLm5neENvZGVNaXJyb3IudG9UZXh0QXJlYSgpO1xuXG4gICAgICAvKiogdXBkYXRlIHRoZSBtb2RlbCB2YWx1ZSBhbmQgaHRtbCBjb250ZW50IG9uIHRoZSBjb250ZW50ZWRpdGFibGUgKi9cbiAgICAgIHRoaXMucmVmcmVzaFZpZXcodGhpcy5uZ3hDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UodGhpcy5uZ3hDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuXG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b2dnbGVzIHBsYWNlaG9sZGVyIGJhc2VkIG9uIGlucHV0IHN0cmluZ1xuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQSBIVE1MIHN0cmluZyBmcm9tIHRoZSBlZGl0b3JcbiAgICovXG4gIHRvZ2dsZVBsYWNlaG9sZGVyKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSAnPGJyPicgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLm5neFdyYXBwZXIubmF0aXZlRWxlbWVudCwgJ3Nob3ctcGxhY2Vob2xkZXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEganNvbiBjb250YWluaW5nIGlucHV0IHBhcmFtc1xuICAgKi9cbiAgZ2V0Q29sbGVjdGl2ZVBhcmFtcygpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBlZGl0YWJsZTogdGhpcy5lZGl0YWJsZSxcbiAgICAgIHNwZWxsY2hlY2s6IHRoaXMuc3BlbGxjaGVjayxcbiAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgIGVuYWJsZVRvb2xiYXI6IHRoaXMuZW5hYmxlVG9vbGJhcixcbiAgICAgIHNob3dUb29sYmFyOiB0aGlzLnNob3dUb29sYmFyLFxuICAgICAgaW1hZ2VFbmRQb2ludDogdGhpcy5pbWFnZUVuZFBvaW50LFxuICAgICAgdG9vbGJhcjogdGhpcy50b29sYmFyXG4gICAgfTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8qKlxuICAgICAqIHNldCBjb25maWd1YXJ0aW9uXG4gICAgICovXG4gICAgdGhpcy5jb25maWcgPSB0aGlzLlV0aWxzLmdldEVkaXRvckNvbmZpZ3VyYXRpb24odGhpcy5jb25maWcsIG5neEVkaXRvckNvbmZpZywgdGhpcy5nZXRDb2xsZWN0aXZlUGFyYW1zKCkpO1xuXG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgdGhpcy5leGVjdXRlQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuLi9uZ3gtZWRpdG9yLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZ3JpcHBpZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1ncmlwcGllLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ3hHcmlwcGllQ29tcG9uZW50IHtcblxuICAvKiogaGVpZ2h0IG9mIHRoZSBlZGl0b3IgKi9cbiAgaGVpZ2h0OiBudW1iZXI7XG4gIC8qKiBwcmV2aW91cyB2YWx1ZSBiZWZvciByZXNpemluZyB0aGUgZWRpdG9yICovXG4gIG9sZFkgPSAwO1xuICAvKiogc2V0IHRvIHRydWUgb24gbW91c2Vkb3duIGV2ZW50ICovXG4gIGdyYWJiZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIF9lZGl0b3JDb21wb25lbnQgRWRpdG9yIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWRpdG9yQ29tcG9uZW50OiBOZ3hFZGl0b3JDb21wb25lbnQpIHsgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgTW91c2VldmVudFxuICAgKlxuICAgKiBVcGRhdGUgdGhlIGhlaWdodCBvZiB0aGUgZWRpdG9yIHdoZW4gdGhlIGdyYWJiZXIgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSkgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcblxuICAgIGlmICghdGhpcy5ncmFiYmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZWRpdG9yQ29tcG9uZW50LnJlc2l6ZVRleHRBcmVhKGV2ZW50LmNsaWVudFkgLSB0aGlzLm9sZFkpO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IE1vdXNlZXZlbnRcbiAgICpcbiAgICogc2V0IHRoZSBncmFiYmVyIHRvIGZhbHNlIG9uIG1vdXNlIHVwIGFjdGlvblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcsIFsnJGV2ZW50J10pIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuZ3JhYmJlciA9IGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSkgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHJlc2l6ZXI/OiBGdW5jdGlvbikge1xuICAgIHRoaXMuZ3JhYmJlciA9IHRydWU7XG4gICAgdGhpcy5vbGRZID0gZXZlbnQuY2xpZW50WTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci1tZXNzYWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItbWVzc2FnZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3ItbWVzc2FnZS5jb21wb25lbnQuc2NzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yTWVzc2FnZUNvbXBvbmVudCB7XG5cbiAgLyoqIHByb3BlcnR5IHRoYXQgaG9sZHMgdGhlIG1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIG9uIHRoZSBlZGl0b3IgKi9cbiAgbmd4TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHBhcmFtIF9tZXNzYWdlU2VydmljZSBzZXJ2aWNlIHRvIHNlbmQgbWVzc2FnZSB0byB0aGUgZWRpdG9yXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcbiAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5nZXRNZXNzYWdlKCkuc3Vic2NyaWJlKChtZXNzYWdlOiBzdHJpbmcpID0+IHRoaXMubmd4TWVzc2FnZSA9IG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNsZWFycyBlZGl0b3IgbWVzc2FnZVxuICAgKi9cbiAgY2xlYXJNZXNzYWdlKCk6IHZvaWQge1xuICAgIHRoaXMubmd4TWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm47XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9yc30gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7UG9wb3ZlckNvbmZpZ30gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQge0NvbW1hbmRFeGVjdXRvclNlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi9jb21tb24vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZ3gtZWRpdG9yLXRvb2xiYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1BvcG92ZXJDb25maWddXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yVG9vbGJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IGxpbmsgZm9ybSAqL1xuICB1cmxGb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBpbWFnZSBmb3JtICovXG4gIGltYWdlRm9ybTogRm9ybUdyb3VwO1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgdmlkZW8gZm9ybSAqL1xuICB2aWRlb0Zvcm06IEZvcm1Hcm91cDtcbiAgLyoqIHNldCB0byBmYWxzZSB3aGVuIGltYWdlIGlzIGJlaW5nIHVwbG9hZGVkICovXG4gIHVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcbiAgLyoqIHVwbG9hZCBwZXJjZW50YWdlICovXG4gIHVwZGxvYWRQZXJjZW50YWdlID0gMDtcbiAgLyoqIHNldCB0byB0cnVlIHdoZW4gdGhlIGltYWdlIGlzIGJlaW5nIHVwbG9hZGVkICovXG4gIGlzVXBsb2FkaW5nID0gZmFsc2U7XG4gIC8qKiB3aGljaCB0YWIgdG8gYWN0aXZlIGZvciBjb2xvciBpbnNldGlvbiAqL1xuICBzZWxlY3RlZENvbG9yVGFiID0gJ3RleHRDb2xvcic7XG4gIC8qKiBmb250IGZhbWlseSBuYW1lICovXG4gIGZvbnROYW1lID0gJyc7XG4gIC8qKiBmb250IHNpemUgKi9cbiAgZm9udFNpemUgPSAnJztcbiAgLyoqIGhleCBjb2xvciBjb2RlICovXG4gIGhleENvbG9yID0gJyc7XG4gIC8qKiBzaG93L2hpZGUgaW1hZ2UgdXBsb2FkZXIgKi9cbiAgaXNJbWFnZVVwbG9hZGVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVkaXRvciBjb25maWd1cmF0aW9uXG4gICAqL1xuICBASW5wdXQoKSBjb25maWc6IGFueTtcbiAgQFZpZXdDaGlsZCgndXJsUG9wb3ZlcicpIHVybFBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2ltYWdlUG9wb3ZlcicpIGltYWdlUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgndmlkZW9Qb3BvdmVyJykgdmlkZW9Qb3BvdmVyO1xuICBAVmlld0NoaWxkKCdmb250U2l6ZVBvcG92ZXInKSBmb250U2l6ZVBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ2NvbG9yUG9wb3ZlcicpIGNvbG9yUG9wb3ZlcjtcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gYSB0b29sYmFyIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAqL1xuICBAT3V0cHV0KCkgZXhlY3V0ZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wb3BPdmVyQ29uZmlnOiBQb3BvdmVyQ29uZmlnLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX21lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tbWFuZEV4ZWN1dG9yU2VydmljZTogQ29tbWFuZEV4ZWN1dG9yU2VydmljZSkge1xuICAgIHRoaXMuX3BvcE92ZXJDb25maWcub3V0c2lkZUNsaWNrID0gdHJ1ZTtcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLnBsYWNlbWVudCA9ICdib3R0b20nO1xuICAgIHRoaXMuX3BvcE92ZXJDb25maWcuY29udGFpbmVyID0gJ2JvZHknO1xuICB9XG5cbiAgLyoqXG4gICAqIGVuYWJsZSBvciBkaWFibGUgdG9vbGJhciBiYXNlZCBvbiBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBuYW1lIG9mIHRoZSB0b29sYmFyIGJ1dHRvbnNcbiAgICovXG4gIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWxzLmNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlLCB0aGlzLmNvbmZpZ1sndG9vbGJhciddKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0cmlnZ2VycyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXIgdG8gYmUgZXhlY3V0ZWQgYW5kIGVtaXRzIGFuIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIG5hbWUgb2YgdGhlIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIHRyaWdnZXJDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZXhlY3V0ZS5lbWl0KGNvbW1hbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBVUkwgaW5zZXJ0IGZvcm1cbiAgICovXG4gIGJ1aWxkVXJsRm9ybSgpOiB2b2lkIHtcblxuICAgIHRoaXMudXJsRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHVybExpbms6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIHVybFRleHQ6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIHVybE5ld1RhYjogW3RydWVdXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBsaW5rIGluIHRoZSBlZGl0b3JcbiAgICovXG4gIGluc2VydExpbmsoKTogdm9pZCB7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5jcmVhdGVMaW5rKHRoaXMudXJsRm9ybS52YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cbiAgICB0aGlzLmJ1aWxkVXJsRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy51cmxQb3BvdmVyLmhpZGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgaW5zZXJ0IGltYWdlIGZvcm1cbiAgICovXG4gIGJ1aWxkSW1hZ2VGb3JtKCk6IHZvaWQge1xuXG4gICAgdGhpcy5pbWFnZUZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBpbWFnZVVybDogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZF1dXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZFZpZGVvRm9ybSgpOiB2b2lkIHtcblxuICAgIHRoaXMudmlkZW9Gb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgdmlkZW9Vcmw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXSxcbiAgICAgIGhlaWdodDogWycnXSxcbiAgICAgIHdpZHRoOiBbJyddXG4gICAgfSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZWQgd2hlbiBmaWxlIGlzIHNlbGVjdGVkXG4gICAqXG4gICAqIEBwYXJhbSBlIG9uQ2hhbmdlIGV2ZW50XG4gICAqL1xuICBvbkZpbGVDaGFuZ2UoZSk6IHZvaWQge1xuXG4gICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IGZhbHNlO1xuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSB0cnVlO1xuXG4gICAgaWYgKGUudGFyZ2V0LmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZpbGUgPSBlLnRhcmdldC5maWxlc1swXTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS51cGxvYWRJbWFnZShmaWxlLCB0aGlzLmNvbmZpZy5pbWFnZUVuZFBvaW50LCB0aGlzLmNvbmZpZy5oZWFkZXJzKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuXG4gICAgICAgICAgaWYgKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkbG9hZFBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5yZXNwb25zZUVuZFBvaW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZSh0aGlzLmNvbmZpZy5yZXNwb25zZUVuZFBvaW50ICsgZXZlbnQuYm9keS51cmwpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UoZXZlbnQuYm9keS51cmwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy51cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBpbnNlcnQgaW1hZ2UgaW4gdGhlIGVkaXRvciAqL1xuICBpbnNlcnRJbWFnZSgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRJbWFnZSh0aGlzLmltYWdlRm9ybS52YWx1ZS5pbWFnZVVybCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIC8qKiByZXNldCBmb3JtIHRvIGRlZmF1bHQgKi9cbiAgICB0aGlzLmJ1aWxkSW1hZ2VGb3JtKCk7XG4gICAgLyoqIGNsb3NlIGluc2V0IFVSTCBwb3AgdXAgKi9cbiAgICB0aGlzLmltYWdlUG9wb3Zlci5oaWRlKCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0VmlkZW8oKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0VmlkZW8odGhpcy52aWRlb0Zvcm0udmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZFZpZGVvRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy52aWRlb1BvcG92ZXIuaGlkZSgpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIGluc2VyIHRleHQvYmFja2dyb3VuZCBjb2xvciAqL1xuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5pbnNlcnRDb2xvcihjb2xvciwgd2hlcmUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbG9yUG9wb3Zlci5oaWRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIHNldCBmb250IHNpemUgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2Uuc2V0Rm9udFNpemUoZm9udFNpemUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0aGlzLmZvbnRTaXplUG9wb3Zlci5oaWRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIHNldCBmb250IE5hbWUvZmFtaWx5ICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnROYW1lKGZvbnROYW1lKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBhbGxvdyBvbmx5IG51bWJlcnNcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IGtleXByZXNzIGV2ZW50XG4gICAqL1xuICBvbmx5TnVtYmVycyhldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBldmVudC5jaGFyQ29kZSA+PSA0OCAmJiBldmVudC5jaGFyQ29kZSA8PSA1NztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYnVpbGRVcmxGb3JtKCk7XG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFBvcG92ZXJNb2R1bGUgfSBmcm9tICduZ3gtYm9vdHN0cmFwJztcbmltcG9ydCB7IE5neEVkaXRvckNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmd4R3JpcHBpZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdyaXBwaWUvbmd4LWdyaXBwaWUuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3ItbWVzc2FnZS9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3ItdG9vbGJhci9uZ3gtZWRpdG9yLXRvb2xiYXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbW1hbmRFeGVjdXRvclNlcnZpY2UgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSwgUG9wb3Zlck1vZHVsZS5mb3JSb290KCldLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hFZGl0b3JDb21wb25lbnQsIE5neEdyaXBwaWVDb21wb25lbnQsIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQsIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmd4RWRpdG9yQ29tcG9uZW50LCBQb3BvdmVyTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbQ29tbWFuZEV4ZWN1dG9yU2VydmljZSwgTWVzc2FnZVNlcnZpY2VdXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4RWRpdG9yTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIlV0aWxzLnJlc3RvcmVTZWxlY3Rpb24iLCJVdGlscy5zYXZlU2VsZWN0aW9uIiwiQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEiLCJVdGlscy5jYW5FbmFibGVUb29sYmFyT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsU0FBZ0IsdUJBQXVCLENBQUMsS0FBYSxFQUFFLE9BQVk7SUFFL0QsSUFBSSxLQUFLLEVBQUU7UUFFUCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNOztrQkFFRyxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLO2dCQUM5QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdEMsQ0FBQztZQUVGLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQ3RDO0tBQ0o7U0FBTTtRQUNILE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0NBQ0o7Ozs7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