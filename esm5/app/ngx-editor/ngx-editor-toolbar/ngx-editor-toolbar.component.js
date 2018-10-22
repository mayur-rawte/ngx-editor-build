/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { PopoverConfig } from 'ngx-bootstrap';
import { CommandExecutorService } from '../common/services/command-executor.service';
import { MessageService } from '../common/services/message.service';
import * as Utils from '../common/utils/ngx-editor.utils';
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
        this.execute = new EventEmitter();
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
        return Utils.canEnableToolbarOptions(value, this.config['toolbar']);
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
            urlLink: ['', [Validators.required]],
            urlText: ['', [Validators.required]],
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
            imageUrl: ['', [Validators.required]]
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
            videoUrl: ['', [Validators.required]],
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
                    if (event instanceof HttpResponse) {
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
        { type: Component, args: [{
                    selector: 'app-ngx-editor-toolbar',
                    template: "<div class=\"ngx-toolbar\" *ngIf=\"config['showToolbar']\">\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('bold')\"\n            (click)=\"triggerCommand('bold')\"\n            title=\"Bold\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-bold\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('italic')\"\n            (click)=\"triggerCommand('italic')\"\n            title=\"Italic\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-italic\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('underline')\"\n            (click)=\"triggerCommand('underline')\"\n            title=\"Underline\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-underline\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('strikeThrough')\"\n            (click)=\"triggerCommand('strikeThrough')\"\n            title=\"Strikethrough\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-strikethrough\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('superscript')\"\n            (click)=\"triggerCommand('superscript')\"\n            title=\"Superscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-superscript\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('subscript')\"\n            (click)=\"triggerCommand('subscript')\"\n            title=\"Subscript\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-subscript\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontName')\" (click)=\"fontName = ''\"\n            title=\"Font Family\"\n            [popover]=\"fontNameTemplate\" #fontNamePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-font\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('fontSize')\" (click)=\"fontSize = ''\"\n            title=\"Font Size\"\n            [popover]=\"fontSizeTemplate\" #fontSizePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-text-height\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('color')\" (click)=\"hexColor = ''\"\n            title=\"Color Picker\"\n            [popover]=\"insertColorTemplate\" #colorPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-tint\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyLeft')\"\n            (click)=\"triggerCommand('justifyLeft')\"\n            title=\"Justify Left\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyCenter')\"\n            (click)=\"triggerCommand('justifyCenter')\"\n            title=\"Justify Center\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-center\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyRight')\"\n            (click)=\"triggerCommand('justifyRight')\"\n            title=\"Justify Right\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('justifyFull')\"\n            (click)=\"triggerCommand('justifyFull')\"\n            title=\"Justify\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-align-justify\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('indent')\"\n            (click)=\"triggerCommand('indent')\"\n            title=\"Indent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-indent\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('outdent')\"\n            (click)=\"triggerCommand('outdent')\"\n            title=\"Outdent\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-outdent\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('cut')\"\n            (click)=\"triggerCommand('cut')\" title=\"Cut\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-scissors\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('copy')\"\n            (click)=\"triggerCommand('copy')\"\n            title=\"Copy\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-clone\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('delete')\"\n            (click)=\"triggerCommand('delete')\"\n            title=\"Delete\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-trash\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeFormat')\"\n            (click)=\"triggerCommand('removeFormat')\"\n            title=\"Clear Formatting\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-eraser\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('undo')\"\n            (click)=\"triggerCommand('undo')\"\n            title=\"Undo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-undo\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('redo')\"\n            (click)=\"triggerCommand('redo')\"\n            title=\"Redo\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-repeat\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('paragraph')\"\n            (click)=\"triggerCommand('insertParagraph')\"\n            title=\"Paragraph\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-paragraph\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('blockquote')\"\n            (click)=\"triggerCommand('blockquote')\"\n            title=\"Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-quote-left\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('removeBlockquote')\"\n            (click)=\"triggerCommand('removeBlockquote')\"\n            title=\"Remove Blockquote\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-quote-right\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('horizontalLine')\"\n            (click)=\"triggerCommand('insertHorizontalRule')\"\n            title=\"Horizontal Line\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-minus\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unorderedList')\"\n            (click)=\"triggerCommand('insertUnorderedList')\"\n            title=\"Unordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-list-ul\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('orderedList')\"\n            (click)=\"triggerCommand('insertOrderedList')\"\n            title=\"Ordered List\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-list-ol\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('link')\" (click)=\"buildUrlForm()\"\n            [popover]=\"insertLinkTemplate\"\n            title=\"Insert Link\" #urlPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-link\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('unlink')\"\n            (click)=\"triggerCommand('unlink')\"\n            title=\"Unlink\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-chain-broken\" aria-hidden=\"true\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('image')\" (click)=\"buildImageForm()\"\n            title=\"Insert Image\"\n            [popover]=\"insertImageTemplate\" #imagePopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-image\"></i>\n    </button>\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('video')\" (click)=\"buildVideoForm()\"\n            title=\"Insert Video\"\n            [popover]=\"insertVideoTemplate\" #videoPopover=\"bs-popover\" containerClass=\"ngxePopover\"\n            [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-youtube-play\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n  <div class=\"ngx-toolbar-set\">\n    <button type=\"button\" class=\"ngx-editor-button\" *ngIf=\"canEnableToolbarOptions('code')\"\n            (click)=\"triggerCommand('code')\"\n            title=\"View Code\" [disabled]=\"!config['enableToolbar']\">\n      <i class=\"fas fa-code\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n</div>\n\n<!-- URL Popover template -->\n<ng-template #insertLinkTemplate>\n  <div class=\"ngxe-popover extra-gt\">\n    <form [formGroup]=\"urlForm\" (ngSubmit)=\"urlForm.valid && insertLink()\" autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"urlInput\" class=\"small\">URL</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"URLInput\" placeholder=\"URL\" formControlName=\"urlLink\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"urlTextInput\" class=\"small\">Text</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"urlTextInput\" placeholder=\"Text\" formControlName=\"urlText\"\n               required>\n      </div>\n      <div class=\"form-check\">\n        <input type=\"checkbox\" class=\"form-check-input\" id=\"urlNewTab\" formControlName=\"urlNewTab\">\n        <label class=\"form-check-label\" for=\"urlNewTab\">Open in new tab</label>\n      </div>\n      <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- Image Uploader Popover template -->\n<ng-template #insertImageTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: isImageUploader}\" (click)=\"isImageUploader = true\">\n        <i class=\"fas fa-upload\"></i>\n      </button>\n      <button type=\"button\" class=\"btn\" [ngClass]=\"{active: !isImageUploader}\" (click)=\"isImageUploader = false\">\n        <i class=\"fas fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <div *ngIf=\"isImageUploader; else insertImageLink\"></div>\n      <div *ngIf=\"!isImageUploader; else imageUploder\"></div>\n      <ng-template #imageUploder>\n        <div class=\"ngx-insert-img-ph\">\n          <p *ngIf=\"uploadComplete\">Choose Image</p>\n          <p *ngIf=\"!uploadComplete\">\n            <span>Uploading Image</span>\n            <br>\n            <span>{{ updloadPercentage }} %</span>\n          </p>\n          <div class=\"ngxe-img-upl-frm\">\n            <input type=\"file\" (change)=\"onFileChange($event)\" accept=\"image/*\" [disabled]=\"isUploading\"\n                   [style.cursor]=\"isUploading ? 'not-allowed': 'allowed'\">\n          </div>\n        </div>\n      </ng-template>\n      <ng-template #insertImageLink>\n        <form class=\"extra-gt\" [formGroup]=\"imageForm\" (ngSubmit)=\"imageForm.valid && insertImage()\" autocomplete=\"off\">\n          <div class=\"form-group\">\n            <label for=\"imageURLInput\" class=\"small\">URL</label>\n            <input type=\"text\" class=\"form-control-sm\" id=\"imageURLInput\" placeholder=\"URL\" formControlName=\"imageUrl\"\n                   required>\n          </div>\n          <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n        </form>\n      </ng-template>\n      <div class=\"progress\" *ngIf=\"!uploadComplete\">\n        <div class=\"progress-bar progress-bar-striped progress-bar-animated bg-success\"\n             [ngClass]=\"{'bg-danger': updloadPercentage<20, 'bg-warning': updloadPercentage<50, 'bg-success': updloadPercentage>=100}\"\n             [style.width.%]=\"updloadPercentage\"></div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n\n\n<!-- Insert Video Popover template -->\n<ng-template #insertVideoTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar btn-ctnr\">\n      <button type=\"button\" class=\"btn active\">\n        <i class=\"fas fa-link\"></i>\n      </button>\n    </div>\n    <div class=\"imgc-ctnt is-image\">\n      <form class=\"extra-gt\" [formGroup]=\"videoForm\" (ngSubmit)=\"videoForm.valid && insertVideo()\" autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"videoURLInput\" class=\"small\">URL</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"videoURLInput\" placeholder=\"URL\" formControlName=\"videoUrl\"\n                 required>\n        </div>\n        <div class=\"row form-group\">\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"height\" placeholder=\"height (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <div class=\"col\">\n            <input type=\"text\" class=\"form-control-sm\" formControlName=\"width\" placeholder=\"width (px)\"\n                   (keypress)=\"onlyNumbers($event)\">\n          </div>\n          <label class=\"small\">Height/Width</label>\n        </div>\n        <button type=\"submit\" class=\"btn-primary btn-sm btn\">Submit</button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- Insert color template -->\n<ng-template #insertColorTemplate>\n  <div class=\"ngxe-popover imgc-ctnr\">\n    <div class=\"imgc-topbar two-tabs\">\n      <span (click)=\"selectedColorTab ='textColor'\" [ngClass]=\"{active: selectedColorTab ==='textColor'}\">Text</span>\n      <span (click)=\"selectedColorTab ='backgroundColor'\" [ngClass]=\"{active: selectedColorTab ==='backgroundColor'}\">Background</span>\n    </div>\n    <div class=\"imgc-ctnt is-color extra-gt1\">\n      <form autocomplete=\"off\">\n        <div class=\"form-group\">\n          <label for=\"hexInput\" class=\"small\">Hex Color</label>\n          <input type=\"text\" class=\"form-control-sm\" id=\"hexInput\" name=\"hexInput\" maxlength=\"7\" placeholder=\"HEX Color\"\n                 [(ngModel)]=\"hexColor\"\n                 required>\n        </div>\n        <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"insertColor(hexColor, selectedColorTab)\">Submit\n        </button>\n      </form>\n    </div>\n  </div>\n</ng-template>\n\n<!-- font size template -->\n<ng-template #fontSizeTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontSize\" placeholder=\"Font size in px/rem\"\n               [(ngModel)]=\"fontSize\"\n               required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontSize(fontSize)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n\n<!-- font family/name template -->\n<ng-template #fontNameTemplate>\n  <div class=\"ngxe-popover extra-gt1\">\n    <form autocomplete=\"off\">\n      <div class=\"form-group\">\n        <label for=\"fontSize\" class=\"small\">Font Size</label>\n        <input type=\"text\" class=\"form-control-sm\" id=\"fontSize\" name=\"fontName\"\n               placeholder=\"Ex: 'Times New Roman', Times, serif\"\n               [(ngModel)]=\"fontName\" required>\n      </div>\n      <button type=\"button\" class=\"btn-primary btn-sm btn\" (click)=\"setFontName(fontName)\">Submit</button>\n    </form>\n  </div>\n</ng-template>\n",
                    providers: [PopoverConfig],
                    styles: ["::ng-deep .ngxePopover.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}::ng-deep .ngxePopover.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}::ng-deep .ngxePopover.popover .arrow::after,::ng-deep .ngxePopover.popover .arrow::before{position:absolute;display:block;content:\"\";border-color:transparent;border-style:solid}::ng-deep .ngxePopover.popover .popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;color:inherit;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}::ng-deep .ngxePopover.popover .popover-header:empty{display:none}::ng-deep .ngxePopover.popover .popover-body{padding:.5rem .75rem;color:#212529}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top],::ng-deep .ngxePopover.popover.bs-popover-top{margin-bottom:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow,::ng-deep .ngxePopover.popover.bs-popover-top .arrow{bottom:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{border-width:.5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::before{bottom:0;border-top-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=top] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-top .arrow::after{bottom:1px;border-top-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right],::ng-deep .ngxePopover.popover.bs-popover-right{margin-left:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow,::ng-deep .ngxePopover.popover.bs-popover-right .arrow{left:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{border-width:.5rem .5rem .5rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::before{left:0;border-right-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=right] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-right .arrow::after{left:1px;border-right-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom],::ng-deep .ngxePopover.popover.bs-popover-bottom{margin-top:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow{left:45%!important;top:calc((.5rem + 1px) * -1)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{border-width:0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::before{top:0;border-bottom-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-bottom .arrow::after{top:1px;border-bottom-color:#fff}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=bottom] .popover-header::before,::ng-deep .ngxePopover.popover.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:\"\";border-bottom:1px solid #f7f7f7}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left],::ng-deep .ngxePopover.popover.bs-popover-left{margin-right:.5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow,::ng-deep .ngxePopover.popover.bs-popover-left .arrow{right:calc((.5rem + 1px) * -1);width:.5rem;height:1rem;margin:.3rem 0}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{border-width:.5rem 0 .5rem .5rem}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::before,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::before{right:0;border-left-color:rgba(0,0,0,.25)}::ng-deep .ngxePopover.popover.bs-popover-auto[x-placement^=left] .arrow::after,::ng-deep .ngxePopover.popover.bs-popover-left .arrow::after{right:1px;border-left-color:#fff}::ng-deep .ngxePopover .btn{display:inline-block;font-weight:400;text-align:center;white-space:nowrap;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}::ng-deep .ngxePopover .btn.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}::ng-deep .ngxePopover .btn:active,::ng-deep .ngxePopover .btn:focus{outline:0;box-shadow:none}::ng-deep .ngxePopover .btn.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}::ng-deep .ngxePopover .btn.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}::ng-deep .ngxePopover .btn:not(:disabled):not(.disabled){cursor:pointer}::ng-deep .ngxePopover form .form-group{margin-bottom:1rem}::ng-deep .ngxePopover form .form-group input{overflow:visible}::ng-deep .ngxePopover form .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding:.25rem .5rem;font-size:.875rem;line-height:1.5}::ng-deep .ngxePopover form .form-group.row{display:flex;flex-wrap:wrap;margin-left:0;margin-right:0}::ng-deep .ngxePopover form .form-group.row .col{flex-basis:0;flex-grow:1;max-width:100%;padding:0}::ng-deep .ngxePopover form .form-group.row .col:first-child{padding-right:15px}::ng-deep .ngxePopover form .form-check{position:relative;display:block;padding-left:1.25rem}::ng-deep .ngxePopover form .form-check .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.ngx-toolbar{background-color:#f5f5f5;font-size:.8rem;padding:.2rem;border:1px solid #ddd}.ngx-toolbar .ngx-toolbar-set{display:inline-block;border-radius:5px;background-color:#fff}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button{background-color:transparent;padding:.4rem;min-width:2.5rem;float:left;border:1px solid #ddd;border-right:transparent}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button.focus,.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:focus{outline:0}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:last-child{border-right:1px solid #ddd;border-top-right-radius:5px;border-bottom-right-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:first-child{border-top-left-radius:5px;border-bottom-left-radius:5px}.ngx-toolbar .ngx-toolbar-set .ngx-editor-button:disabled{background-color:#f5f5f5;pointer-events:none;cursor:not-allowed}::ng-deep .popover{border-top-right-radius:0;border-top-left-radius:0}::ng-deep .ngxe-popover{min-width:15rem;white-space:nowrap}::ng-deep .ngxe-popover .extra-gt,::ng-deep .ngxe-popover.extra-gt{padding-top:.5rem!important}::ng-deep .ngxe-popover .extra-gt1,::ng-deep .ngxe-popover.extra-gt1{padding-top:.75rem!important}::ng-deep .ngxe-popover .extra-gt2,::ng-deep .ngxe-popover.extra-gt2{padding-top:1rem!important}::ng-deep .ngxe-popover .form-group label{display:none;margin:0}::ng-deep .ngxe-popover .form-group .form-control-sm{width:100%;outline:0;border:none;border-bottom:1px solid #bdbdbd;border-radius:0;margin-bottom:1px;padding-left:0;padding-right:0}::ng-deep .ngxe-popover .form-group .form-control-sm:active,::ng-deep .ngxe-popover .form-group .form-control-sm:focus{border-bottom:2px solid #1e88e5;box-shadow:none;margin-bottom:0}::ng-deep .ngxe-popover .form-group .form-control-sm.ng-dirty.ng-invalid:not(.ng-pristine){border-bottom:2px solid red}::ng-deep .ngxe-popover .form-check{margin-bottom:1rem}::ng-deep .ngxe-popover .btn:focus{box-shadow:none!important}::ng-deep .ngxe-popover.imgc-ctnr{margin:-.5rem -.75rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar{box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 1px 1px rgba(0,0,0,.16);border-bottom:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button{background-color:transparent;border-radius:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button:hover{cursor:pointer;background-color:#f1f1f1;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.btn-ctnr button.active{color:#007bff;transition:.2s}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span{width:50%;text-align:center;display:inline-block;padding:.4rem 0;margin:0 -1px 2px}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span:hover{cursor:pointer}::ng-deep .ngxe-popover.imgc-ctnr .imgc-topbar.two-tabs span.active{margin-bottom:-2px;border-bottom:2px solid #007bff;color:#007bff}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt{padding:.5rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .progress{height:.5rem;margin:.5rem -.5rem -.6rem}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image p{margin:0}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph{border:2px dashed #bdbdbd;padding:1.8rem 0;position:relative;letter-spacing:1px;text-align:center}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph:hover{background:#ebebeb}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm{opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;z-index:2147483640;overflow:hidden;margin:0;padding:0;width:100%}::ng-deep .ngxe-popover.imgc-ctnr .imgc-ctnt.is-image .ngx-insert-img-ph .ngxe-img-upl-frm input{cursor:pointer;position:absolute;right:0;top:0;bottom:0;margin:0}"]
                }] }
    ];
    /** @nocollapse */
    NgxEditorToolbarComponent.ctorParameters = function () { return [
        { type: PopoverConfig },
        { type: FormBuilder },
        { type: MessageService },
        { type: CommandExecutorService }
    ]; };
    NgxEditorToolbarComponent.propDecorators = {
        config: [{ type: Input }],
        urlPopover: [{ type: ViewChild, args: ['urlPopover',] }],
        imagePopover: [{ type: ViewChild, args: ['imagePopover',] }],
        videoPopover: [{ type: ViewChild, args: ['videoPopover',] }],
        fontSizePopover: [{ type: ViewChild, args: ['fontSizePopover',] }],
        colorPopover: [{ type: ViewChild, args: ['colorPopover',] }],
        execute: [{ type: Output }]
    };
    return NgxEditorToolbarComponent;
}());
export { NgxEditorToolbarComponent };
if (false) {
    /**
     * holds values of the insert link form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.urlForm;
    /**
     * holds values of the insert image form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.imageForm;
    /**
     * holds values of the insert video form
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.videoForm;
    /**
     * set to false when image is being uploaded
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.uploadComplete;
    /**
     * upload percentage
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.updloadPercentage;
    /**
     * set to true when the image is being uploaded
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.isUploading;
    /**
     * which tab to active for color insetion
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.selectedColorTab;
    /**
     * font family name
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.fontName;
    /**
     * font size
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.fontSize;
    /**
     * hex color code
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.hexColor;
    /**
     * show/hide image uploader
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.isImageUploader;
    /**
     * Editor configuration
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.config;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.urlPopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.imagePopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.videoPopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.fontSizePopover;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype.colorPopover;
    /**
     * Emits an event when a toolbar button is clicked
     * @type {?}
     */
    NgxEditorToolbarComponent.prototype.execute;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._popOverConfig;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._formBuilder;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._messageService;
    /** @type {?} */
    NgxEditorToolbarComponent.prototype._commandExecutorService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lZGl0b3IvIiwic291cmNlcyI6WyJhcHAvbmd4LWVkaXRvci9uZ3gtZWRpdG9yLXRvb2xiYXIvbmd4LWVkaXRvci10b29sYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBVSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEYsT0FBTyxFQUFDLFdBQVcsRUFBYSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUNuRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDbEUsT0FBTyxLQUFLLEtBQUssTUFBTSxrQ0FBa0MsQ0FBQztBQUUxRDtJQThDRSxtQ0FBb0IsY0FBNkIsRUFDN0IsWUFBeUIsRUFDekIsZUFBK0IsRUFDL0IsdUJBQStDO1FBSC9DLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQ3pCLG9CQUFlLEdBQWYsZUFBZSxDQUFnQjtRQUMvQiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXdCOzs7O1FBakNuRSxtQkFBYyxHQUFHLElBQUksQ0FBQzs7OztRQUV0QixzQkFBaUIsR0FBRyxDQUFDLENBQUM7Ozs7UUFFdEIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7Ozs7UUFFcEIscUJBQWdCLEdBQUcsV0FBVyxDQUFDOzs7O1FBRS9CLGFBQVEsR0FBRyxFQUFFLENBQUM7Ozs7UUFFZCxhQUFRLEdBQUcsRUFBRSxDQUFDOzs7O1FBRWQs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b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsazZpQkFBa0Q7b0JBRWxELFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQzs7aUJBQzNCOzs7O2dCQVZPLGFBQWE7Z0JBRmIsV0FBVztnQkFJWCxjQUFjO2dCQURkLHNCQUFzQjs7O3lCQXVDM0IsS0FBSzs2QkFDTCxTQUFTLFNBQUMsWUFBWTsrQkFDdEIsU0FBUyxTQUFDLGNBQWM7K0JBQ3hCLFNBQVMsU0FBQyxjQUFjO2tDQUN4QixTQUFTLFNBQUMsaUJBQWlCOytCQUMzQixTQUFTLFNBQUMsY0FBYzswQkFJeEIsTUFBTTs7SUEyTlQsZ0NBQUM7Q0FBQSxBQXZRRCxJQXVRQztTQWhRWSx5QkFBeUI7Ozs7OztJQUdwQyw0Q0FBbUI7Ozs7O0lBRW5CLDhDQUFxQjs7Ozs7SUFFckIsOENBQXFCOzs7OztJQUVyQixtREFBc0I7Ozs7O0lBRXRCLHNEQUFzQjs7Ozs7SUFFdEIsZ0RBQW9COzs7OztJQUVwQixxREFBK0I7Ozs7O0lBRS9CLDZDQUFjOzs7OztJQUVkLDZDQUFjOzs7OztJQUVkLDZDQUFjOzs7OztJQUVkLG9EQUF3Qjs7Ozs7SUFLeEIsMkNBQXFCOztJQUNyQiwrQ0FBb0M7O0lBQ3BDLGlEQUF3Qzs7SUFDeEMsaURBQXdDOztJQUN4QyxvREFBOEM7O0lBQzlDLGlEQUF3Qzs7Ozs7SUFJeEMsNENBQXFFOztJQUV6RCxtREFBcUM7O0lBQ3JDLGlEQUFpQzs7SUFDakMsb0RBQXVDOztJQUN2Qyw0REFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7SHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1BvcG92ZXJDb25maWd9IGZyb20gJ25neC1ib290c3RyYXAnO1xuaW1wb3J0IHtDb21tYW5kRXhlY3V0b3JTZXJ2aWNlfSBmcm9tICcuLi9jb21tb24vc2VydmljZXMvY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vY29tbW9uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmd4LWVkaXRvci10b29sYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1lZGl0b3ItdG9vbGJhci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtQb3BvdmVyQ29uZmlnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5neEVkaXRvclRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIC8qKiBob2xkcyB2YWx1ZXMgb2YgdGhlIGluc2VydCBsaW5rIGZvcm0gKi9cbiAgdXJsRm9ybTogRm9ybUdyb3VwO1xuICAvKiogaG9sZHMgdmFsdWVzIG9mIHRoZSBpbnNlcnQgaW1hZ2UgZm9ybSAqL1xuICBpbWFnZUZvcm06IEZvcm1Hcm91cDtcbiAgLyoqIGhvbGRzIHZhbHVlcyBvZiB0aGUgaW5zZXJ0IHZpZGVvIGZvcm0gKi9cbiAgdmlkZW9Gb3JtOiBGb3JtR3JvdXA7XG4gIC8qKiBzZXQgdG8gZmFsc2Ugd2hlbiBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICB1cGxvYWRDb21wbGV0ZSA9IHRydWU7XG4gIC8qKiB1cGxvYWQgcGVyY2VudGFnZSAqL1xuICB1cGRsb2FkUGVyY2VudGFnZSA9IDA7XG4gIC8qKiBzZXQgdG8gdHJ1ZSB3aGVuIHRoZSBpbWFnZSBpcyBiZWluZyB1cGxvYWRlZCAqL1xuICBpc1VwbG9hZGluZyA9IGZhbHNlO1xuICAvKiogd2hpY2ggdGFiIHRvIGFjdGl2ZSBmb3IgY29sb3IgaW5zZXRpb24gKi9cbiAgc2VsZWN0ZWRDb2xvclRhYiA9ICd0ZXh0Q29sb3InO1xuICAvKiogZm9udCBmYW1pbHkgbmFtZSAqL1xuICBmb250TmFtZSA9ICcnO1xuICAvKiogZm9udCBzaXplICovXG4gIGZvbnRTaXplID0gJyc7XG4gIC8qKiBoZXggY29sb3IgY29kZSAqL1xuICBoZXhDb2xvciA9ICcnO1xuICAvKiogc2hvdy9oaWRlIGltYWdlIHVwbG9hZGVyICovXG4gIGlzSW1hZ2VVcGxvYWRlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBFZGl0b3IgY29uZmlndXJhdGlvblxuICAgKi9cbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG4gIEBWaWV3Q2hpbGQoJ3VybFBvcG92ZXInKSB1cmxQb3BvdmVyO1xuICBAVmlld0NoaWxkKCdpbWFnZVBvcG92ZXInKSBpbWFnZVBvcG92ZXI7XG4gIEBWaWV3Q2hpbGQoJ3ZpZGVvUG9wb3ZlcicpIHZpZGVvUG9wb3ZlcjtcbiAgQFZpZXdDaGlsZCgnZm9udFNpemVQb3BvdmVyJykgZm9udFNpemVQb3BvdmVyO1xuICBAVmlld0NoaWxkKCdjb2xvclBvcG92ZXInKSBjb2xvclBvcG92ZXI7XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIGEgdG9vbGJhciBidXR0b24gaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpIGV4ZWN1dGU6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9wT3ZlckNvbmZpZzogUG9wb3ZlckNvbmZpZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF9tZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbW1hbmRFeGVjdXRvclNlcnZpY2U6IENvbW1hbmRFeGVjdXRvclNlcnZpY2UpIHtcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLm91dHNpZGVDbGljayA9IHRydWU7XG4gICAgdGhpcy5fcG9wT3ZlckNvbmZpZy5wbGFjZW1lbnQgPSAnYm90dG9tJztcbiAgICB0aGlzLl9wb3BPdmVyQ29uZmlnLmNvbnRhaW5lciA9ICdib2R5JztcbiAgfVxuXG4gIC8qKlxuICAgKiBlbmFibGUgb3IgZGlhYmxlIHRvb2xiYXIgYmFzZWQgb24gY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgbmFtZSBvZiB0aGUgdG9vbGJhciBidXR0b25zXG4gICAqL1xuICBjYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlscy5jYW5FbmFibGVUb29sYmFyT3B0aW9ucyh2YWx1ZSwgdGhpcy5jb25maWdbJ3Rvb2xiYXInXSk7XG4gIH1cblxuICAvKipcbiAgICogdHJpZ2dlcnMgY29tbWFuZCBmcm9tIHRoZSB0b29sYmFyIHRvIGJlIGV4ZWN1dGVkIGFuZCBlbWl0cyBhbiBldmVudFxuICAgKlxuICAgKiBAcGFyYW0gY29tbWFuZCBuYW1lIG9mIHRoZSBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXG4gICAqL1xuICB0cmlnZ2VyQ29tbWFuZChjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmV4ZWN1dGUuZW1pdChjb21tYW5kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgVVJMIGluc2VydCBmb3JtXG4gICAqL1xuICBidWlsZFVybEZvcm0oKTogdm9pZCB7XG5cbiAgICB0aGlzLnVybEZvcm0gPSB0aGlzLl9mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1cmxMaW5rOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxUZXh0OiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICB1cmxOZXdUYWI6IFt0cnVlXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqL1xuICBpbnNlcnRMaW5rKCk6IHZvaWQge1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuY3JlYXRlTGluayh0aGlzLnVybEZvcm0udmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZFVybEZvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudXJsUG9wb3Zlci5oaWRlKCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGluc2VydCBpbWFnZSBmb3JtXG4gICAqL1xuICBidWlsZEltYWdlRm9ybSgpOiB2b2lkIHtcblxuICAgIHRoaXMuaW1hZ2VGb3JtID0gdGhpcy5fZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgaW1hZ2VVcmw6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBpbnNlcnQgaW1hZ2UgZm9ybVxuICAgKi9cbiAgYnVpbGRWaWRlb0Zvcm0oKTogdm9pZCB7XG5cbiAgICB0aGlzLnZpZGVvRm9ybSA9IHRoaXMuX2Zvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHZpZGVvVXJsOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkXV0sXG4gICAgICBoZWlnaHQ6IFsnJ10sXG4gICAgICB3aWR0aDogWycnXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVkIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxuICAgKlxuICAgKiBAcGFyYW0gZSBvbkNoYW5nZSBldmVudFxuICAgKi9cbiAgb25GaWxlQ2hhbmdlKGUpOiB2b2lkIHtcblxuICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblxuICAgIGlmIChlLnRhcmdldC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UudXBsb2FkSW1hZ2UoZmlsZSwgdGhpcy5jb25maWcuaW1hZ2VFbmRQb2ludCwgdGhpcy5jb25maWcuaGVhZGVycykuc3Vic2NyaWJlKGV2ZW50ID0+IHtcblxuICAgICAgICAgIGlmIChldmVudC50eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGxvYWRQZXJjZW50YWdlID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcucmVzcG9uc2VFbmRQb2ludCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5jb25maWcucmVzcG9uc2VFbmRQb2ludCArIGV2ZW50LmJvZHkudXJsKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydEltYWdlKGV2ZW50LmJvZHkudXJsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKiogaW5zZXJ0IGltYWdlIGluIHRoZSBlZGl0b3IgKi9cbiAgaW5zZXJ0SW1hZ2UoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0SW1hZ2UodGhpcy5pbWFnZUZvcm0udmFsdWUuaW1hZ2VVcmwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKiogcmVzZXQgZm9ybSB0byBkZWZhdWx0ICovXG4gICAgdGhpcy5idWlsZEltYWdlRm9ybSgpO1xuICAgIC8qKiBjbG9zZSBpbnNldCBVUkwgcG9wIHVwICovXG4gICAgdGhpcy5pbWFnZVBvcG92ZXIuaGlkZSgpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqIGluc2VydCBpbWFnZSBpbiB0aGUgZWRpdG9yICovXG4gIGluc2VydFZpZGVvKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLmluc2VydFZpZGVvKHRoaXMudmlkZW9Gb3JtLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqIHJlc2V0IGZvcm0gdG8gZGVmYXVsdCAqL1xuICAgIHRoaXMuYnVpbGRWaWRlb0Zvcm0oKTtcbiAgICAvKiogY2xvc2UgaW5zZXQgVVJMIHBvcCB1cCAqL1xuICAgIHRoaXMudmlkZW9Qb3BvdmVyLmhpZGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBpbnNlciB0ZXh0L2JhY2tncm91bmQgY29sb3IgKi9cbiAgaW5zZXJ0Q29sb3IoY29sb3I6IHN0cmluZywgd2hlcmU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2NvbW1hbmRFeGVjdXRvclNlcnZpY2UuaW5zZXJ0Q29sb3IoY29sb3IsIHdoZXJlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvclBvcG92ZXIuaGlkZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBzZXQgZm9udCBzaXplICovXG4gIHNldEZvbnRTaXplKGZvbnRTaXplOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jb21tYW5kRXhlY3V0b3JTZXJ2aWNlLnNldEZvbnRTaXplKGZvbnRTaXplKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5fbWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2UoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5mb250U2l6ZVBvcG92ZXIuaGlkZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKiBzZXQgZm9udCBOYW1lL2ZhbWlseSAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY29tbWFuZEV4ZWN1dG9yU2VydmljZS5zZXRGb250TmFtZShmb250TmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuX21lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHRoaXMuZm9udFNpemVQb3BvdmVyLmhpZGUoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogYWxsb3cgb25seSBudW1iZXJzXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBrZXlwcmVzcyBldmVudFxuICAgKi9cbiAgb25seU51bWJlcnMoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZXZlbnQuY2hhckNvZGUgPj0gNDggJiYgZXZlbnQuY2hhckNvZGUgPD0gNTc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmJ1aWxkVXJsRm9ybSgpO1xuICAgIHRoaXMuYnVpbGRJbWFnZUZvcm0oKTtcbiAgICB0aGlzLmJ1aWxkVmlkZW9Gb3JtKCk7XG4gIH1cblxufVxuIl19