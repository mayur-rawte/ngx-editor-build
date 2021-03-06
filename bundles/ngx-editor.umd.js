(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('ngx-bootstrap'), require('codemirror'), require('codemirror/addon/display/placeholder.js'), require('codemirror/mode/htmlmixed/htmlmixed.js'), require('@angular/common/http'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define('ngx-editor', ['exports', '@angular/core', '@angular/common', '@angular/forms', 'ngx-bootstrap', 'codemirror', 'codemirror/addon/display/placeholder.js', 'codemirror/mode/htmlmixed/htmlmixed.js', '@angular/common/http', 'rxjs'], factory) :
    (global = global || self, factory(global['ngx-editor'] = {}, global.ng.core, global.ng.common, global.ng.forms, global['ngx-bootstrap'], global.codemirror, null, null, global.ng.common.http, global.rxjs));
}(this, function (exports, core, common, forms, ngxBootstrap, codemirror, placeholder_js, htmlmixed_js, http, rxjs) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * enable or disable toolbar based on configuration
     *
     * @param value toolbar item
     * @param toolbar toolbar configuration object
     */
    function canEnableToolbarOptions(value, toolbar) {
        if (value) {
            if (toolbar['length'] === 0) {
                return true;
            }
            else {
                var found = toolbar.filter(function (array) {
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
     * @param value configuration via [config] property
     * @param ngxEditorConfig default editor configuration
     * @param input direct configuration inputs via directives
     */
    function getEditorConfiguration(value, ngxEditorConfig, input) {
        for (var i in ngxEditorConfig) {
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
     * @param resizer type of resizer, either basic or stack
     */
    function canResize(resizer) {
        if (resizer === 'basic') {
            return 'vertical';
        }
        return false;
    }
    /**
     * save selection when the editor is focussed out
     */
    function saveSelection() {
        if (window.getSelection) {
            var sel = window.getSelection();
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
     * @param range saved selection when the editor is focussed out
     */
    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
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

    var CommandExecutorService = /** @class */ (function () {
        /**
         *
         * @param _http HTTP Client for making http requests
         */
        function CommandExecutorService(_http) {
            this._http = _http;
            /** saves the selection from the editor when focussed out */
            this.savedSelection = undefined;
        }
        /**
         * executes command from the toolbar
         *
         * @param command command to be executed
         */
        CommandExecutorService.prototype.execute = function (command) {
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
        };
        /**
         * inserts image in the editor
         *
         * @param imageURI url of the image to be inserted
         */
        CommandExecutorService.prototype.insertImage = function (imageURI) {
            if (this.savedSelection) {
                if (imageURI) {
                    var restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        var inserted = document.execCommand('insertImage', false, imageURI);
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
        };
        /**
         * inserts image in the editor
         *
         * @param videParams url of the image to be inserted
         */
        CommandExecutorService.prototype.insertVideo = function (videParams) {
            if (this.savedSelection) {
                if (videParams) {
                    var restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        if (this.isYoutubeLink(videParams.videoUrl)) {
                            var youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                                + 'src="' + videParams.videoUrl + '"></iframe>';
                            this.insertHtml(youtubeURL);
                        }
                        else if (this.checkTagSupportInBrowser('video')) {
                            if (this.isValidURL(videParams.videoUrl)) {
                                var videoSrc = '<video width="' + videParams.width + '" height="' + videParams.height + '"'
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
        };
        /**
         * checks the input url is a valid youtube URL or not
         *
         * @param url Youtue URL
         */
        CommandExecutorService.prototype.isYoutubeLink = function (url) {
            var ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
            return ytRegExp.test(url);
        };
        /**
         * check whether the string is a valid url or not
         * @param url url
         */
        CommandExecutorService.prototype.isValidURL = function (url) {
            var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            return urlRegExp.test(url);
        };
        /**
         * uploads image to the server
         *
         * @param file file that has to be uploaded
         * @param endPoint enpoint to which the image has to be uploaded
         */
        CommandExecutorService.prototype.uploadImage = function (file, endPoint, headers) {
            var e_1, _a;
            if (!endPoint) {
                throw new Error('Image Endpoint isn`t provided or invalid');
            }
            var formData = new FormData();
            if (file) {
                formData.append('file', file);
                var requestHeader = new http.HttpHeaders();
                var headerKeys = Object.keys(headers);
                try {
                    for (var headerKeys_1 = __values(headerKeys), headerKeys_1_1 = headerKeys_1.next(); !headerKeys_1_1.done; headerKeys_1_1 = headerKeys_1.next()) {
                        var headerKey = headerKeys_1_1.value;
                        requestHeader = requestHeader.set(headerKey, headers[headerKey]);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (headerKeys_1_1 && !headerKeys_1_1.done && (_a = headerKeys_1.return)) _a.call(headerKeys_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var req = new http.HttpRequest('POST', endPoint, formData, {
                    reportProgress: true,
                    headers: requestHeader
                });
                return this._http.request(req);
            }
            else {
                throw new Error('Invalid Image');
            }
        };
        /**
         * inserts link in the editor
         *
         * @param params parameters that holds the information for the link
         */
        CommandExecutorService.prototype.createLink = function (params) {
            if (this.savedSelection) {
                /**
                 * check whether the saved selection contains a range or plain selection
                 */
                if (params.urlNewTab) {
                    var newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                    if (document.getSelection().type !== 'Range') {
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            this.insertHtml(newUrl);
                        }
                    }
                    else {
                        throw new Error('Only new links can be inserted. You cannot edit URL`s');
                    }
                }
                else {
                    var restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        document.execCommand('createLink', false, params.urlLink);
                    }
                }
            }
            else {
                throw new Error('Range out of the editor');
            }
            return;
        };
        /**
         * insert color either font or background
         *
         * @param color color to be inserted
         * @param where where the color has to be inserted either text/background
         */
        CommandExecutorService.prototype.insertColor = function (color, where) {
            if (this.savedSelection) {
                var restored = restoreSelection(this.savedSelection);
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
        };
        /**
         * set font size for text
         *
         * @param fontSize font-size to be set
         */
        CommandExecutorService.prototype.setFontSize = function (fontSize) {
            if (this.savedSelection && this.checkSelection()) {
                var deletedValue = this.deleteAndGetElement();
                if (deletedValue) {
                    var restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        if (this.isNumeric(fontSize)) {
                            var fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                            this.insertHtml(fontPx);
                        }
                        else {
                            var fontPx = '<span style="font-size: ' + fontSize + ';">' + deletedValue + '</span>';
                            this.insertHtml(fontPx);
                        }
                    }
                }
            }
            else {
                throw new Error('Range out of the editor');
            }
        };
        /**
         * set font name/family for text
         *
         * @param fontName font-family to be set
         */
        CommandExecutorService.prototype.setFontName = function (fontName) {
            if (this.savedSelection && this.checkSelection()) {
                var deletedValue = this.deleteAndGetElement();
                if (deletedValue) {
                    var restored = restoreSelection(this.savedSelection);
                    if (restored) {
                        if (this.isNumeric(fontName)) {
                            var fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                            this.insertHtml(fontFamily);
                        }
                        else {
                            var fontFamily = '<span style="font-family: ' + fontName + ';">' + deletedValue + '</span>';
                            this.insertHtml(fontFamily);
                        }
                    }
                }
            }
            else {
                throw new Error('Range out of the editor');
            }
        };
        /** insert HTML */
        CommandExecutorService.prototype.insertHtml = function (html) {
            var isHTMLInserted = document.execCommand('insertHTML', false, html);
            if (!isHTMLInserted) {
                throw new Error('Unable to perform the operation');
            }
            return;
        };
        /**
         * check whether the value is a number or string
         * if number return true
         * else return false
         */
        CommandExecutorService.prototype.isNumeric = function (value) {
            return /^-{0,1}\d+$/.test(value);
        };
        /** delete the text at selected range and return the value */
        CommandExecutorService.prototype.deleteAndGetElement = function () {
            var slectedText;
            if (this.savedSelection) {
                slectedText = this.savedSelection.toString();
                this.savedSelection.deleteContents();
                return slectedText;
            }
            return false;
        };
        /** check any slection is made or not */
        CommandExecutorService.prototype.checkSelection = function () {
            var slectedText = this.savedSelection.toString();
            if (slectedText.length === 0) {
                throw new Error('No Selection Made');
            }
            return true;
        };
        /**
         * check tag is supported by browser or not
         *
         * @param tag HTML tag
         */
        CommandExecutorService.prototype.checkTagSupportInBrowser = function (tag) {
            return !(document.createElement(tag) instanceof HTMLUnknownElement);
        };
        CommandExecutorService = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [http.HttpClient])
        ], CommandExecutorService);
        return CommandExecutorService;
    }());

    /** time in which the message has to be cleared */
    var DURATION = 7000;
    var MessageService = /** @class */ (function () {
        function MessageService() {
            /** variable to hold the user message */
            this.message = new rxjs.Subject();
        }
        /** returns the message sent by the editor */
        MessageService.prototype.getMessage = function () {
            return this.message.asObservable();
        };
        /**
         * sends message to the editor
         *
         * @param message message to be sent
         */
        MessageService.prototype.sendMessage = function (message) {
            this.message.next(message);
            this.clearMessageIn(DURATION);
            return;
        };
        /**
         * a short interval to clear message
         *
         * @param milliseconds time in seconds in which the message has to be cleared
         */
        MessageService.prototype.clearMessageIn = function (milliseconds) {
            var _this = this;
            setTimeout(function () {
                _this.message.next(undefined);
            }, milliseconds);
            return;
        };
        MessageService = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [])
        ], MessageService);
        return MessageService;
    }());

    /**
     * toolbar default configuration
     */
    var ngxEditorConfig = {
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
     */
    var codeMirrorConfig = {
        lineNumbers: true,
        gutter: true,
        lineWrapping: true,
        mode: 'htmlmixed',
        autofocus: true,
        htmlMode: true
    };

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
            this.blur = new core.EventEmitter();
            /** emits `focus` event when focused in to the textarea */
            this.focus = new core.EventEmitter();
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
            this._commandExecutor.savedSelection = saveSelection();
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
                this.ngxCodeMirror = codemirror.fromTextArea(this.codeEditor.nativeElement, codeMirrorConfig);
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
        __decorate([
            core.Input(),
            __metadata("design:type", Boolean)
        ], NgxEditorComponent.prototype, "editable", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Boolean)
        ], NgxEditorComponent.prototype, "spellcheck", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "translate", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "height", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "minHeight", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "width", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "minWidth", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "toolbar", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "resizer", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "config", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Boolean)
        ], NgxEditorComponent.prototype, "showToolbar", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Boolean)
        ], NgxEditorComponent.prototype, "enableToolbar", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], NgxEditorComponent.prototype, "imageEndPoint", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", core.EventEmitter)
        ], NgxEditorComponent.prototype, "blur", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", core.EventEmitter)
        ], NgxEditorComponent.prototype, "focus", void 0);
        __decorate([
            core.ViewChild('ngxTextArea', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "textArea", void 0);
        __decorate([
            core.ViewChild('ngxCodeEditor', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "codeEditor", void 0);
        __decorate([
            core.ViewChild('ngxWrapper', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorComponent.prototype, "ngxWrapper", void 0);
        NgxEditorComponent = NgxEditorComponent_1 = __decorate([
            core.Component({
                selector: 'app-ngx-editor',
                template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" [hidden]=\"codeEditorMode\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n      [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\" (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <textarea [attr.placeholder]=\"placeholder || config['placeholder']\" [hidden]=\"true\" #ngxCodeEditor></textarea>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return NgxEditorComponent_1; }),
                        multi: true
                    }
                ],
                styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}.ngx-editor ::ng-deep .CodeMirror{border:1px solid #ddd;z-index:2}.ngx-editor ::ng-deep .CodeMirror .CodeMirror-placeholder{color:#6c757d}"]
            }),
            __metadata("design:paramtypes", [MessageService,
                CommandExecutorService,
                core.Renderer2])
        ], NgxEditorComponent);
        return NgxEditorComponent;
    }());

    var NgxGrippieComponent = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param _editorComponent Editor component
         */
        function NgxGrippieComponent(_editorComponent) {
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
        NgxGrippieComponent.prototype.onMouseMove = function (event) {
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
        NgxGrippieComponent.prototype.onMouseUp = function (event) {
            this.grabber = false;
        };
        NgxGrippieComponent.prototype.onResize = function (event, resizer) {
            this.grabber = true;
            this.oldY = event.clientY;
            event.preventDefault();
        };
        __decorate([
            core.HostListener('document:mousemove', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [MouseEvent]),
            __metadata("design:returntype", void 0)
        ], NgxGrippieComponent.prototype, "onMouseMove", null);
        __decorate([
            core.HostListener('document:mouseup', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [MouseEvent]),
            __metadata("design:returntype", void 0)
        ], NgxGrippieComponent.prototype, "onMouseUp", null);
        __decorate([
            core.HostListener('mousedown', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [MouseEvent, Function]),
            __metadata("design:returntype", void 0)
        ], NgxGrippieComponent.prototype, "onResize", null);
        NgxGrippieComponent = __decorate([
            core.Component({
                selector: 'app-ngx-grippie',
                template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
            }),
            __metadata("design:paramtypes", [NgxEditorComponent])
        ], NgxGrippieComponent);
        return NgxGrippieComponent;
    }());

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
        NgxEditorMessageComponent = __decorate([
            core.Component({
                selector: 'app-ngx-editor-message',
                template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
                styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
            }),
            __metadata("design:paramtypes", [MessageService])
        ], NgxEditorMessageComponent);
        return NgxEditorMessageComponent;
    }());

    var NgxEditorToolbarComponent = /** @class */ (function () {
        function NgxEditorToolbarComponent(_popOverConfig, _formBuilder, _messageService, _commandExecutorService) {
            this._popOverConfig = _popOverConfig;
            this._formBuilder = _formBuilder;
            this._messageService = _messageService;
            this._commandExecutorService = _commandExecutorService;
            /** set to false when image is being uploaded */
            this.uploadComplete = true;
            /** upload percentage */
            this.updloadPercentage = 0;
            /** set to true when the image is being uploaded */
            this.isUploading = false;
            /** which tab to active for color insetion */
            this.selectedColorTab = 'textColor';
            /** font family name */
            this.fontName = '';
            /** font size */
            this.fontSize = '';
            /** hex color code */
            this.hexColor = '';
            /** show/hide image uploader */
            this.isImageUploader = false;
            /**
             * Emits an event when a toolbar button is clicked
             */
            this.execute = new core.EventEmitter();
            this._popOverConfig.outsideClick = true;
            this._popOverConfig.placement = 'bottom';
            this._popOverConfig.container = 'body';
        }
        /**
         * enable or diable toolbar based on configuration
         *
         * @param value name of the toolbar buttons
         */
        NgxEditorToolbarComponent.prototype.canEnableToolbarOptions = function (value) {
            return canEnableToolbarOptions(value, this.config['toolbar']);
        };
        /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param command name of the command to be executed
         */
        NgxEditorToolbarComponent.prototype.triggerCommand = function (command) {
            this.execute.emit(command);
        };
        /**
         * create URL insert form
         */
        NgxEditorToolbarComponent.prototype.buildUrlForm = function () {
            this.urlForm = this._formBuilder.group({
                urlLink: ['', [forms.Validators.required]],
                urlText: ['', [forms.Validators.required]],
                urlNewTab: [true]
            });
            return;
        };
        /**
         * inserts link in the editor
         */
        NgxEditorToolbarComponent.prototype.insertLink = function () {
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
        };
        /**
         * create insert image form
         */
        NgxEditorToolbarComponent.prototype.buildImageForm = function () {
            this.imageForm = this._formBuilder.group({
                imageUrl: ['', [forms.Validators.required]]
            });
            return;
        };
        /**
         * create insert image form
         */
        NgxEditorToolbarComponent.prototype.buildVideoForm = function () {
            this.videoForm = this._formBuilder.group({
                videoUrl: ['', [forms.Validators.required]],
                height: [''],
                width: ['']
            });
            return;
        };
        /**
         * Executed when file is selected
         *
         * @param e onChange event
         */
        NgxEditorToolbarComponent.prototype.onFileChange = function (e) {
            var _this = this;
            this.uploadComplete = false;
            this.isUploading = true;
            if (e.target.files.length > 0) {
                var file = e.target.files[0];
                try {
                    this._commandExecutorService.uploadImage(file, this.config.imageEndPoint, this.config.headers).subscribe(function (event) {
                        if (event.type) {
                            _this.updloadPercentage = Math.round(100 * event.loaded / event.total);
                        }
                        if (event instanceof http.HttpResponse) {
                            try {
                                if (_this.config.responseEndPoint) {
                                    _this._commandExecutorService.insertImage(_this.config.responseEndPoint + event.body.url);
                                }
                                else {
                                    _this._commandExecutorService.insertImage(event.body.url);
                                }
                            }
                            catch (error) {
                                _this._messageService.sendMessage(error.message);
                            }
                            _this.uploadComplete = true;
                            _this.isUploading = false;
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
        };
        /** insert image in the editor */
        NgxEditorToolbarComponent.prototype.insertImage = function () {
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
        };
        /** insert image in the editor */
        NgxEditorToolbarComponent.prototype.insertVideo = function () {
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
        };
        /** inser text/background color */
        NgxEditorToolbarComponent.prototype.insertColor = function (color, where) {
            try {
                this._commandExecutorService.insertColor(color, where);
            }
            catch (error) {
                this._messageService.sendMessage(error.message);
            }
            this.colorPopover.hide();
            return;
        };
        /** set font size */
        NgxEditorToolbarComponent.prototype.setFontSize = function (fontSize) {
            try {
                this._commandExecutorService.setFontSize(fontSize);
            }
            catch (error) {
                this._messageService.sendMessage(error.message);
            }
            this.fontSizePopover.hide();
            return;
        };
        /** set font Name/family */
        NgxEditorToolbarComponent.prototype.setFontName = function (fontName) {
            try {
                this._commandExecutorService.setFontName(fontName);
            }
            catch (error) {
                this._messageService.sendMessage(error.message);
            }
            this.fontSizePopover.hide();
            return;
        };
        /**
         * allow only numbers
         *
         * @param event keypress event
         */
        NgxEditorToolbarComponent.prototype.onlyNumbers = function (event) {
            return event.charCode >= 48 && event.charCode <= 57;
        };
        NgxEditorToolbarComponent.prototype.ngOnInit = function () {
            this.buildUrlForm();
            this.buildImageForm();
            this.buildVideoForm();
        };
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "config", void 0);
        __decorate([
            core.ViewChild('urlPopover', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "urlPopover", void 0);
        __decorate([
            core.ViewChild('imagePopover', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "imagePopover", void 0);
        __decorate([
            core.ViewChild('videoPopover', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "videoPopover", void 0);
        __decorate([
            core.ViewChild('fontSizePopover', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "fontSizePopover", void 0);
        __decorate([
            core.ViewChild('colorPopover', { static: true }),
            __metadata("design:type", Object)
        ], NgxEditorToolbarComponent.prototype, "colorPopover", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", core.EventEmitter)
        ], NgxEditorToolbarComponent.prototype, "execute", void 0);
        NgxEditorToolbarComponent = __decorate([
            core.Component({
                selector: 'app-ngx-editor-toolbar',
                template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar'] ||false\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\"\n            (click)=\"triggerCommand('bold')\"\n            title=\"Bold\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\"\n            (click)=\"triggerCommand('italic')\"\n            title=\"Italic\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\"\n            (click)=\"triggerCommand('underline')\"\n            title=\"Underline\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\"\n            (click)=\"triggerCommand('strikeThrough')\"\n            title=\"Strikethrough\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\"\n            (click)=\"triggerCommand('superscript')\"\n            title=\"Superscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\"\n            (click)=\"triggerCommand('subscript')\"\n            title=\"Subscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n            title=\"Font Family\"\n            [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n            title=\"Font Size\"\n            [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n            title=\"Color Picker\"\n            [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\"\n            (click)=\"triggerCommand('justifyLeft')\"\n            title=\"Justify Left\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\"\n            (click)=\"triggerCommand('justifyCenter')\"\n            title=\"Justify Center\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\"\n            (click)=\"triggerCommand('justifyRight')\"\n            title=\"Justify Right\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\"\n            (click)=\"triggerCommand('justifyFull')\"\n            title=\"Justify\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\"\n            (click)=\"triggerCommand('indent')\"\n            title=\"Indent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\"\n            (click)=\"triggerCommand('outdent')\"\n            title=\"Outdent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\"\n            (click)=\"triggerCommand('cut')\" title=\"Cut\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\"\n            (click)=\"triggerCommand('copy')\"\n            title=\"Copy\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-clone\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\"\n            (click)=\"triggerCommand('delete')\"\n            title=\"Delete\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\"\n            (click)=\"triggerCommand('removeFormat')\"\n            title=\"Clear Formatting\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\"\n            (click)=\"triggerCommand('undo')\"\n            title=\"Undo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\"\n            (click)=\"triggerCommand('redo')\"\n            title=\"Redo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\"\n            (click)=\"triggerCommand('insertParagraph')\"\n            title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\"\n            (click)=\"triggerCommand('blockquote')\"\n            title=\"Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\"\n            (click)=\"triggerCommand('removeBlockquote')\"\n            title=\"Remove Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\"\n            (click)=\"triggerCommand('insertHorizontalRule')\"\n            title=\"Horizontal Line\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\"\n            (click)=\"triggerCommand('insertUnorderedList')\"\n            title=\"Unordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\"\n            (click)=\"triggerCommand('insertOrderedList')\"\n            title=\"Ordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n            [popover]=\"insertLinkTemplate\"\n            title=\"Insert Link\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\"\n            (click)=\"triggerCommand('unlink')\"\n            title=\"Unlink\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n            title=\"Insert Image\"\n            [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-image\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n            title=\"Insert Video\"\n            [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('code')\"\n            (click)=\"triggerCommand('code')\"\n            title=\"View Code\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-code\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n               required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">Open in new tab</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fal fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fal fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"></div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"></div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Choose Image</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Uploading Image</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\"\n                   [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n                   required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\"\n             [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n             [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fal fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n                 required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"height (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"width (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Text</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Background</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <form autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"hexInput\" class=\"small\">Hex Color</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"hexInput\" name=\"hexInput\" maxlength=\"7\" placeholder=\"HEX Color\"\n                 [(ngModel)]=\"hexColor\"\n                 required>\n        </div>\n        <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(hexColor, selectedColorTab)\">Submit\n        </button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Font size in px/rem\"\n               [(ngModel)]=\"fontSize\"\n               required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\"\n               placeholder=\"Ex: 'Times New Roman', Times, serif\"\n               [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n",
                providers: [ngxBootstrap.PopoverConfig],
                styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{background-color:#f5f5f5;font-size:.8rem;padding:.2rem;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;float:left;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;text-align:center;display:inline-block;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
            }),
            __metadata("design:paramtypes", [ngxBootstrap.PopoverConfig,
                forms.FormBuilder,
                MessageService,
                CommandExecutorService])
        ], NgxEditorToolbarComponent);
        return NgxEditorToolbarComponent;
    }());

    var NgxEditorModule = /** @class */ (function () {
        function NgxEditorModule() {
        }
        NgxEditorModule = __decorate([
            core.NgModule({
                imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule, ngxBootstrap.PopoverModule.forRoot()],
                declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                exports: [NgxEditorComponent, ngxBootstrap.PopoverModule],
                providers: [CommandExecutorService, MessageService]
            })
        ], NgxEditorModule);
        return NgxEditorModule;
    }());

    exports.NgxEditorModule = NgxEditorModule;
    exports.ɵa = NgxEditorComponent;
    exports.ɵb = MessageService;
    exports.ɵc = CommandExecutorService;
    exports.ɵd = NgxGrippieComponent;
    exports.ɵe = NgxEditorMessageComponent;
    exports.ɵf = NgxEditorToolbarComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-editor.umd.js.map
