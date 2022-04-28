(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function scriptIsHTML(script) {
        return 'src' in script;
    }
    function getSiteId(script) {
        if (window.MP_SID) {
            return window.MP_SID;
        }
        if (!script) {
            console.error('MP: script requires being loaded from mp source');
            return null;
        }
        if (!scriptIsHTML(script)) {
            console.error('MP: mp does not support SVG scripts.');
            return null;
        }
        var url = new URL(script.src);
        return url.searchParams.get('sid');
    }
    var parseQueryString = function (qs) {
        var pairs = {};
        if (qs.length > 0) {
            var query = qs.charAt(0) === '?' ? qs.substring(1) : qs;
            if (query.length > 0) {
                var vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    if (vars[i].length > 0) {
                        var pair = vars[i].split('=');
                        try {
                            var name_1 = decodeURIComponent(pair[0]);
                            pairs[name_1] = pair.length > 1 ? decodeURIComponent(pair[1]) : 'true';
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }
        return pairs;
    };
    var parseLocation = function (location) {
        return {
            href: location.href,
            hash: location.hash,
            host: location.host,
            hostname: location.hostname,
            pathname: location.pathname,
            protocol: location.protocol,
            query: parseQueryString(location.search),
        };
    };

    var getAncestors = function (node) {
        var cur = node;
        var result = [];
        while (cur && cur !== document.body) {
            result.push(cur);
            cur = cur.parentNode;
        }
        return result;
    };

    var MISC_PAGE_PROPS = {
        formInputsOnPage: 0,
        videosOnPage: 0,
        contentOnPage: 0,
        hasSidebar: false,
        hasTopbar: false,
        hasNavbar: false,
    };
    var PageCategoryEnum = {
        ECOMM: 'ecomm',
        LEAD: 'lead_gen',
        CONTACT: 'contact_us',
        CAREERS: 'careers',
        BLOG: 'blog',
        GENERAL: 'general',
    };

    var DEFAULT_PAGE = {
        domKeywords: [],
        urlKeywords: [],
        category: PageCategoryEnum.GENERAL,
        formInputsOnPage: 0,
        videosOnPage: 0,
        contentOnPage: 0
    };
    var PageIdentification = /** @class */ (function () {
        function PageIdentification(accountSiteId) {
            this.apiDomain = 'http://localhost:5000/dev';
            this.userContext = {
                accountSiteId: accountSiteId,
                accountStatus: 'inactive',
                fingerprint: null,
                sessionId: null,
                lastVerified: null,
                visitorUUID: null,
                distinctPersonId: null,
            };
            this.pageType = DEFAULT_PAGE;
            this.pageIdProps = null;
            this.url = null;
            this.scripts = null;
            this.elements = null;
            this.buttons = null;
            this.forms = null;
            this.links = null;
            this.videos = null;
        }
        PageIdentification.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.debug('MP: Initializing Page Identification');
                            // Get page id props from S3
                            return [4 /*yield*/, this.getPageIdPropsFromS3()
                                // Check the url
                            ];
                        case 1:
                            // Get page id props from S3
                            _a.sent();
                            // Check the url
                            this.url = parseLocation(document.location);
                            // Map the Dom
                            this.mapDom();
                            console.log({ PageIdentification: this });
                            return [2 /*return*/];
                    }
                });
            });
        };
        PageIdentification.prototype.isAccountActive = function () {
            return this.userContext.accountStatus === 'active';
        };
        /**
         * @function getKeywordsFromS3
         * @description Get json object of page identification keywords and identifiers
         */
        PageIdentification.prototype.getPageIdPropsFromS3 = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, s3JsonData, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch("https://magic-pixel-public.s3.amazonaws.com/page_id_properties.json")];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            s3JsonData = _a.sent();
                            this.pageIdProps = __assign(__assign({}, MISC_PAGE_PROPS), s3JsonData);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error("Error fetching mp keywords: " + e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @function getAttributes
         * @description Create an array of the attributes on an element
         * @param  {NamedNodeMap} attributes The attributes on an element
         * @return {Array} The attributes on an element as an array of key/value pairs
         */
        PageIdentification.prototype.getAttributes = function (attributes) {
            var allAttributes = [];
            Array.prototype.map.call(attributes, function (attribute) {
                var newAttribute = {
                    name: attribute.name,
                    value: attribute.value,
                };
                allAttributes.push(newAttribute);
            });
            return allAttributes;
        };
        /**
         * @function isTemplateElement
         * @description Check if form is part of the page template. We are looking for unique elements per page
         * @param  {HTMLFormElement} element The attributes on an element
         * @return {Boolean}
         */
        PageIdentification.prototype.isTemplateElement = function (element) {
            var ancestors = getAncestors(element);
            var isTemplateForm = false;
            ancestors.forEach(function (ancestor) {
                ['sidebar', 'topbar', 'nav', 'header'].forEach(function (templateKeyword) {
                    if (ancestor.id.includes(templateKeyword)) {
                        isTemplateForm = true;
                    }
                    if (ancestor.className.includes(templateKeyword)) {
                        isTemplateForm = true;
                    }
                });
            });
            return isTemplateForm;
        };
        /**
         * @function createElementMap
         * @description Create an elements map of an HTMLElement
         * @param  {HTMLElement | Element} element the HTMLElement
         * @param  {Boolean} isSVG SVG are handled uniquely
         * @return {DomElementType[]} attributes about the HTMLFormElement
         */
        PageIdentification.prototype.createElementMap = function (element, isSVG) {
            var _this = this;
            var childNodes = [];
            if (element.childNodes && element.childNodes.length > 0) {
                childNodes = Array.prototype.filter.call(element.childNodes, function (node) {
                    return (node.nodeType !== 8 && node.nodeType == 1 && node.localName !== 'br') ||
                        (node.nodeType === 3 && node.textContent.trim() !== '');
                });
            }
            return childNodes.map(function (node) {
                var id = node.id || null;
                var className = node.className || null;
                var attributes = node.nodeType !== 1 ? [] : _this.getAttributes(node.attributes);
                var content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim();
                var type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase();
                var children = _this.createElementMap(node, isSVG || node.type === 'svg');
                return {
                    id: id,
                    className: className,
                    content: content,
                    attributes: attributes,
                    type: type,
                    node: node,
                    children: children,
                    isSVG: isSVG || node.type === 'svg',
                };
            });
        };
        /**
         * @function createFormElementsMap
         * @description Create an elements map of a form HTMLFormElement
         * @param  {HTMLButtonElement} form the HTMLFormElement
         * @return {DomFormElementType[]} an array of form elements with attributes about the HTMLFormElement
         */
        PageIdentification.prototype.createFormElementsMap = function (form) {
            var _this = this;
            var childNodes = [];
            if (form.childNodes && form.childNodes.length > 0) {
                childNodes = Array.prototype.filter.call(form.childNodes, function (node) {
                    return (node.nodeType !== 8 && node.nodeType == 1 && node.localName !== 'br') ||
                        (node.nodeType === 3 && node.textContent.trim() !== '');
                });
            }
            return childNodes.map(function (node) {
                var id = node.id || null;
                var className = node.className || null;
                var attributes = node.nodeType !== 1 ? [] : _this.getAttributes(node.attributes);
                var content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim();
                var type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase();
                var children = _this.createFormElementsMap(node);
                return {
                    id: id,
                    className: className,
                    content: content,
                    attributes: attributes,
                    type: type,
                    node: node,
                    children: children,
                };
            });
        };
        /**
         * @function createButtonElementMap
         * @description Create an attribute map of a HTMLButton element
         * @param  {HTMLButtonElement} button: HTMLButton element
         * @return {DomButtonType} attributes about the HTMLButton
         */
        PageIdentification.prototype.createButtonElementMap = function (button) {
            var _a;
            return {
                id: button.id,
                className: button.className,
                content: ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                attributes: this.getAttributes(button.attributes),
                type: button.tagName.toLowerCase(),
                ancestors: getAncestors(button),
            };
        };
        /**
         * @function createLinkElementMap
         * @description Create an attribute map of a HTMLAnchorElement element
         * @param  {HTMLAnchorElement} link: HTMLAnchorElement element
         * @param  {number} index used for reference if id is not provided
         * @return {DomLinkMapType} attributes about the HTMLAnchorElement
         */
        PageIdentification.prototype.createLinkElementMap = function (link, index) {
            var _a;
            return {
                id: link.id || "link-id-" + index,
                isTemplateElement: this.isTemplateElement(link),
                className: link.className,
                content: ((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                attributes: this.getAttributes(link.attributes),
                type: link.tagName.toLowerCase(),
            };
        };
        /**
         * @function createDomLinkMap
         * @description Create a list of attribute maps for each HTMLAnchorElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLAnchorElement
         */
        PageIdentification.prototype.createDomLinkMap = function () {
            var _this = this;
            var links = document.querySelectorAll('a');
            var linksMap = [];
            Array.from(links).map(function (link, i) {
                var mappedLink = _this.createLinkElementMap(link, i);
                linksMap.push(mappedLink);
            });
            return linksMap;
        };
        /**
         * @function createDomFormMap
         * @description Create a list of attribute maps for each HTMLFormElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
         */
        PageIdentification.prototype.createDomFormMap = function () {
            var _this = this;
            var forms = document.querySelectorAll('form');
            var formsMap = [];
            Array.from(forms).map(function (form, i) {
                var mappedForm = {
                    id: form.id || "form-id-" + i,
                    isTemplateElement: _this.isTemplateElement(form),
                    elements: _this.createFormElementsMap(form),
                };
                formsMap.push(mappedForm);
            });
            return formsMap;
        };
        /**
         * @function createDomButtonMap
         * @description Create a list of attribute maps for each HTMLFormElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
         */
        PageIdentification.prototype.createDomButtonMap = function () {
            var _this = this;
            var buttons = document.querySelectorAll('button');
            var inputButtons = document.querySelectorAll('input[type="submit"]');
            var allButtons = Array.prototype.slice.call(buttons).concat(Array.prototype.slice.call(inputButtons));
            var buttonsMap = {};
            Array.from(allButtons).map(function (buttonNode, i) {
                var buttonMap = _this.createButtonElementMap(buttonNode);
                var buttonKey = buttonNode.id || "button-id-" + i;
                buttonsMap[buttonKey] = buttonMap;
            });
            return buttonsMap;
        };
        /**
         * @function createDomIFrameMap
         * @description
         * @return
         */
        PageIdentification.prototype.createDomIFrameMap = function () {
            var iframes = document.querySelectorAll('iframe');
            console.log({ iframes: iframes });
        };
        /**
         * @function createDomVideoMap
         * @description Create a list of attribute maps for each HTMLVideoElement element
         * @return {DomVideoMapType[]} an array of attributes about the HTMLVideoElement
         */
        PageIdentification.prototype.createDomVideoMap = function () {
            var _this = this;
            // Search for video elements
            var videos = document.querySelectorAll('video');
            // Search for external video libraries
            var videoJsVideos = document.querySelectorAll('video-js');
            var allVideoElements = __spreadArray(__spreadArray([], Array.from(videos), true), Array.from(videoJsVideos), true);
            var videosMap = [];
            allVideoElements.map(function (video, i) {
                var mappedForm = {
                    id: video.id || "video-id-" + i,
                    elements: _this.createElementMap(video, false),
                };
                videosMap.push(mappedForm);
            });
            return videosMap;
        };
        /**
         * @function checkDomElementsForKeywords
         * @description Check url object to see if it contains a keyword in the keywords array.
         * @param {Element[]} elements: an array of element from the dom
         * @param {string[]} keywords: array of keywords to search from
         */
        PageIdentification.prototype.checkDomElementsForKeywords = function (elements, keywords) {
            var keywordMatches = [];
            elements.map(function (element) {
                return keywords.find(function (k) {
                    if (element.textContent) {
                        var isMatch = element.textContent.toLowerCase().includes(k);
                        if (isMatch) {
                            keywordMatches.push(k);
                        }
                    }
                });
            });
            return !!keywordMatches.length ? keywordMatches : [];
        };
        /**
         * @function checkUrlForKeywords
         * @description Check url object for keywords
         * @param {string} url: url string
         * @param {string[]} keywords: array of keywords to search from
         * @return {string[] | null}
         */
        PageIdentification.prototype.checkUrlForKeywords = function (url, keywords) {
            return keywords.filter(function (k) { return url.includes(k); });
        };
        /**
         * @function checkForPaymentProcessorButton
         * @description Check dom for payment processor button elements
         */
        PageIdentification.prototype.checkForPaymentProcessorButton = function () {
            var _this = this;
            var _a;
            var paymentProcessors = (_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.eCommerce.paymentProcessors;
            if (paymentProcessors) {
                paymentProcessors.forEach(function (paymentProcessor) {
                    if (paymentProcessor.identifier.selector == 'id') {
                        var idButton = document.getElementById(paymentProcessor.identifier.query);
                        if (idButton && _this.pageType) {
                            _this.pageType.paymentProcessor = paymentProcessor;
                        }
                    }
                    else if (paymentProcessor.identifier.selector == 'all') {
                        var elementButton = document.querySelector(paymentProcessor.identifier.query);
                        if (elementButton && _this.pageType) {
                            _this.pageType.paymentProcessor = paymentProcessor;
                        }
                    }
                });
            }
        };
        PageIdentification.prototype.checkForPaymentProcessorScript = function () {
            // TODO: Check for scripts
        };
        PageIdentification.prototype.checkForPaymentProcessor = function () {
            this.checkForPaymentProcessorButton();
            this.checkForPaymentProcessorScript();
        };
        /**
         * @function isEcommPage
         * @description Check if page is an ecomm page by checking the url and dom for
         * ECOMM_KEYWORDS. If so, set the ecomm page flag true
         */
        PageIdentification.prototype.isEcommPage = function () {
            var _a, _b, _c;
            // Check for payment processor button
            // Determine if the JS objects, scripts or methods exist.
            // TODO: Get Clarity from Justin on this
            this.checkForPaymentProcessor();
            if (((_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.eCommerce.keywords) && this.pageType) {
                var keywords = this.pageIdProps.eCommerce.keywords;
                // Does the URL contain ecommerce keywords?
                if ((_b = this.url) === null || _b === void 0 ? void 0 : _b.pathname) {
                    this.pageType.urlKeywords = this.checkUrlForKeywords((_c = this.url) === null || _c === void 0 ? void 0 : _c.pathname, keywords);
                }
                // Does the DOM contain ecommerce keywords?
                if (this.elements) {
                    this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords);
                }
            }
            // Check if page is an ecomm page
            if (this.pageType && (this.pageType.paymentProcessor || this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
                this.pageType.category = 'ecomm';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function isConfirmationPage
         * @description Check if page is a confirmation page by checking the url and dom
         * for CONFIRMATION_KEYWORDS. If so, will set the confirmation page flag true
         */
        PageIdentification.prototype.isConfirmationPage = function () {
            var _a, _b, _c;
            if ((_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.confirmation.keywords) {
                var keywords = this.pageIdProps.confirmation.keywords;
                // Does the URL contain confirmation keywords?
                if ((_b = this.url) === null || _b === void 0 ? void 0 : _b.pathname) {
                    this.pageType.urlKeywords = this.checkUrlForKeywords((_c = this.url) === null || _c === void 0 ? void 0 : _c.pathname, keywords);
                }
                // Does the DOM contain confirmation keywords?
                if (this.elements) {
                    this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords);
                }
            }
            console.log({ pageType: this.pageType });
            // Check if page is a confirmation page
            if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
                this.pageType.category = 'confirmation';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function isLeadGenPage
         * @description Check if page is a lead gen page by for form email input. If so, will set the lead gen page flag true
         */
        PageIdentification.prototype.isLeadGenPage = function () {
            // Check if page is a lead gen page
            var emailInput = document.querySelector('input[type="email"]');
            if (this.pageType && emailInput) {
                this.pageType.category = 'lead_gen';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function isContactUsPage
         * @description Check if page is a contact page by checking the url and dom
         * for CONTACT_US_KEYWORDS. If so, will set the contact page flag true
         */
        PageIdentification.prototype.isContactUsPage = function () {
            var _a, _b, _c;
            if (((_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.contactUs.keywords) && this.pageType) {
                var keywords = this.pageIdProps.contactUs.keywords;
                // Does the URL contain contact us keywords?
                if ((_b = this.url) === null || _b === void 0 ? void 0 : _b.pathname) {
                    this.pageType.urlKeywords = this.checkUrlForKeywords((_c = this.url) === null || _c === void 0 ? void 0 : _c.pathname, keywords);
                }
                // Does the DOM contain contact us keywords?
                if (this.elements) {
                    this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords);
                }
            }
            // Check if page is a contact us page
            if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
                this.pageType.category = 'contact_us';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function isCareersPage
         * @description Check if page is a careers' page by checking the url and dom
         * for CAREERS_KEYWORDS. If so, will set the careers' page flag true
         */
        PageIdentification.prototype.isCareersPage = function () {
            var _a, _b, _c;
            if (((_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.careers.keywords) && this.pageType) {
                var keywords = this.pageIdProps.careers.keywords;
                // Does the URL contain careers keywords?
                if ((_b = this.url) === null || _b === void 0 ? void 0 : _b.pathname) {
                    this.pageType.urlKeywords = this.checkUrlForKeywords((_c = this.url) === null || _c === void 0 ? void 0 : _c.pathname, keywords);
                }
            }
            // Check if page is a contact us page
            if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
                this.pageType.category = 'careers';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function isBlogPage
         * @description Check if page is a blog page by checking the url and dom
         * for BLOG_KEYWORDS. If so, will set the blog page flag true
         */
        PageIdentification.prototype.isBlogPage = function () {
            var _a, _b, _c;
            if (((_a = this.pageIdProps) === null || _a === void 0 ? void 0 : _a.blog.keywords) && this.pageType) {
                var keywords = this.pageIdProps.blog.keywords;
                // Does the URL contain blog keywords?
                if ((_b = this.url) === null || _b === void 0 ? void 0 : _b.pathname) {
                    this.pageType.urlKeywords = this.checkUrlForKeywords((_c = this.url) === null || _c === void 0 ? void 0 : _c.pathname, keywords);
                }
                // Does the DOM contain contact us keywords?
                if (this.elements) {
                    this.pageType.domKeywords = this.checkDomElementsForKeywords(this.elements, keywords);
                }
            }
            // Check if page is a blog page
            if (this.pageType && (this.pageType.urlKeywords.length > 0 || this.pageType.domKeywords.length > 0)) {
                this.pageType.category = 'blog';
                return true;
            }
            else {
                this.pageType = DEFAULT_PAGE;
                return false;
            }
        };
        /**
         * @function checkMiscProperties
         * @description Check page for misc page properties. Will set general attributes
         * on misc page id properties
         */
        PageIdentification.prototype.checkMiscProperties = function () {
            var _a;
            if (this.pageType) {
                // How many form inputs are on the page?
                var pageForms = this.forms && this.forms.filter(function (f) { return !f.isTemplateElement; });
                this.pageType.formInputsOnPage = (pageForms === null || pageForms === void 0 ? void 0 : pageForms.length) || 0;
                // How many videos are on the page?
                this.pageType.videosOnPage = ((_a = this.videos) === null || _a === void 0 ? void 0 : _a.length) || 0;
                // How much content is on the page?
                // TODO: Get Clarity from Justin on this
                // What buttons are on the page?
            }
        };
        /**
         * @function mapDom
         * @description Get and set, parsed Dom scripts and elements
         */
        PageIdentification.prototype.mapDom = function () {
            // Select all page elements
            var docElements = document.querySelectorAll('*');
            // Select all scripts
            var scripts = document.querySelectorAll('script');
            // Set DOM mapped attributes
            this.elements = Array.from(docElements);
            this.scripts = Array.from(scripts);
            this.buttons = this.createDomButtonMap();
            this.forms = this.createDomFormMap();
            this.links = this.createDomLinkMap();
            this.videos = this.createDomVideoMap();
            // TODO: Check IFrames somehow
            // this.createDomIFrameMap()
            // this.iframes = domMap.iframes
        };
        // TODO: Define return type
        PageIdentification.prototype.apiRequest = function (method, endpoint, body) {
            if (body === void 0) { body = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var accountBody, response, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!this.userContext.accountSiteId) {
                                console.warn('MP: Error: Missing ids, cannot track page');
                                return [2 /*return*/, false];
                            }
                            accountBody = __assign(__assign({}, body), this.userContext);
                            return [4 /*yield*/, fetch(this.apiDomain + "/" + endpoint, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(accountBody),
                                })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.json()];
                        case 2:
                            e_2 = _a.sent();
                            console.error(e_2);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PageIdentification.prototype.trackIdentifiedPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    try {
                        payload = __assign(__assign({}, this.userContext), this.pageType);
                        console.log("Track Identified Page Request Body:", { payload: payload });
                        // await this.apiRequest('POST', `${this.apiDomain}/'identify/page'`, payload)
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error("Error tracking page: " + e);
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * @function identifyPage
         * @description Run sequence of checks to determine what page the user is on.
         * Once identified, will call the track-page api
         */
        PageIdentification.prototype.identifyPage = function () {
            // Check for misc items on the page first
            // These are included in every api call
            this.checkMiscProperties();
            // Check for page type
            // Stop checking once a page has been identified
            // TODO: Implement breakout from page check
            var isEcommPage = this.isEcommPage();
            console.log({ isEcommPage: isEcommPage });
            if (isEcommPage) {
                this.trackIdentifiedPage();
                return;
            }
            this.isConfirmationPage();
            this.isLeadGenPage();
            this.isContactUsPage();
            this.isBlogPage();
            this.isCareersPage();
        };
        return PageIdentification;
    }());

    var script = document.currentScript;
    /**
     * @function: init
     * @description: When page is ready, validates script and account status
     * before loading scribe-analytics tracking and page identification services
     */
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            var siteId, pageIdentification, accountIsActive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = getSiteId(script);
                        if (!siteId) {
                            console.error('MP: Error verifying account. No site id provided');
                            return [2 /*return*/, false];
                        }
                        pageIdentification = new PageIdentification(siteId);
                        window.MP_PAGE_IDENTIFICATION = pageIdentification;
                        // Initialize MP class
                        return [4 /*yield*/, pageIdentification.init()
                            // Check if account is active
                        ];
                    case 1:
                        // Initialize MP class
                        _a.sent();
                        accountIsActive = pageIdentification.isAccountActive();
                        if (accountIsActive) {
                            console.debug('MP: Account is active.');
                            pageIdentification.identifyPage();
                        }
                        else {
                            console.error("MP: Account is not active for site id " + siteId + ".");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    // Wait until all elements are on the pageIdentification from initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    else {
        init().then(function () { return 'Successfully initiated Magic Pixel'; });
    }

})();
//# sourceMappingURL=index.js.map
