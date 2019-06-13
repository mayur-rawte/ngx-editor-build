import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import * as Utils from '../utils/ngx-editor.utils';
let CommandExecutorService = class CommandExecutorService {
    /**
     *
     * @param _http HTTP Client for making http requests
     */
    constructor(_http) {
        this._http = _http;
        /** saves the selection from the editor when focussed out */
        this.savedSelection = undefined;
    }
    /**
     * executes command from the toolbar
     *
     * @param command command to be executed
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
     * @param imageURI url of the image to be inserted
     */
    insertImage(imageURI) {
        if (this.savedSelection) {
            if (imageURI) {
                const restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
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
     * @param videParams url of the image to be inserted
     */
    insertVideo(videParams) {
        if (this.savedSelection) {
            if (videParams) {
                const restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isYoutubeLink(videParams.videoUrl)) {
                        const youtubeURL = '<iframe width="' + videParams.width + '" height="' + videParams.height + '"'
                            + 'src="' + videParams.videoUrl + '"></iframe>';
                        this.insertHtml(youtubeURL);
                    }
                    else if (this.checkTagSupportInBrowser('video')) {
                        if (this.isValidURL(videParams.videoUrl)) {
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
     * @param url Youtue URL
     */
    isYoutubeLink(url) {
        const ytRegExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
        return ytRegExp.test(url);
    }
    /**
     * check whether the string is a valid url or not
     * @param url url
     */
    isValidURL(url) {
        const urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return urlRegExp.test(url);
    }
    /**
     * uploads image to the server
     *
     * @param file file that has to be uploaded
     * @param endPoint enpoint to which the image has to be uploaded
     */
    uploadImage(file, endPoint, headers) {
        if (!endPoint) {
            throw new Error('Image Endpoint isn`t provided or invalid');
        }
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            let requestHeader = new HttpHeaders();
            const headerKeys = Object.keys(headers);
            for (const headerKey of headerKeys) {
                requestHeader = requestHeader.set(headerKey, headers[headerKey]);
            }
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
     * @param params parameters that holds the information for the link
     */
    createLink(params) {
        if (this.savedSelection) {
            /**
             * check whether the saved selection contains a range or plain selection
             */
            if (params.urlNewTab) {
                const newUrl = '<a href="' + params.urlLink + '" target="_blank">' + params.urlText + '</a>';
                if (document.getSelection().type !== 'Range') {
                    const restored = Utils.restoreSelection(this.savedSelection);
                    if (restored) {
                        this.insertHtml(newUrl);
                    }
                }
                else {
                    throw new Error('Only new links can be inserted. You cannot edit URL`s');
                }
            }
            else {
                const restored = Utils.restoreSelection(this.savedSelection);
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
     * @param color color to be inserted
     * @param where where the color has to be inserted either text/background
     */
    insertColor(color, where) {
        if (this.savedSelection) {
            const restored = Utils.restoreSelection(this.savedSelection);
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
     * @param fontSize font-size to be set
     */
    setFontSize(fontSize) {
        if (this.savedSelection && this.checkSelection()) {
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                const restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontSize)) {
                        const fontPx = '<span style="font-size: ' + fontSize + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontPx);
                    }
                    else {
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
     * @param fontName font-family to be set
     */
    setFontName(fontName) {
        if (this.savedSelection && this.checkSelection()) {
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                const restored = Utils.restoreSelection(this.savedSelection);
                if (restored) {
                    if (this.isNumeric(fontName)) {
                        const fontFamily = '<span style="font-family: ' + fontName + 'px;">' + deletedValue + '</span>';
                        this.insertHtml(fontFamily);
                    }
                    else {
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
    /** insert HTML */
    insertHtml(html) {
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
     */
    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value);
    }
    /** delete the text at selected range and return the value */
    deleteAndGetElement() {
        let slectedText;
        if (this.savedSelection) {
            slectedText = this.savedSelection.toString();
            this.savedSelection.deleteContents();
            return slectedText;
        }
        return false;
    }
    /** check any slection is made or not */
    checkSelection() {
        const slectedText = this.savedSelection.toString();
        if (slectedText.length === 0) {
            throw new Error('No Selection Made');
        }
        return true;
    }
    /**
     * check tag is supported by browser or not
     *
     * @param tag HTML tag
     */
    checkTagSupportInBrowser(tag) {
        return !(document.createElement(tag) instanceof HTMLUnknownElement);
    }
};
CommandExecutorService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], CommandExecutorService);
export { CommandExecutorService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxLQUFLLEtBQUssTUFBTSwyQkFBMkIsQ0FBQztBQUduRCxJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFzQjtJQUtqQzs7O09BR0c7SUFDSCxZQUFvQixLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBUHJDLDREQUE0RDtRQUM1RCxtQkFBYyxHQUFRLFNBQVMsQ0FBQztJQU9oQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxPQUFlO1FBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLE9BQU8sS0FBSyxzQkFBc0IsRUFBRTtZQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLE9BQU8sS0FBSyxzQkFBc0IsRUFBRTtZQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzRCxPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sS0FBSyxZQUFZLEVBQUU7WUFDNUIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3pELE9BQU87U0FDUjtRQUVELElBQUksT0FBTyxLQUFLLGtCQUFrQixFQUFFO1lBQ2xDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxL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RSxDQUFDO1FBRW5ELElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLHdCQUF3QixDQUFDLEdBQVc7UUFDMUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Q0FFRixDQUFBO0FBMVVZLHNCQUFzQjtJQURsQyxVQUFVLEVBQUU7NkNBVWdCLFVBQVU7R0FUMUIsc0JBQXNCLENBMFVsQztTQTFVWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB7XG5cbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXG4gIHNhdmVkU2VsZWN0aW9uOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBfaHR0cCBIVFRQIENsaWVudCBmb3IgbWFraW5nIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHBDbGllbnQpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBleGVjdXRlcyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICghdGhpcy5zYXZlZFNlbGVjdGlvbiAmJiBjb21tYW5kICE9PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiBFZGl0b3InKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2VuYWJsZU9iamVjdFJlc2l6aW5nJykge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJywgdHJ1ZSwgJ3RydWUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2Jsb2NrcXVvdGUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ3JlbW92ZUJsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQsIGZhbHNlLCBudWxsKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVVSSSB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRJbWFnZShpbWFnZVVSSTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIGlmIChpbWFnZVVSSSkge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGNvbnN0IGluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEltYWdlJywgZmFsc2UsIGltYWdlVVJJKTtcbiAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVVJMJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmlkZVBhcmFtcyB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKHZpZGVQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1lvdXR1YmVMaW5rKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICsgJ3NyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoeW91dHViZVVSTCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkVVJMKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgICArICcgY29udHJvbHM9XCJ0cnVlXCI+PHNvdXJjZSBzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L3ZpZGVvPic7XG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh2aWRlb1NyYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmlkZW8gVVJMJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gaW5zZXJ0IHZpZGVvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyB0aGUgaW5wdXQgdXJsIGlzIGEgdmFsaWQgeW91dHViZSBVUkwgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBpc1lvdXR1YmVMaW5rKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcbiAgICByZXR1cm4geXRSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBpcyBhIHZhbGlkIHVybCBvciBub3RcbiAgICogQHBhcmFtIHVybCB1cmxcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZFVSTCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcbiAgICByZXR1cm4gdXJsUmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGxvYWRzIGltYWdlIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHBhcmFtIGZpbGUgZmlsZSB0aGF0IGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKiBAcGFyYW0gZW5kUG9pbnQgZW5wb2ludCB0byB3aGljaCB0aGUgaW1hZ2UgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqL1xuICB1cGxvYWRJbWFnZShmaWxlOiBGaWxlLCBlbmRQb2ludDogc3RyaW5nLCBoZWFkZXJzPzogYW55KTogYW55IHtcblxuICAgIGlmICghZW5kUG9pbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgRW5kcG9pbnQgaXNuYHQgcHJvdmlkZWQgb3IgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgaWYgKGZpbGUpIHtcblxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cbiAgICAgIGxldCByZXF1ZXN0SGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgICBjb25zdCBoZWFkZXJLZXlzID0gT2JqZWN0LmtleXMoaGVhZGVycyk7XG4gICAgICBmb3IgKGNvbnN0IGhlYWRlcktleSBvZiBoZWFkZXJLZXlzKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXIgPSByZXF1ZXN0SGVhZGVyLnNldChoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBlbmRQb2ludCwgZm9ybURhdGEsIHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHJlcXVlc3RIZWFkZXJcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgcGFyYW1ldGVycyB0aGF0IGhvbGRzIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpbmtcbiAgICovXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGNoZWNrIHdoZXRoZXIgdGhlIHNhdmVkIHNlbGVjdGlvbiBjb250YWlucyBhIHJhbmdlIG9yIHBsYWluIHNlbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xuICAgICAgICBjb25zdCBuZXdVcmwgPSAnPGEgaHJlZj1cIicgKyBwYXJhbXMudXJsTGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgcGFyYW1zLnVybFRleHQgKyAnPC9hPic7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcbiAgICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjcmVhdGVMaW5rJywgZmFsc2UsIHBhcmFtcy51cmxMaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydCBjb2xvciBlaXRoZXIgZm9udCBvciBiYWNrZ3JvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjb2xvciBjb2xvciB0byBiZSBpbnNlcnRlZFxuICAgKiBAcGFyYW0gd2hlcmUgd2hlcmUgdGhlIGNvbG9yIGhhcyB0byBiZSBpbnNlcnRlZCBlaXRoZXIgdGV4dC9iYWNrZ3JvdW5kXG4gICAqL1xuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgaWYgKHJlc3RvcmVkICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgICBpZiAod2hlcmUgPT09ICd0ZXh0Q29sb3InKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2hpbGl0ZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogc2V0IGZvbnQgc2l6ZSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udFNpemUgZm9udC1zaXplIHRvIGJlIHNldFxuICAgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udFNpemUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBuYW1lL2ZhbWlseSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udE5hbWUgZm9udC1mYW1pbHkgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJ3B4O1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IEhUTUwgKi9cbiAgcHJpdmF0ZSBpbnNlcnRIdG1sKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgaXNIVE1MSW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBodG1sKTtcblxuICAgIGlmICghaXNIVE1MSW5zZXJ0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvbicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBhIG51bWJlciBvciBzdHJpbmdcbiAgICogaWYgbnVtYmVyIHJldHVybiB0cnVlXG4gICAqIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAqL1xuICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9eLXswLDF9XFxkKyQvLnRlc3QodmFsdWUpO1xuICB9XG5cbiAgLyoqIGRlbGV0ZSB0aGUgdGV4dCBhdCBzZWxlY3RlZCByYW5nZSBhbmQgcmV0dXJuIHRoZSB2YWx1ZSAqL1xuICBwcml2YXRlIGRlbGV0ZUFuZEdldEVsZW1lbnQoKTogYW55IHtcblxuICAgIGxldCBzbGVjdGVkVGV4dDtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuc2F2ZWRTZWxlY3Rpb24uZGVsZXRlQ29udGVudHMoKTtcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfVxuXG4gIC8qKiBjaGVjayBhbnkgc2xlY3Rpb24gaXMgbWFkZSBvciBub3QgKi9cbiAgcHJpdmF0ZSBjaGVja1NlbGVjdGlvbigpOiBhbnkge1xuXG4gICAgY29uc3Qgc2xlY3RlZFRleHQgPSB0aGlzLnNhdmVkU2VsZWN0aW9uLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoc2xlY3RlZFRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFNlbGVjdGlvbiBNYWRlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgdGFnIGlzIHN1cHBvcnRlZCBieSBicm93c2VyIG9yIG5vdFxuICAgKlxuICAgKiBAcGFyYW0gdGFnIEhUTUwgdGFnXG4gICAqL1xuICBwcml2YXRlIGNoZWNrVGFnU3VwcG9ydEluQnJvd3Nlcih0YWc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKSBpbnN0YW5jZW9mIEhUTUxVbmtub3duRWxlbWVudCk7XG4gIH1cblxufVxuIl19