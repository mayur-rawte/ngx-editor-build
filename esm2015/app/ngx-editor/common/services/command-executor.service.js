/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import * as Utils from '../utils/ngx-editor.utils';
export class CommandExecutorService {
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
                const restored = Utils.restoreSelection(this.savedSelection);
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
                const restored = Utils.restoreSelection(this.savedSelection);
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
                /** @type {?} */
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
     * @param {?} color color to be inserted
     * @param {?} where where the color has to be inserted either text/background
     * @return {?}
     */
    insertColor(color, where) {
        if (this.savedSelection) {
            /** @type {?} */
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
     * @param {?} fontSize font-size to be set
     * @return {?}
     */
    setFontSize(fontSize) {
        if (this.savedSelection && this.checkSelection()) {
            /** @type {?} */
            const deletedValue = this.deleteAndGetElement();
            if (deletedValue) {
                /** @type {?} */
                const restored = Utils.restoreSelection(this.savedSelection);
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
                const restored = Utils.restoreSelection(this.savedSelection);
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
if (false) {
    /**
     * saves the selection from the editor when focussed out
     * @type {?}
     */
    CommandExecutorService.prototype.savedSelection;
    /** @type {?} */
    CommandExecutorService.prototype._http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1leGVjdXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVkaXRvci8iLCJzb3VyY2VzIjpbImFwcC9uZ3gtZWRpdG9yL2NvbW1vbi9zZXJ2aWNlcy9jb21tYW5kLWV4ZWN1dG9yLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxLQUFLLEtBQUssTUFBTSwyQkFBMkIsQ0FBQztBQUduRCxNQUFNLE9BQU8sc0JBQXNCOzs7OztJQVNqQyxZQUFvQixLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZOzs7O1FBTnJDLG1CQUFjLEdBQVEsU0FBUyxDQUFDO0lBT2hDLENBQUM7Ozs7Ozs7SUFPRCxPQUFPLENBQUMsT0FBZTtRQUVyQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxPQUFPLEtBQUssc0JBQXNCLEVBQUU7WUFDOUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxPQUFPLEtBQUssc0JBQXNCLEVBQUU7WUFDdEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0QsT0FBTztTQUNSO1FBRUQsSUFBSSxPQUFPLEtBQUssWUFBWSxFQUFFO1lBQzVCLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN6RCxPQUFPO1NBQ1I7UUFFRCxJQUFJLE9BQU8sS0FBSyxrQkFBa0IsRUFBRTtZQUNsQyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsT0FBTztTQUNSO1FBRUQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLE9BQU87SUFDVCxDQUFDOzs7Ozs7O0lBT0QsV0FBVyxDQUFDLFFBQWdCO1FBQzFCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLFFBQVEsRUFBRTs7c0JBQ04sUUFBUSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUM1RCxJQUFJLFFBQVEsRUFBRTs7MEJBQ04sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7b0JBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztxQkFDaEM7aUJBQ0Y7YUFDRjtTQUNGO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPO0lBQ1QsQ0FBQzs7Ozs7OztJQU9ELFdBQVcsQ0FBQyxVQUFlO1FBQ3pCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLFVBQVUsRUFBRTs7c0JBQ1IsUUFBUSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUM1RCxJQUFJLFFBQVEsRUFBRTtvQkFDWixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFOzs4QkFDckMsVUFBVSxHQUFHLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsWUFBWSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRzs4QkFDNUYsT0FBTyxHQUFHLFVBQVUsQ0FBQyxRQUFRLEdBQUcsYUFBYTt3QkFDakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDN0I7eUJBQU0sSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBRWpELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7O2tDQUNsQyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHO2tDQUN6RixnQ0FBZ0MsR0FBRyxVQUFVLENBQUMsUUFBUSxHQUFHLFlBQVk7NEJBQ3pFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQzNCOzZCQUFNOzRCQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQzt5QkFDdEM7cUJBRUY7eUJBQU07d0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO3FCQUMzQztpQkFDRjthQUNGO1NBQ0Y7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU87SUFDVCxDQUFDOzs7Ozs7O0lBT08sYUFBYSxDQUFDLEdBQVc7O2NBQ3pCLFFBQVEsR0FBRyx1REFBdUQ7UUFDeEUsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7OztJQU1PLFVBQVUsQ0FBQyxHQUFXOztjQUN0QixTQUFTLEdBQUcsNkVBQTZFO1FBQy9GLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7Ozs7Ozs7SUFRRCxXQUFXLENBQUMsSUFBVSxFQUFFLFFBQWdCLEVBQUUsT0FBYTtRQUVyRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1NBQzdEOztjQUVLLFFBQVEsR0FBYSxJQUFJLFFBQVEsRUFBRTtRQUV6QyxJQUFJLElBQUksRUFBRTtZQUVSLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDOztnQkFFMUIsYUFBYSxHQUFHLElBQUksV0FBVyxFQUFFOztrQkFDL0IsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3ZDLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO2dCQUNsQyxhQUFhLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDbEU7O2tCQUNLLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtnQkFDdEQsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBRWhDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQzs7Ozs7OztJQU9ELFVBQVUsQ0FBQyxNQUFXO1FBRXBCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2Qjs7ZUFFRztZQUNILElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTs7c0JBQ2QsTUFBTSxHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTTtnQkFFNUYsSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTs7MEJBQ3RDLFFBQVEsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFDNUQsSUFBSSxRQUFRLEVBQUU7d0JBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDekI7aUJBQ0Y7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO2lCQUMxRTthQUNGO2lCQUFNOztzQkFDQyxRQUFRLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQzVELElBQUksUUFBUSxFQUFFO29CQUNaLFFBQVEsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzNEO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsT0FBTztJQUNULENBQUM7Ozs7Ozs7O0lBUUQsV0FBVyxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBRXRDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTs7a0JBQ2pCLFFBQVEsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUM1RCxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtvQkFDekIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNqRDtxQkFBTTtvQkFDTCxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ25EO2FBQ0Y7U0FFRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsT0FBTztJQUNULENBQUM7Ozs7Ozs7SUFPRCxXQUFXLENBQUMsUUFBZ0I7UUFFMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTs7a0JBQzFDLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFFL0MsSUFBSSxZQUFZLEVBQUU7O3NCQUVWLFFBQVEsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFFNUQsSUFBSSxRQUFRLEVBQUU7b0JBQ1osSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFOzs4QkFDdEIsTUFBTSxHQUFHLDBCQUEwQixHQUFHLFFBQVEsR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLFNBQVM7d0JBQ3pGLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3pCO3lCQUFNOzs4QkFDQyxNQUFNLEdBQUcsMEJBQTBCLEdBQUcsUUFBUSxHQUFHLEtBQUssR0FBRyxZQUFZLEdBQUcsU0FBUzt3QkFDdkYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDekI7aUJBQ0Y7YUFDRjtTQUVGO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDOzs7Ozs7O0lBT0QsV0FBVyxDQUFDLFFBQWdCO1FBRTFCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7O2tCQUMxQyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBRS9DLElBQUksWUFBWSxFQUFFOztzQkFFVixRQUFRLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBRTVELElBQUksUUFBUSxFQUFFO29CQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTs7OEJBQ3RCLFVBQVUsR0FBRyw0QkFBNEIsR0FBRyxRQUFRLEdBQUcsT0FBTyxHQUFHLFlBQVksR0FBRyxTQUFTO3dCQUMvRixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUM3Qjt5QkFBTTs7OEJBQ0MsVUFBVSxHQUFHLDRCQUE0QixHQUFHLFFBQVEsR0FBRyxLQUFLLEdBQUcsWUFBWSxHQUFHLFNBQVM7d0JBQzdGLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQzdCO2lCQUNGO2FBQ0Y7U0FFRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQzs7Ozs7O0lBR08sVUFBVSxDQUFDLElBQVk7O2NBRXZCLGNBQWMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDO1FBRXRFLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsT0FBTztJQUNULENBQUM7Ozs7Ozs7O0lBT08sU0FBUyxDQUFDLEtBQVU7UUFDMUIsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7Ozs7O0lBR08sbUJBQW1COztZQUVyQixXQUFXO1FBRWYsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDckMsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUVmLENBQUM7Ozs7O0lBR08sY0FBYzs7Y0FFZCxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7UUFFbEQsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDdEM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Ozs7Ozs7SUFPTyx3QkFBd0IsQ0FBQyxHQUFXO1FBQzFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksa0JBQWtCLENBQUMsQ0FBQztJQUN0RSxDQUFDOzs7WUF6VUYsVUFBVTs7OztZQUhILFVBQVU7Ozs7Ozs7SUFPaEIsZ0RBQWdDOztJQU1wQix1Q0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL3V0aWxzL25neC1lZGl0b3IudXRpbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29tbWFuZEV4ZWN1dG9yU2VydmljZSB7XG5cbiAgLyoqIHNhdmVzIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgZWRpdG9yIHdoZW4gZm9jdXNzZWQgb3V0ICovXG4gIHNhdmVkU2VsZWN0aW9uOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBfaHR0cCBIVFRQIENsaWVudCBmb3IgbWFraW5nIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHBDbGllbnQpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBleGVjdXRlcyBjb21tYW5kIGZyb20gdGhlIHRvb2xiYXJcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmQgY29tbWFuZCB0byBiZSBleGVjdXRlZFxuICAgKi9cbiAgZXhlY3V0ZShjb21tYW5kOiBzdHJpbmcpOiB2b2lkIHtcblxuICAgIGlmICghdGhpcy5zYXZlZFNlbGVjdGlvbiAmJiBjb21tYW5kICE9PSAnZW5hYmxlT2JqZWN0UmVzaXppbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiBFZGl0b3InKTtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2VuYWJsZU9iamVjdFJlc2l6aW5nJykge1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2VuYWJsZU9iamVjdFJlc2l6aW5nJywgdHJ1ZSwgJ3RydWUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2Jsb2NrcXVvdGUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PT0gJ3JlbW92ZUJsb2NrcXVvdGUnKSB7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnZm9ybWF0QmxvY2snLCBmYWxzZSwgJ2RpdicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKGNvbW1hbmQsIGZhbHNlLCBudWxsKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogaW5zZXJ0cyBpbWFnZSBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBpbWFnZVVSSSB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRJbWFnZShpbWFnZVVSSTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24pIHtcbiAgICAgIGlmIChpbWFnZVVSSSkge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGNvbnN0IGluc2VydGVkID0gZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydEltYWdlJywgZmFsc2UsIGltYWdlVVJJKTtcbiAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVVJMJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgaW1hZ2UgaW4gdGhlIGVkaXRvclxuICAgKlxuICAgKiBAcGFyYW0gdmlkZVBhcmFtcyB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIGluc2VydGVkXG4gICAqL1xuICBpbnNlcnRWaWRlbyh2aWRlUGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgaWYgKHZpZGVQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc1lvdXR1YmVMaW5rKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlVVJMID0gJzxpZnJhbWUgd2lkdGg9XCInICsgdmlkZVBhcmFtcy53aWR0aCArICdcIiBoZWlnaHQ9XCInICsgdmlkZVBhcmFtcy5oZWlnaHQgKyAnXCInXG4gICAgICAgICAgICAgICsgJ3NyYz1cIicgKyB2aWRlUGFyYW1zLnZpZGVvVXJsICsgJ1wiPjwvaWZyYW1lPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoeW91dHViZVVSTCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoZWNrVGFnU3VwcG9ydEluQnJvd3NlcigndmlkZW8nKSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkVVJMKHZpZGVQYXJhbXMudmlkZW9VcmwpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZGVvU3JjID0gJzx2aWRlbyB3aWR0aD1cIicgKyB2aWRlUGFyYW1zLndpZHRoICsgJ1wiIGhlaWdodD1cIicgKyB2aWRlUGFyYW1zLmhlaWdodCArICdcIidcbiAgICAgICAgICAgICAgICArICcgY29udHJvbHM9XCJ0cnVlXCI+PHNvdXJjZSBzcmM9XCInICsgdmlkZVBhcmFtcy52aWRlb1VybCArICdcIj48L3ZpZGVvPic7XG4gICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SHRtbCh2aWRlb1NyYyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmlkZW8gVVJMJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gaW5zZXJ0IHZpZGVvJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrcyB0aGUgaW5wdXQgdXJsIGlzIGEgdmFsaWQgeW91dHViZSBVUkwgb3Igbm90XG4gICAqXG4gICAqIEBwYXJhbSB1cmwgWW91dHVlIFVSTFxuICAgKi9cbiAgcHJpdmF0ZSBpc1lvdXR1YmVMaW5rKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeXRSZWdFeHAgPSAvXihodHRwKHMpPzpcXC9cXC8pPygodyl7M30uKT95b3V0dShiZXwuYmUpPyhcXC5jb20pP1xcLy4rLztcbiAgICByZXR1cm4geXRSZWdFeHAudGVzdCh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBpcyBhIHZhbGlkIHVybCBvciBub3RcbiAgICogQHBhcmFtIHVybCB1cmxcbiAgICovXG4gIHByaXZhdGUgaXNWYWxpZFVSTCh1cmw6IHN0cmluZykge1xuICAgIGNvbnN0IHVybFJlZ0V4cCA9IC8oaHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJSFcXC1cXC9dKSk/LztcbiAgICByZXR1cm4gdXJsUmVnRXhwLnRlc3QodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGxvYWRzIGltYWdlIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHBhcmFtIGZpbGUgZmlsZSB0aGF0IGhhcyB0byBiZSB1cGxvYWRlZFxuICAgKiBAcGFyYW0gZW5kUG9pbnQgZW5wb2ludCB0byB3aGljaCB0aGUgaW1hZ2UgaGFzIHRvIGJlIHVwbG9hZGVkXG4gICAqL1xuICB1cGxvYWRJbWFnZShmaWxlOiBGaWxlLCBlbmRQb2ludDogc3RyaW5nLCBoZWFkZXJzPzogYW55KTogYW55IHtcblxuICAgIGlmICghZW5kUG9pbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgRW5kcG9pbnQgaXNuYHQgcHJvdmlkZWQgb3IgaW52YWxpZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgaWYgKGZpbGUpIHtcblxuICAgICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cbiAgICAgIGxldCByZXF1ZXN0SGVhZGVyID0gbmV3IEh0dHBIZWFkZXJzKCk7XG4gICAgICBjb25zdCBoZWFkZXJLZXlzID0gT2JqZWN0LmtleXMoaGVhZGVycyk7XG4gICAgICBmb3IgKGNvbnN0IGhlYWRlcktleSBvZiBoZWFkZXJLZXlzKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXIgPSByZXF1ZXN0SGVhZGVyLnNldChoZWFkZXJLZXksIGhlYWRlcnNbaGVhZGVyS2V5XSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBlbmRQb2ludCwgZm9ybURhdGEsIHtcbiAgICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHJlcXVlc3RIZWFkZXJcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5faHR0cC5yZXF1ZXN0KHJlcSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEltYWdlJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydHMgbGluayBpbiB0aGUgZWRpdG9yXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbXMgcGFyYW1ldGVycyB0aGF0IGhvbGRzIHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIGxpbmtcbiAgICovXG4gIGNyZWF0ZUxpbmsocGFyYW1zOiBhbnkpOiB2b2lkIHtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICAvKipcbiAgICAgICAqIGNoZWNrIHdoZXRoZXIgdGhlIHNhdmVkIHNlbGVjdGlvbiBjb250YWlucyBhIHJhbmdlIG9yIHBsYWluIHNlbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAocGFyYW1zLnVybE5ld1RhYikge1xuICAgICAgICBjb25zdCBuZXdVcmwgPSAnPGEgaHJlZj1cIicgKyBwYXJhbXMudXJsTGluayArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgcGFyYW1zLnVybFRleHQgKyAnPC9hPic7XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldFNlbGVjdGlvbigpLnR5cGUgIT09ICdSYW5nZScpIHtcbiAgICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgICAgaWYgKHJlc3RvcmVkKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwobmV3VXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG5ldyBsaW5rcyBjYW4gYmUgaW5zZXJ0ZWQuIFlvdSBjYW5ub3QgZWRpdCBVUkxgcycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0b3JlZCA9IFV0aWxzLnJlc3RvcmVTZWxlY3Rpb24odGhpcy5zYXZlZFNlbGVjdGlvbik7XG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjcmVhdGVMaW5rJywgZmFsc2UsIHBhcmFtcy51cmxMaW5rKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JhbmdlIG91dCBvZiB0aGUgZWRpdG9yJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIGluc2VydCBjb2xvciBlaXRoZXIgZm9udCBvciBiYWNrZ3JvdW5kXG4gICAqXG4gICAqIEBwYXJhbSBjb2xvciBjb2xvciB0byBiZSBpbnNlcnRlZFxuICAgKiBAcGFyYW0gd2hlcmUgd2hlcmUgdGhlIGNvbG9yIGhhcyB0byBiZSBpbnNlcnRlZCBlaXRoZXIgdGV4dC9iYWNrZ3JvdW5kXG4gICAqL1xuICBpbnNlcnRDb2xvcihjb2xvcjogc3RyaW5nLCB3aGVyZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbikge1xuICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuICAgICAgaWYgKHJlc3RvcmVkICYmIHRoaXMuY2hlY2tTZWxlY3Rpb24oKSkge1xuICAgICAgICBpZiAod2hlcmUgPT09ICd0ZXh0Q29sb3InKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2ZvcmVDb2xvcicsIGZhbHNlLCBjb2xvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2hpbGl0ZUNvbG9yJywgZmFsc2UsIGNvbG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogc2V0IGZvbnQgc2l6ZSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udFNpemUgZm9udC1zaXplIHRvIGJlIHNldFxuICAgKi9cbiAgc2V0Rm9udFNpemUoZm9udFNpemU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgaWYgKHRoaXMuc2F2ZWRTZWxlY3Rpb24gJiYgdGhpcy5jaGVja1NlbGVjdGlvbigpKSB7XG4gICAgICBjb25zdCBkZWxldGVkVmFsdWUgPSB0aGlzLmRlbGV0ZUFuZEdldEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGRlbGV0ZWRWYWx1ZSkge1xuXG4gICAgICAgIGNvbnN0IHJlc3RvcmVkID0gVXRpbHMucmVzdG9yZVNlbGVjdGlvbih0aGlzLnNhdmVkU2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzdG9yZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc051bWVyaWMoZm9udFNpemUpKSB7XG4gICAgICAgICAgICBjb25zdCBmb250UHggPSAnPHNwYW4gc3R5bGU9XCJmb250LXNpemU6ICcgKyBmb250U2l6ZSArICdweDtcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRQeCA9ICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogJyArIGZvbnRTaXplICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRQeCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSYW5nZSBvdXQgb2YgdGhlIGVkaXRvcicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZm9udCBuYW1lL2ZhbWlseSBmb3IgdGV4dFxuICAgKlxuICAgKiBAcGFyYW0gZm9udE5hbWUgZm9udC1mYW1pbHkgdG8gYmUgc2V0XG4gICAqL1xuICBzZXRGb250TmFtZShmb250TmFtZTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICBpZiAodGhpcy5zYXZlZFNlbGVjdGlvbiAmJiB0aGlzLmNoZWNrU2VsZWN0aW9uKCkpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRWYWx1ZSA9IHRoaXMuZGVsZXRlQW5kR2V0RWxlbWVudCgpO1xuXG4gICAgICBpZiAoZGVsZXRlZFZhbHVlKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdG9yZWQgPSBVdGlscy5yZXN0b3JlU2VsZWN0aW9uKHRoaXMuc2F2ZWRTZWxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXN0b3JlZCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyhmb250TmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJ3B4O1wiPicgKyBkZWxldGVkVmFsdWUgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICB0aGlzLmluc2VydEh0bWwoZm9udEZhbWlseSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbHkgPSAnPHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTogJyArIGZvbnROYW1lICsgJztcIj4nICsgZGVsZXRlZFZhbHVlICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIdG1sKGZvbnRGYW1pbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmFuZ2Ugb3V0IG9mIHRoZSBlZGl0b3InKTtcbiAgICB9XG4gIH1cblxuICAvKiogaW5zZXJ0IEhUTUwgKi9cbiAgcHJpdmF0ZSBpbnNlcnRIdG1sKGh0bWw6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgY29uc3QgaXNIVE1MSW5zZXJ0ZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnaW5zZXJ0SFRNTCcsIGZhbHNlLCBodG1sKTtcblxuICAgIGlmICghaXNIVE1MSW5zZXJ0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvbicpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayB3aGV0aGVyIHRoZSB2YWx1ZSBpcyBhIG51bWJlciBvciBzdHJpbmdcbiAgICogaWYgbnVtYmVyIHJldHVybiB0cnVlXG4gICAqIGVsc2UgcmV0dXJuIGZhbHNlXG4gICAqL1xuICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9eLXswLDF9XFxkKyQvLnRlc3QodmFsdWUpO1xuICB9XG5cbiAgLyoqIGRlbGV0ZSB0aGUgdGV4dCBhdCBzZWxlY3RlZCByYW5nZSBhbmQgcmV0dXJuIHRoZSB2YWx1ZSAqL1xuICBwcml2YXRlIGRlbGV0ZUFuZEdldEVsZW1lbnQoKTogYW55IHtcblxuICAgIGxldCBzbGVjdGVkVGV4dDtcblxuICAgIGlmICh0aGlzLnNhdmVkU2VsZWN0aW9uKSB7XG4gICAgICBzbGVjdGVkVGV4dCA9IHRoaXMuc2F2ZWRTZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuc2F2ZWRTZWxlY3Rpb24uZGVsZXRlQ29udGVudHMoKTtcbiAgICAgIHJldHVybiBzbGVjdGVkVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfVxuXG4gIC8qKiBjaGVjayBhbnkgc2xlY3Rpb24gaXMgbWFkZSBvciBub3QgKi9cbiAgcHJpdmF0ZSBjaGVja1NlbGVjdGlvbigpOiBhbnkge1xuXG4gICAgY29uc3Qgc2xlY3RlZFRleHQgPSB0aGlzLnNhdmVkU2VsZWN0aW9uLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAoc2xlY3RlZFRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFNlbGVjdGlvbiBNYWRlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgdGFnIGlzIHN1cHBvcnRlZCBieSBicm93c2VyIG9yIG5vdFxuICAgKlxuICAgKiBAcGFyYW0gdGFnIEhUTUwgdGFnXG4gICAqL1xuICBwcml2YXRlIGNoZWNrVGFnU3VwcG9ydEluQnJvd3Nlcih0YWc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKSBpbnN0YW5jZW9mIEhUTUxVbmtub3duRWxlbWVudCk7XG4gIH1cblxufVxuIl19