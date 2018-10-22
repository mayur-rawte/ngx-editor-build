/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import * as Utils from '../utils/ngx-editor.utils';
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
                var restored = Utils.restoreSelection(this.savedSelection);
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
                var restored = Utils.restoreSelection(this.savedSelection);
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
            var requestHeader = new HttpHeaders();
            /** @type {?} */
            var headerKeys = Object.keys(headers);
            try {
                for (var headerKeys_1 = tslib_1.__values(headerKeys), headerKeys_1_1 = headerKeys_1.next(); !headerKeys_1_1.done; headerKeys_1_1 = headerKeys_1.next()) {
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
            /** @type {?} */
            var req = new HttpRequest('POST', endPoint, formData, {
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
                    var restored = Utils.restoreSelection(this.savedSelection);
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
                var restored = Utils.restoreSelection(this.savedSelection);
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
            var restored = Utils.restoreSelection(this.savedSelection);
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
                var restored = Utils.restoreSelection(this.savedSelection);
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
                var restored = Utils.restoreSelection(this.savedSelection);
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
        { type: Injectable }
    ];
    /** @nocollapse */
    CommandExecutorService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return CommandExecutorService;
}());
export { CommandExecutorService };
if (false) {
    /**
     * saves the selection from the editor when focussed out
     * @type {?}
     */
    CommandExecutorService.prototype.savedSelection;
    /** @type {?} */
    CommandExecutorService.prototype._http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFFLE9BQU8sS0FBSyxLQUFLLE1BQU0sMkJBQTJCLENBQUM7QUFFbkQ7SUFNRTs7O09BR0c7SUFDSCxnQ0FBb0IsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTs7OztRQU5yQyxtQkFBYyxHQUFRLFNBQVMsQ0FBQztJQU9oQyxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILHdDQUFPOzs7Ozs7SUFBUCxVQUFRLE9BQWU7UUFFckIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO1lBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksT0FBTyxLQUFLLHNCQUFzQixFQUFFO1lBQ3RDLFFBQVEsQ0FBQyxXQUFXLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNELE9BQU87U0FDUjtRQUVELElBQUksT0FBTyxLQUFLLFlBQVksRUFBRTtZQUM1QixRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDekQsT0FBTztTQUNSO1FBRUQsSUFBSSxPQUFPLEtBQUssa0JBQWtCLEVBQUU7WUFDbEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xE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QUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtRQUVsRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUN0QztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSyx5REFBd0I7Ozs7OztJQUFoQyxVQUFpQyxHQUFXO1FBQzFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksa0JBQWtCLENBQUMsQ0FBQztJQUN0RSxDQUFDOztnQkF6VUYsVUFBVTs7OztnQkFISCxVQUFVOztJQThVbEIsNkJBQUM7Q0FBQSxBQTNVRCxJQTJVQztTQTFVWSxzQkFBc0I7Ozs7OztJQUdqQyxnREFBZ0M7O0lBTXBCLHVDQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBSZXF1ZXN0LCBIdHRwSGVhZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vdXRpbHMvbmd4LWVkaXRvci51dGlscyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21tYW5kRXhlY3V0b3JTZXJ2aWNlIHtcblxuICAvKiogc2F2ZXMgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBlZGl0b3Igd2hlbiBmb2N1c3NlZCBvdXQgKi9cbiAgc2F2ZWRTZWxlY3Rpb246IGFueSA9IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIF9odHRwIEhUVFAgQ2xpZW50IGZvciBtYWtpbmcgaHR0cCByZXF1ZXN0c1xuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cENsaWVudCkge1xuICB9XG5cbiAgLyoqXG4gICAqIGV4ZWN1dGVzIGNvbW1hbmQgZnJvbSB0aGUgdG9vbGJhclxuICAgKlxuICAgKiBAcGFyYW0gY29tbWFuZCBjb21tYW5kIHRvIGJlIGV4ZWN1dGVkXG4gICAqL1xuICBleGVjdXRlKGNvbW1hbmQ6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKCF0aGlzLnNhdmVkU2VsZWN0aW9uICYmIGNvbW1hbmQgIT09ICdlbmFibGVPYmplY3RSZXNpemluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIEVkaXRvcicpO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZW5hYmxlT2JqZWN0UmVzaXppbmcnLCB0cnVlLCAndHJ1ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAnYmxvY2txdW90ZScpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnYmxvY2txdW90ZScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb21tYW5kID09PSAncmVtb3ZlQmxvY2txdW90ZScpIHtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdmb3JtYXRCbG9jaycsIGZhbHNlLCAnZGl2Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoY29tbWFuZCwgZmFsc2UsIG51bGwpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbnNlcnRzIGltYWdlIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIGltYWdlVVJJIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAgICovXG4gIGluc2VydEltYWdlKGltYWdlVVJJOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKGltYWdlVVJJKSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgY29uc3QgaW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SW1hZ2UnLCBmYWxzZSwgaW1hZ2VVUkkpO1xuICAgICAgICAgIGlmICghaW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBVUkwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSB2aWRlUGFyYW1zIHVybCBvZiB0aGUgaW1hZ2UgdG8gYmUgaW5zZXJ0ZWRcbiAgICovXG4gIGluc2VydFZpZGVvKHZpZGVQYXJhbXM6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBpZiAodmlkZVBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzWW91dHViZUxpbmsodmlkZVBhcmFtcy52aWRlb1VybCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHlvdXR1YmVVUkwgPSAnPGlmcmFtZSB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgKyAnc3JjPVwiJyArIHZpZGVQYXJhbXMudmlkZW9VcmwgKyAnXCI+PC9pZnJhbWU+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh5b3V0dWJlVVJMKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2hlY2tUYWdTdXBwb3J0SW5Ccm93c2VyKCd2aWRlbycpKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWRVUkwodmlkZVBhcmFtcy52aWRlb1VybCkpIHtcbiAgICAgICAgICAgICAgY29uc3QgdmlkZW9TcmMgPSAnPHZpZGVvIHdpZHRoPVwiJyArIHZpZGVQYXJhbXMud2lkdGggKyAnXCIgaGVpZ2h0PVwiJyArIHZpZGVQYXJhbXMuaGVpZ2h0ICsgJ1wiJ1xuICAgICAgICAgICAgICAgICsgJyBjb250cm9scz1cInRydWVcIj48c291cmNlIHNyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvdmlkZW8+JztcbiAgICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKHZpZGVvU3JjKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2aWRlbyBVUkwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBpbnNlcnQgdmlkZW8nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogY2hlY2tzIHRoZSBpbnB1dCB1cmwgaXMgYSB2YWxpZCB5b3V0dWJlIFVSTCBvciBub3RcbiAgICpcbiAgICogQHBhcmFtIHVybCBZb3V0dWUgVVJMXG4gICAqL1xuICBwcml2YXRlIGlzWW91dHViZUxpbmsodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCB5dFJlZ0V4cCA9IC9eKGh0dHAocyk/OlxcL1xcLyk/KCh3KXszfS4pP3lvdXR1KGJlfC5iZSk/KFxcLmNvbSk/XFwvLisvO1xuICAgIHJldHVybiB5dFJlZ0V4cC50ZXN0KHVybCk7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgd2hldGhlciB0aGUgc3RyaW5nIGlzIGEgdmFsaWQgdXJsIG9yIG5vdFxuICAgKiBAcGFyYW0gdXJsIHVybFxuICAgKi9cbiAgcHJpdmF0ZSBpc1ZhbGlkVVJMKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXJsUmVnRXhwID0gLyhodHRwfGh0dHBzKTpcXC9cXC8oXFx3Kzp7MCwxfVxcdyopPyhcXFMrKSg6WzAtOV0rKT8oXFwvfFxcLyhbXFx3IyE6Lj8rPSYlIVxcLVxcL10pKT8vO1xuICAgIHJldHVybiB1cmxSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwbG9hZHMgaW1hZ2UgdG8gdGhlIHNlcnZlclxuICAgKlxuICAgKiBAcGFyYW0gZmlsZSBmaWxlIHRoYXQgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqIEBwYXJhbSBlbmRQb2ludCBlbnBvaW50IHRvIHdoaWNoIHRoZSBpbWFnZSBoYXMgdG8gYmUgdXBsb2FkZWRcbiAgICovXG4gIHVwbG9hZEltYWdlKGZpbGU6IEZpbGUsIGVuZFBvaW50OiBzdHJpbmcsIGhlYWRlcnM/OiBhbnkpOiBhbnkge1xuXG4gICAgaWYgKCFlbmRQb2ludCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbWFnZSBFbmRwb2ludCBpc25gdCBwcm92aWRlZCBvciBpbnZhbGlkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBpZiAoZmlsZSkge1xuXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcblxuICAgICAgbGV0IHJlcXVlc3RIZWFkZXIgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICAgIGNvbnN0IGhlYWRlcktleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKTtcbiAgICAgIGZvciAoY29uc3QgaGVhZGVyS2V5IG9mIGhlYWRlcktleXMpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlciA9IHJlcXVlc3RIZWFkZXIuc2V0KGhlYWRlcktleSwgaGVhZGVyc1toZWFkZXJLZXldKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlcSA9IG5ldyBIdHRwUmVxdWVzdCgnUE9TVCcsIGVuZFBvaW50LCBmb3JtRGF0YSwge1xuICAgICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczogcmVxdWVzdEhlYWRlclxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9odHRwLnJlcXVlc3QocmVxKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSW1hZ2UnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBsaW5rIGluIHRoZSBlZGl0b3JcbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyBwYXJhbWV0ZXJzIHRoYXQgaG9sZHMgdGhlIGluZm9ybWF0aW9uIGZvciB0aGUgbGlua1xuICAgKi9cbiAgY3JlYXRlTGluayhwYXJhbXM6IGFueSk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIC8qKlxuICAgICAgICogY2hlY2sgd2hldGhlciB0aGUgc2F2ZWQgc2VsZWN0aW9uIGNvbnRhaW5zIGEgcmFuZ2Ugb3IgcGxhaW4gc2VsZWN0aW9uXG4gICAgICAgKi9cbiAgICAgIGlmIChwYXJhbXMudXJsTmV3VGFiKSB7XG4gICAgICAgIGNvbnN0IG5ld1VybCA9ICc8YSBocmVmPVwiJyArIHBhcmFtcy51cmxMaW5rICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBwYXJhbXMudXJsVGV4dCArICc8L2E+JztcblxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkudHlwZSAhPT0gJ1JhbmdlJykge1xuICAgICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChuZXdVcmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgbmV3IGxpbmtzIGNhbiBiZSBpbnNlcnRlZC4gWW91IGNhbm5vdCBlZGl0IFVSTGBzJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NyZWF0ZUxpbmsnLCBmYWxzZSwgcGFyYW1zLnVybExpbmspO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0IGNvbG9yIGVpdGhlciBmb250IG9yIGJhY2tncm91bmRcbiAgICpcbiAgICogQHBhcmFtIGNvbG9yIGNvbG9yIHRvIGJlIGluc2VydGVkXG4gICAqIEBwYXJhbSB3aGVyZSB3aGVyZSB0aGUgY29sb3IgaGFzIHRvIGJlIGluc2VydGVkIGVpdGhlciB0ZXh0L2JhY2tncm91bmRcbiAgICovXG4gIGluc2VydENvbG9yKGNvbG9yOiBzdHJpbmcsIHdoZXJlOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICBpZiAocmVzdG9yZWQgJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICAgIGlmICh3aGVyZSA9PT0gJ3RleHRDb2xvcicpIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9yZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnaGlsaXRlQ29sb3InLCBmYWxzZSwgY29sb3IpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBzaXplIGZvciB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSBmb250U2l6ZSBmb250LXNpemUgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250U2l6ZShmb250U2l6ZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250U2l6ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJ3B4O1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udFB4KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZm9udFB4ID0gJzxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAnICsgZm9udFNpemUgKyAnO1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udFB4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCBmb250IG5hbWUvZmFtaWx5IGZvciB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSBmb250TmFtZSBmb250LWZhbWlseSB0byBiZSBzZXRcbiAgICovXG4gIHNldEZvbnROYW1lKGZvbnROYW1lOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgY29uc3QgZGVsZXRlZFZhbHVlID0gdGhpcy5kZWxldGVBbmRHZXRFbGVtZW50KCk7XG5cbiAgICAgIGlmIChkZWxldGVkVmFsdWUpIHtcblxuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmljKGZvbnROYW1lKSkge1xuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9ICc8c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnICsgZm9udE5hbWUgKyAncHg7XCI+JyArIGRlbGV0ZWRWYWx1ZSArICc8L3NwYW4+JztcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbChmb250RmFtaWx5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZm9udEZhbWlseSA9ICc8c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OiAnICsgZm9udE5hbWUgKyAnO1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBpbnNlcnQgSFRNTCAqL1xuICBwcml2YXRlIGluc2VydEh0bWwoaHRtbDogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBjb25zdCBpc0hUTUxJbnNlcnRlZCA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRIVE1MJywgZmFsc2UsIGh0bWwpO1xuXG4gICAgaWYgKCFpc0hUTUxJbnNlcnRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcGVyZm9ybSB0aGUgb3BlcmF0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHZhbHVlIGlzIGEgbnVtYmVyIG9yIHN0cmluZ1xuICAgKiBpZiBudW1iZXIgcmV0dXJuIHRydWVcbiAgICogZWxzZSByZXR1cm4gZmFsc2VcbiAgICovXG4gIHByaXZhdGUgaXNOdW1lcmljKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gL14tezAsMX1cXGQrJC8udGVzdCh2YWx1ZSk7XG4gIH1cblxuICAvKiogZGVsZXRlIHRoZSB0ZXh0IGF0IHNlbGVjdGVkIHJhbmdlIGFuZCByZXR1cm4gdGhlIHZhbHVlICovXG4gIHByaXZhdGUgZGVsZXRlQW5kR2V0RWxlbWVudCgpOiBhbnkge1xuXG4gICAgbGV0IHNsZWN0ZWRUZXh0O1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIHNsZWN0ZWRUZXh0ID0gdGhpcy5zYXZlZFNlbGVjdGlvbi50b1N0cmluZygpO1xuICAgICAgdGhpcy5zYXZlZFNlbGVjdGlvbi5kZWxldGVDb250ZW50cygpO1xuICAgICAgcmV0dXJuIHNsZWN0ZWRUZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcblxuICB9XG5cbiAgLyoqIGNoZWNrIGFueSBzbGVjdGlvbiBpcyBtYWRlIG9yIG5vdCAqL1xuICBwcml2YXRlIGNoZWNrU2VsZWN0aW9uKCk6IGFueSB7XG5cbiAgICBjb25zdCBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcblxuICAgIGlmIChzbGVjdGVkVGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gU2VsZWN0aW9uIE1hZGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB0YWcgaXMgc3VwcG9ydGVkIGJ5IGJyb3dzZXIgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB0YWcgSFRNTCB0YWdcbiAgICovXG4gIHByaXZhdGUgY2hlY2tUYWdTdXBwb3J0SW5Ccm93c2VyKHRhZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpIGluc3RhbmNlb2YgSFRNTFVua25vd25FbGVtZW50KTtcbiAgfVxuXG59XG4iXX0=