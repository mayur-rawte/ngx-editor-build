(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs'), require('@angular/forms'), require('codemirror'), require('codemirror/addon/display/placeholder.js'), require('codemirror/mode/htmlmixed/htmlmixed.js'), require('ngx-bootstrap'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-editor', ['exports', '@angular/core', '@angular/common/http', 'rxjs', '@angular/forms', 'codemirror', 'codemirror/addon/display/placeholder.js', 'codemirror/mode/htmlmixed/htmlmixed.js', 'ngx-bootstrap', '@angular/common'], factory) :
    (factory((global['ngx-editor'] = {}),global.ng.core,global.ng.common.http,global.rxjs,global.ng.forms,global.codemirror,null,null,global['ngx-bootstrap'],global.ng.common));
}(this, (function (exports,core,http,rxjs,forms,CodeMirror,placeholder_js,htmlmixed_js,ngxBootstrap,common) { 'use strict';

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
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

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
     * @param {?} value configuration via [config] property
     * @param {?} ngxEditorConfig default editor configuration
     * @param {?} input direct configuration inputs via directives
     * @return {?}
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
     * @param {?} range saved selection when the editor is focussed out
     * @return {?}
     */
    function restoreSelection(range) {
        if (range) {
            if (window.getSelection) {
                /** @type {?} */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CommandExecutorService = /** @class */ (function () {
        /**
         *
         * @param _http HTTP Client for making http requests
         */
        function CommandExecutorService(_http) {
            this._http = _http;
            /**
             * saves the selection from the editor when focussed out
             */
            this.savedSelection = undefined;
        }
        /**
         * executes command from the toolbar
         *
         * @param command command to be executed
         */
        /**
         * executes command from the toolbar
         *
         * @param {?} command command to be executed
         * @return {?}
         */
        CommandExecutorService.prototype.execute = /**
         * executes command from the toolbar
         *
         * @param {?} command command to be executed
         * @return {?}
         */
            function (command) {
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
        /**
         * inserts image in the editor
         *
         * @param {?} imageURI url of the image to be inserted
         * @return {?}
         */
        CommandExecutorService.prototype.insertImage = /**
         * inserts image in the editor
         *
         * @param {?} imageURI url of the image to be inserted
         * @return {?}
         */
            function (imageURI) {
                if (this.savedSelection) {
                    if (imageURI) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            /** @type {?} */
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
        /**
         * inserts image in the editor
         *
         * @param {?} videParams url of the image to be inserted
         * @return {?}
         */
        CommandExecutorService.prototype.insertVideo = /**
         * inserts image in the editor
         *
         * @param {?} videParams url of the image to be inserted
         * @return {?}
         */
            function (videParams) {
                if (this.savedSelection) {
                    if (videParams) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isYoutubeLink(videParams.videoUrl)) {
                                /** @type {?} */
                                var youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                                    + 'src="' + videParams.videoUrl + '"></iframe>';
                                this.insertHtml(youtubeURL);
                            }
                            else if (this.checkTagSupportInBrowser('video')) {
                                if (this.isValidURL(videParams.videoUrl)) {
                                    /** @type {?} */
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
        /**
         * checks the input url is a valid youtube URL or not
         *
         * @param {?} url Youtue URL
         * @return {?}
         */
        CommandExecutorService.prototype.isYoutubeLink = /**
         * checks the input url is a valid youtube URL or not
         *
         * @param {?} url Youtue URL
         * @return {?}
         */
            function (url) {
                /** @type {?} */
                var ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
                return ytRegExp.test(url);
            };
        /**
         * check whether the string is a valid url or not
         * @param url url
         */
        /**
         * check whether the string is a valid url or not
         * @param {?} url url
         * @return {?}
         */
        CommandExecutorService.prototype.isValidURL = /**
         * check whether the string is a valid url or not
         * @param {?} url url
         * @return {?}
         */
            function (url) {
                /** @type {?} */
                var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                return urlRegExp.test(url);
            };
        /**
         * uploads image to the server
         *
         * @param file file that has to be uploaded
         * @param endPoint enpoint to which the image has to be uploaded
         */
        /**
         * uploads image to the server
         *
         * @param {?} file file that has to be uploaded
         * @param {?} endPoint enpoint to which the image has to be uploaded
         * @param {?=} headers
         * @return {?}
         */
        CommandExecutorService.prototype.uploadImage = /**
         * uploads image to the server
         *
         * @param {?} file file that has to be uploaded
         * @param {?} endPoint enpoint to which the image has to be uploaded
         * @param {?=} headers
         * @return {?}
         */
            function (file, endPoint, headers) {
                var e_1, _a;
                if (!endPoint) {
                    throw new Error('Image Endpoint isn`t provided or invalid');
                }
                /** @type {?} */
                var formData = new FormData();
                if (file) {
                    formData.append('file', file);
                    /** @type {?} */
                    var requestHeader = new http.HttpHeaders();
                    /** @type {?} */
                    var headerKeys = Object.keys(headers);
                    try {
                        for (var headerKeys_1 = __values(headerKeys), headerKeys_1_1 = headerKeys_1.next(); !headerKeys_1_1.done; headerKeys_1_1 = headerKeys_1.next()) {
                            var headerKey = headerKeys_1_1.value;
                            requestHeader = requestHeader.set(headerKey, headers[headerKey]);
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (headerKeys_1_1 && !headerKeys_1_1.done && (_a = headerKeys_1.return))
                                _a.call(headerKeys_1);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                    /** @type {?} */
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
        /**
         * inserts link in the editor
         *
         * @param {?} params parameters that holds the information for the link
         * @return {?}
         */
        CommandExecutorService.prototype.createLink = /**
         * inserts link in the editor
         *
         * @param {?} params parameters that holds the information for the link
         * @return {?}
         */
            function (params) {
                if (this.savedSelection) {
                    /**
                     * check whether the saved selection contains a range or plain selection
                     */
                    if (params.urlNewTab) {
                        /** @type {?} */
                        var newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                        if (document.getSelection().type !== 'Range') {
                            /** @type {?} */
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
                        /** @type {?} */
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
        /**
         * insert color either font or background
         *
         * @param {?} color color to be inserted
         * @param {?} where where the color has to be inserted either text/background
         * @return {?}
         */
        CommandExecutorService.prototype.insertColor = /**
         * insert color either font or background
         *
         * @param {?} color color to be inserted
         * @param {?} where where the color has to be inserted either text/background
         * @return {?}
         */
            function (color, where) {
                if (this.savedSelection) {
                    /** @type {?} */
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
        /**
         * set font size for text
         *
         * @param {?} fontSize font-size to be set
         * @return {?}
         */
        CommandExecutorService.prototype.setFontSize = /**
         * set font size for text
         *
         * @param {?} fontSize font-size to be set
         * @return {?}
         */
            function (fontSize) {
                if (this.savedSelection && this.checkSelection()) {
                    /** @type {?} */
                    var deletedValue = this.deleteAndGetElement();
                    if (deletedValue) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isNumeric(fontSize)) {
                                /** @type {?} */
                                var fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                                this.insertHtml(fontPx);
                            }
                            else {
                                /** @type {?} */
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
        /**
         * set font name/family for text
         *
         * @param {?} fontName font-family to be set
         * @return {?}
         */
        CommandExecutorService.prototype.setFontName = /**
         * set font name/family for text
         *
         * @param {?} fontName font-family to be set
         * @return {?}
         */
            function (fontName) {
                if (this.savedSelection && this.checkSelection()) {
                    /** @type {?} */
                    var deletedValue = this.deleteAndGetElement();
                    if (deletedValue) {
                        /** @type {?} */
                        var restored = restoreSelection(this.savedSelection);
                        if (restored) {
                            if (this.isNumeric(fontName)) {
                                /** @type {?} */
                                var fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                                this.insertHtml(fontFamily);
                            }
                            else {
                                /** @type {?} */
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
        /**
         * insert HTML
         * @param {?} html
         * @return {?}
         */
        CommandExecutorService.prototype.insertHtml = /**
         * insert HTML
         * @param {?} html
         * @return {?}
         */
            function (html) {
                /** @type {?} */
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
        /**
         * check whether the value is a number or string
         * if number return true
         * else return false
         * @param {?} value
         * @return {?}
         */
        CommandExecutorService.prototype.isNumeric = /**
         * check whether the value is a number or string
         * if number return true
         * else return false
         * @param {?} value
         * @return {?}
         */
            function (value) {
                return /^-{0,1}\d+$/.test(value);
            };
        /** delete the text at selected range and return the value */
        /**
         * delete the text at selected range and return the value
         * @return {?}
         */
        CommandExecutorService.prototype.deleteAndGetElement = /**
         * delete the text at selected range and return the value
         * @return {?}
         */
            function () {
                /** @type {?} */
                var slectedText;
                if (this.savedSelection) {
                    slectedText = this.savedSelection.toString();
                    this.savedSelection.deleteContents();
                    return slectedText;
                }
                return false;
            };
        /** check any slection is made or not */
        /**
         * check any slection is made or not
         * @return {?}
         */
        CommandExecutorService.prototype.checkSelection = /**
         * check any slection is made or not
         * @return {?}
         */
            function () {
                /** @type {?} */
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
        /**
         * check tag is supported by browser or not
         *
         * @param {?} tag HTML tag
         * @return {?}
         */
        CommandExecutorService.prototype.checkTagSupportInBrowser = /**
         * check tag is supported by browser or not
         *
         * @param {?} tag HTML tag
         * @return {?}
         */
            function (tag) {
                return !(document.createElement(tag) instanceof HTMLUnknownElement);
            };
        CommandExecutorService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        CommandExecutorService.ctorParameters = function () {
            return [
                { type: http.HttpClient }
            ];
        };
        return CommandExecutorService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * time in which the message has to be cleared
     * @type {?}
     */
    var DURATION = 7000;
    var MessageService = /** @class */ (function () {
        function MessageService() {
            /**
             * variable to hold the user message
             */
            this.message = new rxjs.Subject();
        }
        /** returns the message sent by the editor */
        /**
         * returns the message sent by the editor
         * @return {?}
         */
        MessageService.prototype.getMessage = /**
         * returns the message sent by the editor
         * @return {?}
         */
            function () {
                return this.message.asObservable();
            };
        /**
         * sends message to the editor
         *
         * @param message message to be sent
         */
        /**
         * sends message to the editor
         *
         * @param {?} message message to be sent
         * @return {?}
         */
        MessageService.prototype.sendMessage = /**
         * sends message to the editor
         *
         * @param {?} message message to be sent
         * @return {?}
         */
            function (message) {
                this.message.next(message);
                this.clearMessageIn(DURATION);
                return;
            };
        /**
         * a short interval to clear message
         *
         * @param milliseconds time in seconds in which the message has to be cleared
         */
        /**
         * a short interval to clear message
         *
         * @param {?} milliseconds time in seconds in which the message has to be cleared
         * @return {?}
         */
        MessageService.prototype.clearMessageIn = /**
         * a short interval to clear message
         *
         * @param {?} milliseconds time in seconds in which the message has to be cleared
         * @return {?}
         */
            function (milliseconds) {
                var _this = this;
                setTimeout(function () {
                    _this.message.next(undefined);
                }, milliseconds);
                return;
            };
        MessageService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        MessageService.ctorParameters = function () { return []; };
        return MessageService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * toolbar default configuration
     * @type {?}
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
     * @type {?}
     */
    var codeMirrorConfig = {
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
            this.blur = new core.EventEmitter();
            /**
             * emits `focus` event when focused in to the textarea
             */
            this.focus = new core.EventEmitter();
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
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor',
                        template: "<div class=\"ngx-editor\" id=\"ngxEditor\" [style.width]=\"config['width']\" [style.minWidth]=\"config['minWidth']\" tabindex=\"0\"\n  (focus)=\"onEditorFocus()\">\n\n  <app-ngx-editor-toolbar [config]=\"config\" (execute)=\"executeCommand($event)\"></app-ngx-editor-toolbar>\n\n  <!-- text area -->\n  <div class=\"ngx-wrapper\" [hidden]=\"codeEditorMode\" #ngxWrapper>\n    <div class=\"ngx-editor-textarea\" [attr.contenteditable]=\"config['editable']\" (input)=\"onContentChange($event.target.innerHTML)\"\n      [attr.translate]=\"config['translate']\" [attr.spellcheck]=\"config['spellcheck']\" [style.height]=\"config['height']\" [style.minHeight]=\"config['minHeight']\"\n      [style.resize]=\"Utils?.canResize(resizer)\" (focus)=\"onTextAreaFocus()\" (blur)=\"onTextAreaBlur()\" #ngxTextArea></div>\n\n    <span class=\"ngx-editor-placeholder\">{{ placeholder || config['placeholder'] }}</span>\n  </div>\n\n  <textarea [attr.placeholder]=\"placeholder || config['placeholder']\" [hidden]=\"true\" #ngxCodeEditor></textarea>\n\n  <app-ngx-editor-message></app-ngx-editor-message>\n  <app-ngx-grippie *ngIf=\"resizer === 'stack'\"></app-ngx-grippie>\n\n</div>\n",
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: core.forwardRef(function () { return NgxEditorComponent; }),
                                multi: true
                            }
                        ],
                        styles: [".ngx-editor{position:relative}.ngx-editor ::ng-deep [contenteditable=true]:empty:before{content:attr(placeholder);display:block;color:#868e96;opacity:1}.ngx-editor .ngx-wrapper{position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea{min-height:5rem;padding:.5rem .8rem 1rem;border:1px solid #ddd;background-color:transparent;overflow-x:hidden;overflow-y:auto;z-index:2;position:relative}.ngx-editor .ngx-wrapper .ngx-editor-textarea.focus,.ngx-editor .ngx-wrapper .ngx-editor-textarea:focus{outline:0}.ngx-editor .ngx-wrapper .ngx-editor-textarea ::ng-deep blockquote{margin-left:1rem;border-left:.2em solid #dfe2e5;padding-left:.5rem}.ngx-editor .ngx-wrapper ::ng-deep p{margin-bottom:0}.ngx-editor .ngx-wrapper .ngx-editor-placeholder{display:none;position:absolute;top:0;padding:.5rem .8rem 1rem .9rem;z-index:1;color:#6c757d;opacity:1}.ngx-editor .ngx-wrapper.show-placeholder .ngx-editor-placeholder{display:block}.ngx-editor ::ng-deep .CodeMirror{border:1px solid #ddd;z-index:2}.ngx-editor ::ng-deep .CodeMirror .CodeMirror-placeholder{color:#6c757d}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorComponent.ctorParameters = function () {
            return [
                { type: MessageService },
                { type: CommandExecutorService },
                { type: core.Renderer2 }
            ];
        };
        NgxEditorComponent.propDecorators = {
            editable: [{ type: core.Input }],
            spellcheck: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            translate: [{ type: core.Input }],
            height: [{ type: core.Input }],
            minHeight: [{ type: core.Input }],
            width: [{ type: core.Input }],
            minWidth: [{ type: core.Input }],
            toolbar: [{ type: core.Input }],
            resizer: [{ type: core.Input }],
            config: [{ type: core.Input }],
            showToolbar: [{ type: core.Input }],
            enableToolbar: [{ type: core.Input }],
            imageEndPoint: [{ type: core.Input }],
            blur: [{ type: core.Output }],
            focus: [{ type: core.Output }],
            textArea: [{ type: core.ViewChild, args: ['ngxTextArea',] }],
            codeEditor: [{ type: core.ViewChild, args: ['ngxCodeEditor',] }],
            ngxWrapper: [{ type: core.ViewChild, args: ['ngxWrapper',] }]
        };
        return NgxEditorComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
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
            { type: core.Component, args: [{
                        selector: 'app-ngx-grippie',
                        template: "<div class=\"ngx-editor-grippie\">\n  <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"isolation:isolate\" viewBox=\"651.6 235 26 5\"\n    width=\"26\" height=\"5\">\n    <g id=\"sprites\">\n      <path d=\" M 651.6 235 L 653.6 235 L 653.6 237 L 651.6 237 M 654.6 238 L 656.6 238 L 656.6 240 L 654.6 240 M 660.6 238 L 662.6 238 L 662.6 240 L 660.6 240 M 666.6 238 L 668.6 238 L 668.6 240 L 666.6 240 M 672.6 238 L 674.6 238 L 674.6 240 L 672.6 240 M 657.6 235 L 659.6 235 L 659.6 237 L 657.6 237 M 663.6 235 L 665.6 235 L 665.6 237 L 663.6 237 M 669.6 235 L 671.6 235 L 671.6 237 L 669.6 237 M 675.6 235 L 677.6 235 L 677.6 237 L 675.6 237\"\n        fill=\"rgb(147,153,159)\" />\n    </g>\n  </svg>\n</div>\n",
                        styles: [".ngx-editor-grippie{height:9px;background-color:#f1f1f1;position:relative;text-align:center;cursor:s-resize;border:1px solid #ddd;border-top:transparent}.ngx-editor-grippie svg{position:absolute;top:1.5px;width:50%;right:25%}"]
                    }] }
        ];
        /** @nocollapse */
        NgxGrippieComponent.ctorParameters = function () {
            return [
                { type: NgxEditorComponent }
            ];
        };
        NgxGrippieComponent.propDecorators = {
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }],
            onMouseUp: [{ type: core.HostListener, args: ['document:mouseup', ['$event'],] }],
            onResize: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }]
        };
        return NgxGrippieComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorMessageComponent = /** @class */ (function () {
        /**
         * @param _messageService service to send message to the editor
         */
        function NgxEditorMessageComponent(_messageService) {
            var _this = this;
            this._messageService = _messageService;
            /**
             * property that holds the message to be displayed on the editor
             */
            this.ngxMessage = undefined;
            this._messageService.getMessage().subscribe(function (message) { return _this.ngxMessage = message; });
        }
        /**
         * clears editor message
         */
        /**
         * clears editor message
         * @return {?}
         */
        NgxEditorMessageComponent.prototype.clearMessage = /**
         * clears editor message
         * @return {?}
         */
            function () {
                this.ngxMessage = undefined;
                return;
            };
        NgxEditorMessageComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor-message',
                        template: "<div class=\"ngx-editor-message\" *ngIf=\"ngxMessage\" (dblclick)=\"clearMessage()\">\n  {{ ngxMessage }}\n</div>\n",
                        styles: [".ngx-editor-message{font-size:80%;background-color:#f1f1f1;border:1px solid #ddd;border-top:transparent;padding:0 .5rem .1rem;transition:.5s ease-in}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorMessageComponent.ctorParameters = function () {
            return [
                { type: MessageService }
            ];
        };
        return NgxEditorMessageComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorToolbarComponent = /** @class */ (function () {
        function NgxEditorToolbarComponent(_popOverConfig, _formBuilder, _messageService, _commandExecutorService) {
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
        /**
         * enable or diable toolbar based on configuration
         *
         * @param {?} value name of the toolbar buttons
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.canEnableToolbarOptions = /**
         * enable or diable toolbar based on configuration
         *
         * @param {?} value name of the toolbar buttons
         * @return {?}
         */
            function (value) {
                return canEnableToolbarOptions(value, this.config['toolbar']);
            };
        /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param command name of the command to be executed
         */
        /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param {?} command name of the command to be executed
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.triggerCommand = /**
         * triggers command from the toolbar to be executed and emits an event
         *
         * @param {?} command name of the command to be executed
         * @return {?}
         */
            function (command) {
                this.execute.emit(command);
            };
        /**
         * create URL insert form
         */
        /**
         * create URL insert form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildUrlForm = /**
         * create URL insert form
         * @return {?}
         */
            function () {
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
        /**
         * inserts link in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertLink = /**
         * inserts link in the editor
         * @return {?}
         */
            function () {
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
        /**
         * create insert image form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildImageForm = /**
         * create insert image form
         * @return {?}
         */
            function () {
                this.imageForm = this._formBuilder.group({
                    imageUrl: ['', [forms.Validators.required]]
                });
                return;
            };
        /**
         * create insert image form
         */
        /**
         * create insert image form
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.buildVideoForm = /**
         * create insert image form
         * @return {?}
         */
            function () {
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
        /**
         * Executed when file is selected
         *
         * @param {?} e onChange event
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.onFileChange = /**
         * Executed when file is selected
         *
         * @param {?} e onChange event
         * @return {?}
         */
            function (e) {
                var _this = this;
                this.uploadComplete = false;
                this.isUploading = true;
                if (e.target.files.length > 0) {
                    /** @type {?} */
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
        /**
         * insert image in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertImage = /**
         * insert image in the editor
         * @return {?}
         */
            function () {
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
        /**
         * insert image in the editor
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertVideo = /**
         * insert image in the editor
         * @return {?}
         */
            function () {
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
        /**
         * inser text/background color
         * @param {?} color
         * @param {?} where
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.insertColor = /**
         * inser text/background color
         * @param {?} color
         * @param {?} where
         * @return {?}
         */
            function (color, where) {
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
        /**
         * set font size
         * @param {?} fontSize
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.setFontSize = /**
         * set font size
         * @param {?} fontSize
         * @return {?}
         */
            function (fontSize) {
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
        /**
         * set font Name/family
         * @param {?} fontName
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.setFontName = /**
         * set font Name/family
         * @param {?} fontName
         * @return {?}
         */
            function (fontName) {
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
        /**
         * allow only numbers
         *
         * @param {?} event keypress event
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.onlyNumbers = /**
         * allow only numbers
         *
         * @param {?} event keypress event
         * @return {?}
         */
            function (event) {
                return event.charCode >= 48 && event.charCode <= 57;
            };
        /**
         * @return {?}
         */
        NgxEditorToolbarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.buildUrlForm();
                this.buildImageForm();
                this.buildVideoForm();
            };
        NgxEditorToolbarComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-ngx-editor-toolbar',
                        template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\"\n            (click)=\"triggerCommand('bold')\"\n            title=\"Bold\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\"\n            (click)=\"triggerCommand('italic')\"\n            title=\"Italic\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\"\n            (click)=\"triggerCommand('underline')\"\n            title=\"Underline\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\"\n            (click)=\"triggerCommand('strikeThrough')\"\n            title=\"Strikethrough\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\"\n            (click)=\"triggerCommand('superscript')\"\n            title=\"Superscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\"\n            (click)=\"triggerCommand('subscript')\"\n            title=\"Subscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n            title=\"Font Family\"\n            [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n            title=\"Font Size\"\n            [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n            title=\"Color Picker\"\n            [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\"\n            (click)=\"triggerCommand('justifyLeft')\"\n            title=\"Justify Left\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\"\n            (click)=\"triggerCommand('justifyCenter')\"\n            title=\"Justify Center\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\"\n            (click)=\"triggerCommand('justifyRight')\"\n            title=\"Justify Right\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\"\n            (click)=\"triggerCommand('justifyFull')\"\n            title=\"Justify\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\"\n            (click)=\"triggerCommand('indent')\"\n            title=\"Indent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\"\n            (click)=\"triggerCommand('outdent')\"\n            title=\"Outdent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\"\n            (click)=\"triggerCommand('cut')\" title=\"Cut\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\"\n            (click)=\"triggerCommand('copy')\"\n            title=\"Copy\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-clone\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\"\n            (click)=\"triggerCommand('delete')\"\n            title=\"Delete\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\"\n            (click)=\"triggerCommand('removeFormat')\"\n            title=\"Clear Formatting\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\"\n            (click)=\"triggerCommand('undo')\"\n            title=\"Undo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\"\n            (click)=\"triggerCommand('redo')\"\n            title=\"Redo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\"\n            (click)=\"triggerCommand('insertParagraph')\"\n            title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\"\n            (click)=\"triggerCommand('blockquote')\"\n            title=\"Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\"\n            (click)=\"triggerCommand('removeBlockquote')\"\n            title=\"Remove Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\"\n            (click)=\"triggerCommand('insertHorizontalRule')\"\n            title=\"Horizontal Line\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\"\n            (click)=\"triggerCommand('insertUnorderedList')\"\n            title=\"Unordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\"\n            (click)=\"triggerCommand('insertOrderedList')\"\n            title=\"Ordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n            [popover]=\"insertLinkTemplate\"\n            title=\"Insert Link\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\"\n            (click)=\"triggerCommand('unlink')\"\n            title=\"Unlink\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n            title=\"Insert Image\"\n            [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-image\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n            title=\"Insert Video\"\n            [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('code')\"\n            (click)=\"triggerCommand('code')\"\n            title=\"View Code\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fal fa-code\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n               required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">Open in new tab</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fal fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fal fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"></div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"></div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Choose Image</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Uploading Image</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\"\n                   [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n                   required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\"\n             [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n             [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fal fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n                 required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"height (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"width (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Text</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Background</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <form autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"hexInput\" class=\"small\">Hex Color</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"hexInput\" name=\"hexInput\" maxlength=\"7\" placeholder=\"HEX Color\"\n                 [(ngModel)]=\"hexColor\"\n                 required>\n        </div>\n        <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(hexColor, selectedColorTab)\">Submit\n        </button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Font size in px/rem\"\n               [(ngModel)]=\"fontSize\"\n               required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\"\n               placeholder=\"Ex: 'Times New Roman', Times, serif\"\n               [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n",
                        providers: [ngxBootstrap.PopoverConfig],
                        styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{background-color:#f5f5f5;font-size:.8rem;padding:.2rem;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;float:left;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;text-align:center;display:inline-block;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
                    }] }
        ];
        /** @nocollapse */
        NgxEditorToolbarComponent.ctorParameters = function () {
            return [
                { type: ngxBootstrap.PopoverConfig },
                { type: forms.FormBuilder },
                { type: MessageService },
                { type: CommandExecutorService }
            ];
        };
        NgxEditorToolbarComponent.propDecorators = {
            config: [{ type: core.Input }],
            urlPopover: [{ type: core.ViewChild, args: ['urlPopover',] }],
            imagePopover: [{ type: core.ViewChild, args: ['imagePopover',] }],
            videoPopover: [{ type: core.ViewChild, args: ['videoPopover',] }],
            fontSizePopover: [{ type: core.ViewChild, args: ['fontSizePopover',] }],
            colorPopover: [{ type: core.ViewChild, args: ['colorPopover',] }],
            execute: [{ type: core.Output }]
        };
        return NgxEditorToolbarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxEditorModule = /** @class */ (function () {
        function NgxEditorModule() {
        }
        NgxEditorModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule, ngxBootstrap.PopoverModule.forRoot()],
                        declarations: [NgxEditorComponent, NgxGrippieComponent, NgxEditorMessageComponent, NgxEditorToolbarComponent],
                        exports: [NgxEditorComponent, ngxBootstrap.PopoverModule],
                        providers: [CommandExecutorService, MessageService]
                    },] }
        ];
        return NgxEditorModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgxEditorModule = NgxEditorModule;
    exports.ɵc = CommandExecutorService;
    exports.ɵb = MessageService;
    exports.ɵe = NgxEditorMessageComponent;
    exports.ɵf = NgxEditorToolbarComponent;
    exports.ɵa = NgxEditorComponent;
    exports.ɵd = NgxGrippieComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci51bWQuanMubWFwIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzLnRzIiwibmc6Ly9uZ3gtZWRpdG9yL2FwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3IvY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZS50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9jb21tb24vbmd4LWVkaXRvci5kZWZhdWx0cy50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWVkaXRvci9hcHAvbmd4LWVkaXRvci9uZ3gtZ3JpcHBpZS9uZ3gtZ3JpcHBpZS5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci1tZXNzYWdlL25neC1lZGl0b3ItbWVzc2FnZS5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci10b29sYmFyL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQudHMiLCJuZzovL25neC1lZGl0b3IvYXBwL25neC1lZGl0b3Ivbmd4LWVkaXRvci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCIvKipcbiAqIGVuYWJsZSBvciBkaXNhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0b29sYmFyIGl0ZW1cbiAqIEBwYXJhbSB0b29sYmFyIHRvb2xiYXIgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkVuYWJsZVRvb2xiYXJPcHRpb25zKHZhbHVlOiBzdHJpbmcsIHRvb2xiYXI6IGFueSk6IGJvb2xlYW4ge1xuXG4gICAgaWYgKHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHRvb2xiYXJbJ2xlbmd0aCddID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0b29sYmFyLmZpbHRlcihhcnJheSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZm91bmQubGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBzZXQgZWRpdG9yIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBAcGFyYW0gdmFsdWUgY29uZmlndXJhdGlvbiB2aWEgW2NvbmZpZ10gcHJvcGVydHlcbiAqIEBwYXJhbSBuZ3hFZGl0b3JDb25maWcgZGVmYXVsdCBlZGl0b3IgY29uZmlndXJhdGlvblxuICogQHBhcmFtIGlucHV0IGRpcmVjdCBjb25maWd1cmF0aW9uIGlucHV0cyB2aWEgZGlyZWN0aXZlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdG9yQ29uZmlndXJhdGlvbih2YWx1ZTogYW55LCBuZ3hFZGl0b3JDb25maWc6IGFueSwgaW5wdXQ6IGFueSk6IGFueSB7XG5cbiAgICBmb3IgKGNvbnN0IGkgaW4gbmd4RWRpdG9yQ29uZmlnKSB7XG4gICAgICAgIGlmIChpKSB7XG5cbiAgICAgICAgICAgIGlmIChpbnB1dFtpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVbaV0gPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlW2ldID0gbmd4RWRpdG9yQ29uZmlnW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIHJldHVybiB2ZXJ0aWNhbCBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcmVzaXplciBwcm9wZXJ0eSBpcyBzZXQgdG8gYmFzaWNcbiAqXG4gKiBAcGFyYW0gcmVzaXplciB0eXBlIG9mIHJlc2l6ZXIsIGVpdGhlciBiYXNpYyBvciBzdGFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVzaXplKHJlc2l6ZXI6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHJlc2l6ZXIgPT09ICdiYXNpYycpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzYXZlIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgb3V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2VsZWN0aW9uKCk6IGFueSB7XG4gICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoc2VsLmdldFJhbmdlQXQgJiYgc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWwuZ2V0UmFuZ2VBdCgwKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uICYmIGRvY3VtZW50LmNyZWF0ZVJhbmdlKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiByZXN0b3JlIHNlbGVjdGlvbiB3aGVuIHRoZSBlZGl0b3IgaXMgZm9jdXNzZWQgaW5cbiAqXG4gKiBAcGFyYW0gcmFuZ2Ugc2F2ZWQgc2VsZWN0aW9uIHdoZW4gdGhlIGVkaXRvciBpcyBmb2N1c3NlZCBvdXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc3RvcmVTZWxlY3Rpb24ocmFuZ2UpOiBib29sZWFuIHtcbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24gJiYgcmFuZ2Uuc2VsZWN0KSB7XG4gICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFJlcXVlc3QsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuLi91dGlscy9uZ3gtZWRpdG9yLnV0aWxzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbW1hbmRFeGVjdXRvclNlcnZpY2Uge1xuXG4gIC8qKiBzYXZlcyB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGVkaXRvciB3aGVuIGZvY3Vzc2VkIG91dCAqL1xuICBzYXZlZFNlbGVjdGlvbjogYW55ID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gX2h0dHAgSFRUUCBDbGllbnQgZm9yIG1ha2luZyBodHRwIHJlcXVlc3RzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9odHRwOiBIdHRwQ2xpZW50KSB7XG4gIH1cblxuICAvKipcbiAgICogZXhlY3V0ZXMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kIGNvbW1hbmQgdG8gYmUgZXhlY3V0ZWRcbiAgICovXG4gIGV4ZWN1dGUoY29tbWFuZDogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAoIXRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgY29tbWFuZCAhPT0gJ2VuYWJsZU9iamVjdFJlc2l6aW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgRWRpdG9yJyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdlbmFibGVPYmplY3RSZXNpemluZycsIHRydWUsICd0cnVlJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdibG9ja3F1b3RlJykge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2Zvcm1hdEJsb2NrJywgZmFsc2UsICdibG9ja3F1b3RlJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT09ICdyZW1vdmVCbG9ja3F1b3RlJykge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2Zvcm1hdEJsb2NrJywgZmFsc2UsICdkaXYnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChjb21tYW5kLCBmYWxzZSwgbnVsbCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gaW1hZ2VVUkkgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0SW1hZ2UoaW1hZ2VVUkk6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBpZiAoaW1hZ2VVUkkpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBjb25zdCBpbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRJbWFnZScsIGZhbHNlLCBpbWFnZVVSSSk7XG4gICAgICAgICAgaWYgKCFpbnNlcnRlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFVSTCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIHZpZGVQYXJhbXMgdXJsIG9mIHRoZSBpbWFnZSB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0VmlkZW8odmlkZVBhcmFtczogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIGlmICh2aWRlUGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNZb3V0dWJlTGluayh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xuICAgICAgICAgICAgY29uc3QgeW91dHViZVVSTCA9ICc8aWZyYW1lIHdpZHRoPVwiJyArIHZpZGVQYXJhbXMud2lkdGggKyAnXCIgaGVpZ2h0PVwiJyArIHZpZGVQYXJhbXMuaGVpZ2h0ICsgJ1wiJ1xuICAgICAgICAgICAgICArICdzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L2lmcmFtZT4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKHlvdXR1YmVVUkwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGVja1RhZ1N1cHBvcnRJbkJyb3dzZXIoJ3ZpZGVvJykpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWxpZFVSTCh2aWRlUGFyYW1zLnZpZGVvVXJsKSkge1xuICAgICAgICAgICAgICBjb25zdCB2aWRlb1NyYyA9ICc8dmlkZW8gd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICAgKyAnIGNvbnRyb2xzPVwidHJ1ZVwiPjxzb3VyY2Ugc3JjPVwiJyArIHZpZGVQYXJhbXMudmlkZW9VcmwgKyAnXCI+PC92aWRlbz4nO1xuICAgICAgICAgICAgICB0aGlzLmluc2VydEh0bWwodmlkZW9TcmMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZpZGVvIFVSTCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGluc2VydCB2aWRlbycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVja3MgdGhlIGlucHV0IHVybCBpcyBhIHZhbGlkIHlvdXR1YmUgVVJMIG9yIG5vdFxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFlvdXR1ZSBVUkxcbiAgICovXG4gIHByaXZhdGUgaXNZb3V0dWJlTGluayh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHl0UmVnRXhwID0gL14oaHR0cChzKT86XFwvXFwvKT8oKHcpezN9Lik/eW91dHUoYmV8LmJlKT8oXFwuY29tKT9cXC8uKy87XG4gICAgcmV0dXJuIHl0UmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzdHJpbmcgaXMgYSB2YWxpZCB1cmwgb3Igbm90XG4gICAqIEBwYXJhbSB1cmwgdXJsXG4gICAqL1xuICBwcml2YXRlIGlzVmFsaWRVUkwodXJsOiBzdHJpbmcpIHtcbiAgICBjb25zdCB1cmxSZWdFeHAgPSAvKGh0dHB8aHR0cHMpOlxcL1xcLyhcXHcrOnswLDF9XFx3Kik/KFxcUyspKDpbMC05XSspPyhcXC98XFwvKFtcXHcjITouPys9JiUhXFwtXFwvXSkpPy87XG4gICAgcmV0dXJuIHVybFJlZ0V4cC50ZXN0KHVybCk7XG4gIH1cblxuICAvKipcbiAgICogdXBsb2FkcyBpbWFnZSB0byB0aGUgc2VydmVyXG4gICAqXG4gICAqIEBwYXJhbSBmaWxlIGZpbGUgdGhhdCBoYXMgdG8gYmUgdXBsb2FkZWRcbiAgICogQHBhcmFtIGVuZFBvaW50IGVucG9pbnQgdG8gd2hpY2ggdGhlIGltYWdlIGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKi9cbiAgdXBsb2FkSW1hZ2UoZmlsZTogRmlsZSwgZW5kUG9pbnQ6IHN0cmluZywgaGVhZGVycz86IGFueSk6IGFueSB7XG5cbiAgICBpZiAoIWVuZFBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltYWdlIEVuZHBvaW50IGlzbmB0IHByb3ZpZGVkIG9yIGludmFsaWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGlmIChmaWxlKSB7XG5cbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG4gICAgICBsZXQgcmVxdWVzdEhlYWRlciA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgICAgY29uc3QgaGVhZGVyS2V5cyA9IE9iamVjdC5rZXlzKGhlYWRlcnMpO1xuICAgICAgZm9yIChjb25zdCBoZWFkZXJLZXkgb2YgaGVhZGVyS2V5cykge1xuICAgICAgICByZXF1ZXN0SGVhZGVyID0gcmVxdWVzdEhlYWRlci5zZXQoaGVhZGVyS2V5LCBoZWFkZXJzW2hlYWRlcktleV0pO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVxID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgZW5kUG9pbnQsIGZvcm1EYXRhLCB7XG4gICAgICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiByZXF1ZXN0SGVhZGVyXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucmVxdWVzdChyZXEpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJbWFnZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnRzIGxpbmsgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIHBhcmFtZXRlcnMgdGhhdCBob2xkcyB0aGUgaW5mb3JtYXRpb24gZm9yIHRoZSBsaW5rXG4gICAqL1xuICBjcmVhdGVMaW5rKHBhcmFtczogYW55KTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgLyoqXG4gICAgICAgKiBjaGVjayB3aGV0aGVyIHRoZSBzYXZlZCBzZWxlY3Rpb24gY29udGFpbnMgYSByYW5nZSBvciBwbGFpbiBzZWxlY3Rpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHBhcmFtcy51cmxOZXdUYWIpIHtcbiAgICAgICAgY29uc3QgbmV3VXJsID0gJzxhIGhyZWY9XCInICsgcGFyYW1zLnVybExpbmsgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIHBhcmFtcy51cmxUZXh0ICsgJzwvYT4nO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS50eXBlICE9PSAnUmFuZ2UnKSB7XG4gICAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKG5ld1VybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBuZXcgbGlua3MgY2FuIGJlIGluc2VydGVkLiBZb3UgY2Fubm90IGVkaXQgVVJMYHMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY3JlYXRlTGluaycsIGZhbHNlLCBwYXJhbXMudXJsTGluayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnQgY29sb3IgZWl0aGVyIGZvbnQgb3IgYmFja2dyb3VuZFxuICAgKlxuICAgKiBAcGFyYW0gY29sb3IgY29sb3IgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIHdoZXJlIHdoZXJlIHRoZSBjb2xvciBoYXMgdG8gYmUgaW5zZXJ0ZWQgZWl0aGVyIHRleHQvYmFja2dyb3VuZFxuICAgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgIGlmIChyZXN0b3JlZCAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgICAgaWYgKHdoZXJlID09PSAndGV4dENvbG9yJykge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JlQ29sb3InLCBmYWxzZSwgY29sb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdoaWxpdGVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCBmb250IHNpemUgZm9yIHRleHRcbiAgICpcbiAgICogQHBhcmFtIGZvbnRTaXplIGZvbnQtc2l6ZSB0byBiZSBzZXRcbiAgICovXG4gIHNldEZvbnRTaXplKGZvbnRTaXplOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgZGVsZXRlZFZhbHVlID0gdGhpcy5kZWxldGVBbmRHZXRFbGVtZW50KCk7XG5cbiAgICAgIGlmIChkZWxldGVkVmFsdWUpIHtcblxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnRTaXplKSkge1xuICAgICAgICAgICAgY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250UHgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250UHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc2V0IGZvbnQgbmFtZS9mYW1pbHkgZm9yIHRleHRcbiAgICpcbiAgICogQHBhcmFtIGZvbnROYW1lIGZvbnQtZmFtaWx5IHRvIGJlIHNldFxuICAgKi9cbiAgc2V0Rm9udE5hbWUoZm9udE5hbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udE5hbWUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWx5ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1mYW1pbHk6ICcgKyBmb250TmFtZSArICc7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250RmFtaWx5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIGluc2VydCBIVE1MICovXG4gIHByaXZhdGUgaW5zZXJ0SHRtbChodG1sOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGNvbnN0IGlzSFRNTEluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEhUTUwnLCBmYWxzZSwgaHRtbCk7XG5cbiAgICBpZiAoIWlzSFRNTEluc2VydGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdmFsdWUgaXMgYSBudW1iZXIgb3Igc3RyaW5nXG4gICAqIGlmIG51bWJlciByZXR1cm4gdHJ1ZVxuICAgKiBlbHNlIHJldHVybiBmYWxzZVxuICAgKi9cbiAgcHJpdmF0ZSBpc051bWVyaWModmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXi17MCwxfVxcZCskLy50ZXN0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBkZWxldGUgdGhlIHRleHQgYXQgc2VsZWN0ZWQgcmFuZ2UgYW5kIHJldHVybiB0aGUgdmFsdWUgKi9cbiAgcHJpdmF0ZSBkZWxldGVBbmRHZXRFbGVtZW50KCk6IGFueSB7XG5cbiAgICBsZXQgc2xlY3RlZFRleHQ7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgc2xlY3RlZFRleHQgPSB0aGlzLnNhdmVkU2VsZWN0aW9uLnRvU3RyaW5nKCk7XG4gICAgICB0aGlzLnNhdmVkU2VsZWN0aW9uLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICByZXR1cm4gc2xlY3RlZFRleHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIH1cblxuICAvKiogY2hlY2sgYW55IHNsZWN0aW9uIGlzIG1hZGUgb3Igbm90ICovXG4gIHByaXZhdGUgY2hlY2tTZWxlY3Rpb24oKTogYW55IHtcblxuICAgIGNvbnN0IHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuXG4gICAgaWYgKHNsZWN0ZWRUZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBTZWxlY3Rpb24gTWFkZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHRhZyBpcyBzdXBwb3J0ZWQgYnkgYnJvd3NlciBvciBub3RcbiAgICpcbiAgICogQHBhcmFtIHRhZyBIVE1MIHRhZ1xuICAgKi9cbiAgcHJpdmF0ZSBjaGVja1RhZ1N1cHBvcnRJbkJyb3dzZXIodGFnOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZykgaW5zdGFuY2VvZiBIVE1MVW5rbm93bkVsZW1lbnQpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKiogdGltZSBpbiB3aGljaCB0aGUgbWVzc2FnZSBoYXMgdG8gYmUgY2xlYXJlZCAqL1xuY29uc3QgRFVSQVRJT04gPSA3MDAwO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZVNlcnZpY2Uge1xuXG4gIC8qKiB2YXJpYWJsZSB0byBob2xkIHRoZSB1c2VyIG1lc3NhZ2UgKi9cbiAgcHJpdmF0ZSBtZXNzYWdlOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqIHJldHVybnMgdGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgZWRpdG9yICovXG4gIGdldE1lc3NhZ2UoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNlbmRzIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gbWVzc2FnZSBtZXNzYWdlIHRvIGJlIHNlbnRcbiAgICovXG4gIHNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubWVzc2FnZS5uZXh0KG1lc3NhZ2UpO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlSW4oRFVSQVRJT04pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBhIHNob3J0IGludGVydmFsIHRvIGNsZWFyIG1lc3NhZ2VcbiAgICpcbiAgICogQHBhcmFtIG1pbGxpc2Vjb25kcyB0aW1lIGluIHNlY29uZHMgaW4gd2hpY2ggdGhlIG1lc3NhZ2UgaGFzIHRvIGJlIGNsZWFyZWRcbiAgICovXG4gIHByaXZhdGUgY2xlYXJNZXNzYWdlSW4obWlsbGlzZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubWVzc2FnZS5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSwgbWlsbGlzZWNvbmRzKTtcbiAgICByZXR1cm47XG4gIH1cblxufVxuIiwiLyoqXG4gKiB0b29sYmFyIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgY29uc3Qgbmd4RWRpdG9yQ29uZmlnID0ge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgc3BlbGxjaGVjazogdHJ1ZSxcbiAgaGVpZ2h0OiAnYXV0bycsXG4gIG1pbkhlaWdodDogJzAnLFxuICB3aWR0aDogJ2F1dG8nLFxuICBtaW5XaWR0aDogJzAnLFxuICB0cmFuc2xhdGU6ICd5ZXMnLFxuICBlbmFibGVUb29sYmFyOiB0cnVlLFxuICBzaG93VG9vbGJhcjogdHJ1ZSxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB0ZXh0IGhlcmUuLi4nLFxuICBpbWFnZUVuZFBvaW50OiAnJyxcbiAgdG9vbGJhcjogW1xuICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZVRocm91Z2gnLCAnc3VwZXJzY3JpcHQnLCAnc3Vic2NyaXB0J10sXG4gICAgWydmb250TmFtZScsICdmb250U2l6ZScsICdjb2xvciddLFxuICAgIFsnanVzdGlmeUxlZnQnLCAnanVzdGlmeUNlbnRlcicsICdqdXN0aWZ5UmlnaHQnLCAnanVzdGlmeUZ1bGwnLCAnaW5kZW50JywgJ291dGRlbnQnXSxcbiAgICBbJ2N1dCcsICdjb3B5JywgJ2RlbGV0ZScsICdyZW1vdmVGb3JtYXQnLCAndW5kbycsICdyZWRvJ10sXG4gICAgWydwYXJhZ3JhcGgnLCAnYmxvY2txdW90ZScsICdyZW1vdmVCbG9ja3F1b3RlJywgJ2hvcml6b250YWxMaW5lJywgJ29yZGVyZWRMaXN0JywgJ3Vub3JkZXJlZExpc3QnXSxcbiAgICBbJ2xpbmsnLCAndW5saW5rJywgJ2ltYWdlJywgJ3ZpZGVvJ10sXG4gICAgWydjb2RlJ11cbiAgXSxcbiAgaGVhZGVyczoge30sXG4gIHJlc3BvbnNlRW5kUG9pbnQ6IG51bGwsXG4gIGFwcGVuZEltYWdlRW5kUG9pbnRUb1Jlc3BvbnNlOiB0cnVlXG59O1xuXG4vKipcbiAqIGNvZGVtaXJyb3IgY29uZmlndWFyYXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNvZGVNaXJyb3JDb25maWcgPSB7XG4gIGxpbmVOdW1iZXJzOiB0cnVlLFxuICBndXR0ZXI6IHRydWUsXG4gIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgbW9kZTogJ2h0bWxtaXhlZCcsXG4gIGF1dG9mb2N1czogdHJ1ZSxcbiAgaHRtbE1vZGU6IHRydWVcbn07XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgVmlld0NoaWxkLFxuICBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgZm9yd2FyZFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBDb2RlTWlycm9yIGZyb20gJ2NvZGVtaXJyb3InO1xuaW1wb3J0ICdjb2RlbWlycm9yL2FkZG9uL2Rpc3BsYXkvcGxhY2Vob2xkZXIuanMnO1xuaW1wb3J0ICdjb2RlbWlycm9yL21vZGUvaHRtbG1peGVkL2h0bWxtaXhlZC5qcyc7XG5cbmltcG9ydCB7Q29tbWFuZEV4ZWN1dG9yU2VydmljZX0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5cbmltcG9ydCB7bmd4RWRpdG9yQ29uZmlnLCBjb2RlTWlycm9yQ29uZmlnfSBmcm9tICcuL2NvbW1vbi9uZ3gtZWRpdG9yLmRlZmF1bHRzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWVkaXRvci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5neEVkaXRvckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gIC8qKiBTcGVjaWZpZXMgd2VhdGhlciB0aGUgdGV4dGFyZWEgdG8gYmUgZWRpdGFibGUgb3Igbm90ICovXG4gIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xuICAvKiogVGhlIHNwZWxsY2hlY2sgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgdG8gaGF2ZSBpdHMgc3BlbGxpbmcgYW5kIGdyYW1tYXIgY2hlY2tlZCBvciBub3QuICovXG4gIEBJbnB1dCgpIHNwZWxsY2hlY2s6IGJvb2xlYW47XG4gIC8qKiBQbGFjZWhvbGRlciBmb3IgdGhlIHRleHRBcmVhICovXG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgdHJhbnNsYXRlIHByb3BlcnR5IHNwZWNpZmllcyB3aGV0aGVyIHRoZSBjb250ZW50IG9mIGFuIGVsZW1lbnQgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgb3Igbm90LlxuICAgKlxuICAgKiBDaGVjayBodHRwczovL3d3dy53M3NjaG9vbHMuY29tL3RhZ3MvYXR0X2dsb2JhbF90cmFuc2xhdGUuYXNwIGZvciBtb3JlIGluZm9ybWF0aW9uIGFuZCBicm93c2VyIHN1cHBvcnRcbiAgICovXG4gIEBJbnB1dCgpIHRyYW5zbGF0ZTogc3RyaW5nO1xuICAvKiogU2V0cyBoZWlnaHQgb2YgdGhlIGVkaXRvciAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZztcbiAgLyoqIFNldHMgbWluaW11bSBoZWlnaHQgZm9yIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgbWluSGVpZ2h0OiBzdHJpbmc7XG4gIC8qKiBTZXRzIFdpZHRoIG9mIHRoZSBlZGl0b3IgKi9cbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZztcbiAgLyoqIFNldHMgbWluaW11bSB3aWR0aCBvZiB0aGUgZWRpdG9yICovXG4gIEBJbnB1dCgpIG1pbldpZHRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUb29sYmFyIGFjY2VwdHMgYW4gYXJyYXkgd2hpY2ggc3BlY2lmaWVzIHRoZSBvcHRpb25zIHRvIGJlIGVuYWJsZWQgZm9yIHRoZSB0b29sYmFyXG4gICAqXG4gICAqIENoZWNrIG5neEVkaXRvckNvbmZpZyBmb3IgdG9vbGJhciBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIFBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgd2lsbCBlbmFibGUgYWxsIHRvb2xiYXJcbiAgICovXG4gIEBJbnB1dCgpIHRvb2xiYXI6IE9iamVjdDtcbiAgLyoqXG4gICAqIFRoZSBlZGl0b3IgY2FuIGJlIHJlc2l6ZWQgdmVydGljYWxseS5cbiAgICpcbiAgICogYGJhc2ljYCByZXNpemVyIGVuYWJsZXMgdGhlIGh0bWw1IHJlc3ppZXIuIENoZWNrIGhlcmUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS9jc3NyZWYvY3NzM19wcl9yZXNpemUuYXNwXG4gICAqXG4gICAqIGBzdGFja2AgcmVzaXplciBlbmFibGUgYSByZXNpemVyIHRoYXQgbG9va3MgbGlrZSBhcyBpZiBpbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tXG4gICAqL1xuICBASW5wdXQoKSByZXNpemVyID0gJ3N0YWNrJztcbiAgLyoqXG4gICAqIFRoZSBjb25maWcgcHJvcGVydHkgaXMgYSBKU09OIG9iamVjdFxuICAgKlxuICAgKiBBbGwgYXZhaWJhbGUgaW5wdXRzIGlucHV0cyBjYW4gYmUgcHJvdmlkZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gYXMgSlNPTlxuICAgKiBpbnB1dHMgcHJvdmlkZWQgZGlyZWN0bHkgYXJlIGNvbnNpZGVyZWQgYXMgdG9wIHByaW9yaXR5XG4gICAqL1xuICBASW5wdXQoKSBjb25maWcgPSBuZ3hFZGl0b3JDb25maWc7XG4gIC8qKiBXZWF0aGVyIHRvIHNob3cgb3IgaGlkZSB0b29sYmFyICovXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuO1xuICAvKiogV2VhdGhlciB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgdG9vbGJhciAqL1xuICBASW5wdXQoKSBlbmFibGVUb29sYmFyOiBib29sZWFuO1xuICAvKiogRW5kcG9pbnQgZm9yIHdoaWNoIHRoZSBpbWFnZSB0byBiZSB1cGxvYWRlZCAqL1xuICBASW5wdXQoKSBpbWFnZUVuZFBvaW50OiBzdHJpbmc7XG5cbiAgLyoqIGVtaXRzIGBibHVyYCBldmVudCB3aGVuIGZvY3VzZWQgb3V0IGZyb20gdGhlIHRleHRhcmVhICovXG4gIEBPdXRwdXQoKSBibHVyOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICAvKiogZW1pdHMgYGZvY3VzYCBldmVudCB3aGVuIGZvY3VzZWQgaW4gdG8gdGhlIHRleHRhcmVhICovXG4gIEBPdXRwdXQoKSBmb2N1czogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBAVmlld0NoaWxkKCduZ3hUZXh0QXJlYScpIHRleHRBcmVhOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ25neENvZGVFZGl0b3InKSBjb2RlRWRpdG9yOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ25neFdyYXBwZXInKSBuZ3hXcmFwcGVyOiBhbnk7XG5cbiAgVXRpbHM6IGFueSA9IFV0aWxzO1xuICBjb2RlRWRpdG9yTW9kZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgbmd4Q29kZU1pcnJvcjogYW55ID0gdW5kZWZpbmVkO1xuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbiAgcHJpdmF0ZSBvblRvdWNoZWQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvciBtZXNzYWdlIGNvbXBvbmVudFxuICAgKiBAcGFyYW0gX2NvbW1hbmRFeGVjdXRvciBleGVjdXRlcyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXJcbiAgICogQHBhcmFtIF9yZW5kZXJlciBhY2Nlc3MgYW5kIG1hbmlwdWxhdGUgdGhlIGRvbSBlbGVtZW50XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfY29tbWFuZEV4ZWN1dG9yOiBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlLFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBldmVudHNcbiAgICovXG4gIG9uVGV4dEFyZWFGb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzLmVtaXQoJ2ZvY3VzJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIGZvY3VzIHRoZSB0ZXh0IGFyZWEgd2hlbiB0aGUgZWRpdG9yIGlzIGZvY3Vzc2VkICovXG4gIG9uRWRpdG9yRm9jdXMoKSB7XG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZWQgZnJvbSB0aGUgY29udGVudGVkaXRhYmxlIHNlY3Rpb24gd2hpbGUgdGhlIGlucHV0IHByb3BlcnR5IGNoYW5nZXNcbiAgICogQHBhcmFtIGh0bWwgaHRtbCBzdHJpbmcgZnJvbSBjb250ZW50ZWRpdGFibGVcbiAgICovXG4gIG9uQ29udGVudENoYW5nZShodG1sOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkNoYW5nZShodG1sKTtcbiAgICAgIHRoaXMudG9nZ2xlUGxhY2Vob2xkZXIoaHRtbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb25UZXh0QXJlYUJsdXIoKTogdm9pZCB7XG5cbiAgICAvKiogc2F2ZSBzZWxlY3Rpb24gaWYgZm9jdXNzZWQgb3V0ICovXG4gICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yLnNhdmVkU2VsZWN0aW9uID0gVXRpbHMuc2F2ZVNlbGVjdGlvbigpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uVG91Y2hlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gICAgdGhpcy5ibHVyLmVtaXQoJ2JsdXInKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogcmVzaXppbmcgdGV4dCBhcmVhXG4gICAqXG4gICAqIEBwYXJhbSBvZmZzZXRZIHZlcnRpY2FsIGhlaWdodCBvZiB0aGUgZWlkdGFibGUgcG9ydGlvbiBvZiB0aGUgZWRpdG9yXG4gICAqL1xuICByZXNpemVUZXh0QXJlYShvZmZzZXRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgbmV3SGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5oZWlnaHQsIDEwKTtcbiAgICBuZXdIZWlnaHQgKz0gb2Zmc2V0WTtcbiAgICB0aGlzLmhlaWdodCA9IG5ld0hlaWdodCArICdweCc7XG4gICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIGNvZGUtZWRpdG9yIGhlaWdodCBvbmx5IG9uIGVkaXRvciBtb2RlXG4gICAgICovXG4gICAgaWYgKHRoaXMuY29kZUVkaXRvck1vZGUpIHtcbiAgICAgIHRoaXMubmd4Q29kZU1pcnJvci5zZXRTaXplKCcxMDAlJywgdGhpcy5oZWlnaHQpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogZWRpdG9yIGFjdGlvbnMsIGkuZS4sIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0b29sYmFyXG4gICAqXG4gICAqIEBwYXJhbSBjb21tYW5kTmFtZSBuYW1lIG9mIHRoZSBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXG4gICAqL1xuICBleGVjdXRlQ29tbWFuZChjb21tYW5kTmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAoY29tbWFuZE5hbWUgPT09ICdjb2RlJykge1xuICAgICAgdGhpcy50b2dnbGVDb2RlRWRpdG9yKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvci5leGVjdXRlKGNvbW1hbmROYW1lKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgdmFsdWUgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGVyZSBpcyBhIGNoYW5nZSBpbiBjb250ZW50ZWRpdGFibGVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuXG4gICAgdGhpcy50b2dnbGVQbGFjZWhvbGRlcih2YWx1ZSk7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09ICc8YnI+Jykge1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMucmVmcmVzaFZpZXcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAqIHdoZW4gdGhlIGNvbnRyb2wgcmVjZWl2ZXMgYSBjaGFuZ2UgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBhIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICogd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIHRvdWNoIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZm4gYSBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogcmVmcmVzaCB2aWV3L0hUTUwgb2YgdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgaHRtbCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICByZWZyZXNoVmlldyh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2lubmVySFRNTCcsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvZ2dsZSBiZXR3ZWVuIGNvZGV2aWV3IGFuZCBlZGl0b3JcbiAgICovXG4gIHRvZ2dsZUNvZGVFZGl0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5jb2RlRWRpdG9yTW9kZSA9ICF0aGlzLmNvZGVFZGl0b3JNb2RlO1xuXG4gICAgaWYgKHRoaXMuY29kZUVkaXRvck1vZGUpIHtcblxuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEodGhpcy5jb2RlRWRpdG9yLm5hdGl2ZUVsZW1lbnQsIGNvZGVNaXJyb3JDb25maWcpO1xuXG4gICAgICAvKiogc2V0IHZhbHVlIG9mIHRoZSBjb2RlIGVkaXRvciAqL1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnNldFZhbHVlKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xuXG4gICAgICAvKiogc2V0cyBoZWlnaHQgb2YgdGhlIGNvZGUgZWRpdG9yIGFzIHNhbWUgYXMgdGhlIGhlaWdodCBvZiB0aGUgdGV4dEFyZWEgKi9cbiAgICAgIHRoaXMubmd4Q29kZU1pcnJvci5zZXRTaXplKCcxMDAlJywgdGhpcy5oZWlnaHQpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgLyoqIHJlbW92ZS8gZGVzdHJveSBjb2RlIGVkaXRvciAqL1xuICAgICAgdGhpcy5uZ3hDb2RlTWlycm9yLnRvVGV4dEFyZWEoKTtcblxuICAgICAgLyoqIHVwZGF0ZSB0aGUgbW9kZWwgdmFsdWUgYW5kIGh0bWwgY29udGVudCBvbiB0aGUgY29udGVudGVkaXRhYmxlICovXG4gICAgICB0aGlzLnJlZnJlc2hWaWV3KHRoaXMubmd4Q29kZU1pcnJvci5nZXRWYWx1ZSgpKTtcbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKHRoaXMubmd4Q29kZU1pcnJvci5nZXRWYWx1ZSgpKTtcblxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogdG9nZ2xlcyBwbGFjZWhvbGRlciBiYXNlZCBvbiBpbnB1dCBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIEEgSFRNTCBzdHJpbmcgZnJvbSB0aGUgZWRpdG9yXG4gICAqL1xuICB0b2dnbGVQbGFjZWhvbGRlcih2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gJzxicj4nIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5uZ3hXcmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdzaG93LXBsYWNlaG9sZGVyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMubmd4V3JhcHBlci5uYXRpdmVFbGVtZW50LCAnc2hvdy1wbGFjZWhvbGRlcicpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIGpzb24gY29udGFpbmluZyBpbnB1dCBwYXJhbXNcbiAgICovXG4gIGdldENvbGxlY3RpdmVQYXJhbXMoKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgZWRpdGFibGU6IHRoaXMuZWRpdGFibGUsXG4gICAgICBzcGVsbGNoZWNrOiB0aGlzLnNwZWxsY2hlY2ssXG4gICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlcixcbiAgICAgIHRyYW5zbGF0ZTogdGhpcy50cmFuc2xhdGUsXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgbWluSGVpZ2h0OiB0aGlzLm1pbkhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgbWluV2lkdGg6IHRoaXMubWluV2lkdGgsXG4gICAgICBlbmFibGVUb29sYmFyOiB0aGlzLmVuYWJsZVRvb2xiYXIsXG4gICAgICBzaG93VG9vbGJhcjogdGhpcy5zaG93VG9vbGJhcixcbiAgICAgIGltYWdlRW5kUG9pbnQ6IHRoaXMuaW1hZ2VFbmRQb2ludCxcbiAgICAgIHRvb2xiYXI6IHRoaXMudG9vbGJhclxuICAgIH07XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBzZXQgY29uZmlndWFydGlvblxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnID0gdGhpcy5VdGlscy5nZXRFZGl0b3JDb25maWd1cmF0aW9uKHRoaXMuY29uZmlnLCBuZ3hFZGl0b3JDb25maWcsIHRoaXMuZ2V0Q29sbGVjdGl2ZVBhcmFtcygpKTtcblxuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgIHRoaXMuZXhlY3V0ZUNvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJyk7XG5cbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4RWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi4vbmd4LWVkaXRvci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWdyaXBwaWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdyaXBwaWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ3JpcHBpZS5jb21wb25lbnQuc2NzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmd4R3JpcHBpZUNvbXBvbmVudCB7XG5cbiAgLyoqIGhlaWdodCBvZiB0aGUgZWRpdG9yICovXG4gIGhlaWdodDogbnVtYmVyO1xuICAvKiogcHJldmlvdXMgdmFsdWUgYmVmb3IgcmVzaXppbmcgdGhlIGVkaXRvciAqL1xuICBvbGRZID0gMDtcbiAgLyoqIHNldCB0byB0cnVlIG9uIG1vdXNlZG93biBldmVudCAqL1xuICBncmFiYmVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBfZWRpdG9yQ29tcG9uZW50IEVkaXRvciBjb21wb25lbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VkaXRvckNvbXBvbmVudDogTmd4RWRpdG9yQ29tcG9uZW50KSB7IH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IE1vdXNlZXZlbnRcbiAgICpcbiAgICogVXBkYXRlIHRoZSBoZWlnaHQgb2YgdGhlIGVkaXRvciB3aGVuIHRoZSBncmFiYmVyIGlzIGRyYWdnZWRcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG5cbiAgICBpZiAoIXRoaXMuZ3JhYmJlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VkaXRvckNvbXBvbmVudC5yZXNpemVUZXh0QXJlYShldmVudC5jbGllbnRZIC0gdGhpcy5vbGRZKTtcbiAgICB0aGlzLm9sZFkgPSBldmVudC5jbGllbnRZO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBNb3VzZWV2ZW50XG4gICAqXG4gICAqIHNldCB0aGUgZ3JhYmJlciB0byBmYWxzZSBvbiBtb3VzZSB1cCBhY3Rpb25cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnLCBbJyRldmVudCddKSBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmdyYWJiZXIgPSBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pIG9uUmVzaXplKGV2ZW50OiBNb3VzZUV2ZW50LCByZXNpemVyPzogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmdyYWJiZXIgPSB0cnVlO1xuICAgIHRoaXMub2xkWSA9IGV2ZW50LmNsaWVudFk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5neC1lZGl0b3ItbWVzc2FnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZWRpdG9yLW1lc3NhZ2UuY29tcG9uZW50LnNjc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1lc3NhZ2VDb21wb25lbnQge1xuXG4gIC8qKiBwcm9wZXJ0eSB0aGF0IGhvbGRzIHRoZSBtZXNzYWdlIHRvIGJlIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yICovXG4gIG5neE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBfbWVzc2FnZVNlcnZpY2Ugc2VydmljZSB0byBzZW5kIG1lc3NhZ2UgdG8gdGhlIGVkaXRvclxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XG4gICAgdGhpcy5fbWVzc2FnZVNlcnZpY2UuZ2V0TWVzc2FnZSgpLnN1YnNjcmliZSgobWVzc2FnZTogc3RyaW5nKSA9PiB0aGlzLm5neE1lc3NhZ2UgPSBtZXNzYWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhcnMgZWRpdG9yIG1lc3NhZ2VcbiAgICovXG4gIGNsZWFyTWVzc2FnZSgpOiB2b2lkIHtcbiAgICB0aGlzLm5neE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7SHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1BvcG92ZXJDb25maWd9IGZyb20gJ25neC1ib290c3RyYXAnO1xuaW1wb3J0IHtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci10b29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtQb3BvdmVyQ29uZmlnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBsaW5rIGZvcm0gKi9cbiAgdXJsRm9ybTogRm9ybUdyb3VwO1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgaW1hZ2UgZm9ybSAqL1xuICBpbWFnZUZvcm06IEZvcm1Hcm91cDtcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IHZpZGVvIGZvcm0gKi9cbiAgdmlkZW9Gb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBzZXQgdG8gZmFsc2Ugd2hlbiBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICB1cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gIC8qKiB1cGxvYWQgcGVyY2VudGFnZSAqL1xuICB1cGRsb2FkUGVyY2VudGFnZSA9IDA7XG4gIC8qKiBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICBpc1VwbG9hZGluZyA9IGZhbHNlO1xuICAvKiogd2hpY2ggdGFiIHRvIGFjdGl2ZSBmb3IgY29sb3IgaW5zZXRpb24gKi9cbiAgc2VsZWN0ZWRDb2xvclRhYiA9ICd0ZXh0Q29sb3InO1xuICAvKiogZm9udCBmYW1pbHkgbmFtZSAqL1xuICBmb250TmFtZSA9ICcnO1xuICAvKiogZm9udCBzaXplICovXG4gIGZvbnRTaXplID0gJyc7XG4gIC8qKiBoZXggY29sb3IgY29kZSAqL1xuICBoZXhDb2xvciA9ICcnO1xuICAvKiogc2hvdy9oaWRlIGltYWdlIHVwbG9hZGVyICovXG4gIGlzSW1hZ2VVcGxvYWRlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBFZGl0b3IgY29uZmlndXJhdGlvblxuICAgKi9cbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ3VybFBvcG92ZXInKSB1cmxQb3BvdmVyO1xuICBAVmlld0NoaWxkKCdpbWFnZVBvcG92ZXInKSBpbWFnZVBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ3ZpZGVvUG9wb3ZlcicpIHZpZGVvUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnZm9udFNpemVQb3BvdmVyJykgZm9udFNpemVQb3BvdmVyO1xuICBAVmlld0NoaWxkKCdjb2xvclBvcG92ZXInKSBjb2xvclBvcG92ZXI7XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIGEgdG9vbGJhciBidXR0b24gaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpIGV4ZWN1dGU6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9wT3ZlckNvbmZpZzogUG9wb3ZlckNvbmZpZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvclNlcnZpY2U6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UpIHtcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLm91dHNpZGVDbGljayA9IHRydWU7XG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5wbGFjZW1lbnQgPSAnYm90dG9tJztcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLmNvbnRhaW5lciA9ICdib2R5JztcbiAgfVxuXG4gIC8qKlxuICAgKiBlbmFibGUgb3IgZGlhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgbmFtZSBvZiB0aGUgdG9vbGJhciBidXR0b25zXG4gICAqL1xuICBjYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlscy5jYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZSwgdGhpcy5jb25maWdbJ3Rvb2xiYXInXSk7XG4gIH1cblxuICAvKipcbiAgICogdHJpZ2dlcnMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyIHRvIGJlIGV4ZWN1dGVkIGFuZCBlbWl0cyBhbiBldmVudFxuICAgKlxuICAgKiBAcGFyYW0gY29tbWFuZCBuYW1lIG9mIHRoZSBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXG4gICAqL1xuICB0cmlnZ2VyQ29tbWFuZChjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmV4ZWN1dGUuZW1pdChjb21tYW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgVVJMIGluc2VydCBmb3JtXG4gICAqL1xuICBidWlsZFVybEZvcm0oKTogdm9pZCB7XG5cbiAgICB0aGlzLnVybEZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1cmxMaW5rOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxUZXh0OiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxOZXdUYWI6IFt0cnVlXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqL1xuICBpbnNlcnRMaW5rKCk6IHZvaWQge1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuY3JlYXRlTGluayh0aGlzLnVybEZvcm0udmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZFVybEZvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudXJsUG9wb3Zlci5oaWRlKCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZEltYWdlRm9ybSgpOiB2b2lkIHtcblxuICAgIHRoaXMuaW1hZ2VGb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgaW1hZ2VVcmw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBpbnNlcnQgaW1hZ2UgZm9ybVxuICAgKi9cbiAgYnVpbGRWaWRlb0Zvcm0oKTogdm9pZCB7XG5cbiAgICB0aGlzLnZpZGVvRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHZpZGVvVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICBoZWlnaHQ6IFsnJ10sXG4gICAgICB3aWR0aDogWycnXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxuICAgKlxuICAgKiBAcGFyYW0gZSBvbkNoYW5nZSBldmVudFxuICAgKi9cbiAgb25GaWxlQ2hhbmdlKGUpOiB2b2lkIHtcblxuICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblxuICAgIGlmIChlLnRhcmdldC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5jb25maWcuaW1hZ2VFbmRQb2ludCwgdGhpcy5jb25maWcuaGVhZGVycykuc3Vic2NyaWJlKGV2ZW50ID0+IHtcblxuICAgICAgICAgIGlmIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGxvYWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcucmVzcG9uc2VFbmRQb2ludCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5jb25maWcucmVzcG9uc2VFbmRQb2ludCArIGV2ZW50LmJvZHkudXJsKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydEltYWdlKGV2ZW50LmJvZHkudXJsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0SW1hZ2UoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5pbWFnZUZvcm0udmFsdWUuaW1hZ2VVcmwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy5pbWFnZVBvcG92ZXIuaGlkZSgpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXG4gIGluc2VydFZpZGVvKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydFZpZGVvKHRoaXMudmlkZW9Gb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudmlkZW9Qb3BvdmVyLmhpZGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBpbnNlciB0ZXh0L2JhY2tncm91bmQgY29sb3IgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0Q29sb3IoY29sb3IsIHdoZXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclBvcG92ZXIuaGlkZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBzZXQgZm9udCBzaXplICovXG4gIHNldEZvbnRTaXplKGZvbnRTaXplOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnRTaXplKGZvbnRTaXplKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBzZXQgZm9udCBOYW1lL2ZhbWlseSAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5zZXRGb250TmFtZShmb250TmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogYWxsb3cgb25seSBudW1iZXJzXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBrZXlwcmVzcyBldmVudFxuICAgKi9cbiAgb25seU51bWJlcnMoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXZlbnQuY2hhckNvZGUgPj0gNDggJiYgZXZlbnQuY2hhckNvZGUgPD0gNTc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmJ1aWxkVXJsRm9ybSgpO1xuICAgIHRoaXMuYnVpbGRJbWFnZUZvcm0oKTtcbiAgICB0aGlzLmJ1aWxkVmlkZW9Gb3JtKCk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBQb3BvdmVyTW9kdWxlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuL25neC1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IE5neEdyaXBwaWVDb21wb25lbnQgfSBmcm9tICcuL25neC1ncmlwcGllL25neC1ncmlwcGllLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLW1lc3NhZ2Uvbmd4LWVkaXRvci1tZXNzYWdlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4vY29tbW9uL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIH0gZnJvbSAnLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIFBvcG92ZXJNb2R1bGUuZm9yUm9vdCgpXSxcbiAgZGVjbGFyYXRpb25zOiBbTmd4RWRpdG9yQ29tcG9uZW50LCBOZ3hHcmlwcGllQ29tcG9uZW50LCBOZ3hFZGl0b3JNZXNzYWdlQ29tcG9uZW50LCBOZ3hFZGl0b3JUb29sYmFyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neEVkaXRvckNvbXBvbmVudCwgUG9wb3Zlck1vZHVsZV0sXG4gIHByb3ZpZGVyczogW0NvbW1hbmRFeGVjdXRvclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJVdGlscy5yZXN0b3JlU2VsZWN0aW9uIiwiSHR0cEhlYWRlcnMiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiSHR0cFJlcXVlc3QiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsIlN1YmplY3QiLCJFdmVudEVtaXR0ZXIiLCJVdGlscy5zYXZlU2VsZWN0aW9uIiwiQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEiLCJDb21wb25lbnQiLCJOR19WQUxVRV9BQ0NFU1NPUiIsImZvcndhcmRSZWYiLCJSZW5kZXJlcjIiLCJJbnB1dCIsIk91dHB1dCIsIlZpZXdDaGlsZCIsIkhvc3RMaXN0ZW5lciIsIlV0aWxzLmNhbkVuYWJsZVRvb2xiYXJPcHRpb25zIiwiVmFsaWRhdG9ycyIsIkh0dHBSZXNwb25zZSIsIlBvcG92ZXJDb25maWciLCJGb3JtQnVpbGRlciIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiRm9ybXNNb2R1bGUiLCJSZWFjdGl2ZUZvcm1zTW9kdWxlIiwiUG9wb3Zlck1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0FBY0EsYUE0RmdCLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO29CQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENB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