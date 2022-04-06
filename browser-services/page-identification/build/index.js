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

    var ECOMM_KEYWORDS = [
        'paypal',
        'google_pay',
        'apple_pay',
        'bolt_pay',
        'stripe_for',
        'braintree_form',
        'square_form',
        'checkout',
        'purchase',
        'order',
        'buy',
        'order_summary',
        'total',
        'subtotal',
        'shipping',
        'tax',
        'payment',
        'promo_code',
        'coupon',
        'shipping_address',
        'billing_address',
    ];
    var CONFIRMATION_KEYWORDS = [
        'thankyou',
        'order',
        'ordersummary',
        'confirmation'
    ];
    var LEAD_GEN_KEYWORDS = ['email'];
    var CONTACT_US_KEYWORDS = ['contact', 'feedback'];
    var CAREERS_KEYWORDS = ['careers', 'jobs'];
    var BLOG_KEYWORDS = ['blog', 'articles'];
    var PAGE_ID_PROPERTIES = {
        eCommerce: {
            isEcommPage: false,
            dom: {
                paypal: false,
                google_pay: false,
                apple_pay: false,
                bolt_pay: false,
                stripe_for: false,
                braintree_form: false,
                square_form: false,
                checkout: false,
                purchase: false,
                order: false,
                buy: false,
                order_summary: false,
                total: false,
                subtotal: false,
                shipping: false,
                tax: false,
                payment: false,
                promo_code: false,
                coupon: false,
                shipping_address: false,
                billing_address: false,
            },
            url: {
                checkout: false,
                purchase: false,
                order: false,
                buy: false,
                order_summary: false,
            },
        },
        confirmation: {
            isConfirmationPage: false,
            url: {
                thank_you: false,
                order_summary: false,
                order: false,
                confirmation: false,
            },
            dom: {
                confirmation: false,
            },
        },
        lead_gen: {
            isLeadGenPage: false,
            dom: {
                email: true,
            },
        },
        contact_us: {
            isContactUsPage: false,
            dom: {
                contact: true,
            },
            url: {
                contact: false,
                feedback: false,
            },
        },
        careers: {
            isCareersPage: false,
            url: {
                careers: false,
                jobs: false,
            },
        },
        blog: {
            isBlogPage: false,
            url: {
                blog: false,
                articles: false,
            },
            dom: {
                list_of_articles: false,
                list_of_links: false,
            },
        },
        general: {
            form_inputs_on_page: 0,
            videos_on_page: 0,
            content_on_page: 0,
        },
        misc: {
            has_sidebar: false,
            has_topbar: false,
            has_navbar: false,
        },
    };

    var PageIdentification = /** @class */ (function () {
        function PageIdentification(accountSiteId) {
            this.pageIdProps = PAGE_ID_PROPERTIES;
            this.context = {
                accountSiteId: accountSiteId,
                accountStatus: 'inactive',
                lastVerified: null,
                visitorUUID: null,
                distinctPersonId: null,
            };
            this.url = null;
            this.scripts = null;
            this.elements = null;
            this.buttons = null;
            this.forms = null;
            this.links = null;
            this.videos = null;
        }
        PageIdentification.prototype.init = function () {
            // Check the url
            this.url = parseLocation(document.location);
            // Map the Dom
            this._mapDom();
            // Run through page Checks
            this._checkForPage();
            console.log({ initThis: this });
        };
        /**
         * @function _getAttributes
         * @description Create an array of the attributes on an element
         * @param  {NamedNodeMap} attributes The attributes on an element
         * @return {Array} The attributes on an element as an array of key/value pairs
         */
        PageIdentification.prototype._getAttributes = function (attributes) {
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
         * @function _isTemplateElement
         * @description Check if form is part of the page template. We are looking for unique elements per page
         * @param  {HTMLFormElement} element The attributes on an element
         * @return {Boolean}
         */
        PageIdentification.prototype._isTemplateElement = function (element) {
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
         * @function _createElementMap
         * @description Create an elements map of an HTMLElement
         * @param  {HTMLElement | Element} element the HTMLElement
         * @param  {Boolean} isSVG SVG are handled uniquely
         * @return {DomElementType[]} attributes about the HTMLFormElement
         */
        PageIdentification.prototype._createElementMap = function (element, isSVG) {
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
                var attributes = node.nodeType !== 1 ? [] : _this._getAttributes(node.attributes);
                var content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim();
                var type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase();
                var children = _this._createElementMap(node, isSVG || node.type === 'svg');
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
         * @function _createFormElementsMap
         * @description Create an elements map of a form HTMLFormElement
         * @param  {HTMLButtonElement} form the HTMLFormElement
         * @return {DomFormElementType[]} an array of form elements with attributes about the HTMLFormElement
         */
        PageIdentification.prototype._createFormElementsMap = function (form) {
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
                var attributes = node.nodeType !== 1 ? [] : _this._getAttributes(node.attributes);
                var content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent.trim();
                var type = node.nodeType === 3 ? 'text' : node.tagName.toLowerCase();
                var children = _this._createFormElementsMap(node);
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
         * @function _createButtonElementMap
         * @description Create an attribute map of a HTMLButton element
         * @param  {HTMLButtonElement} button: HTMLButton element
         * @return {DomButtonType} attributes about the HTMLButton
         */
        PageIdentification.prototype._createButtonElementMap = function (button) {
            var _a;
            return {
                id: button.id,
                className: button.className,
                content: ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                attributes: this._getAttributes(button.attributes),
                type: button.tagName.toLowerCase(),
                ancestors: getAncestors(button),
            };
        };
        /**
         * @function _createLinkElementMap
         * @description Create an attribute map of a HTMLAnchorElement element
         * @param  {HTMLAnchorElement} link: HTMLAnchorElement element
         * @param  {number} index used for reference if id is not provided
         * @return {DomLinkMapType} attributes about the HTMLAnchorElement
         */
        PageIdentification.prototype._createLinkElementMap = function (link, index) {
            var _a;
            return {
                id: link.id || "link-id-" + index,
                isTemplateElement: this._isTemplateElement(link),
                className: link.className,
                content: ((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                attributes: this._getAttributes(link.attributes),
                type: link.tagName.toLowerCase(),
            };
        };
        /**
         * @function _createDomLinkMap
         * @description Create a list of attribute maps for each HTMLAnchorElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLAnchorElement
         */
        PageIdentification.prototype._createDomLinkMap = function () {
            var _this = this;
            var links = document.querySelectorAll('a');
            var linksMap = [];
            Array.from(links).map(function (link, i) {
                var mappedLink = _this._createLinkElementMap(link, i);
                linksMap.push(mappedLink);
            });
            return linksMap;
        };
        /**
         * @function _createDomFormMap
         * @description Create a list of attribute maps for each HTMLFormElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
         */
        PageIdentification.prototype._createDomFormMap = function () {
            var _this = this;
            var forms = document.querySelectorAll('form');
            var formsMap = [];
            Array.from(forms).map(function (form, i) {
                var mappedForm = {
                    id: form.id || "form-id-" + i,
                    isTemplateElement: _this._isTemplateElement(form),
                    elements: _this._createFormElementsMap(form),
                };
                formsMap.push(mappedForm);
            });
            return formsMap;
        };
        /**
         * @function _createDomButtonMap
         * @description Create a list of attribute maps for each HTMLFormElement element
         * @return {DomLinkMapType[]} an array of attributes about the HTMLFormElement
         */
        PageIdentification.prototype._createDomButtonMap = function () {
            var _this = this;
            var buttons = document.querySelectorAll('button');
            var inputButtons = document.querySelectorAll('input[type="submit"]');
            var allButtons = Array.prototype.slice.call(buttons).concat(Array.prototype.slice.call(inputButtons));
            var buttonsMap = {};
            Array.from(allButtons).map(function (buttonNode, i) {
                var buttonMap = _this._createButtonElementMap(buttonNode);
                var buttonKey = buttonNode.id || "button-id-" + i;
                buttonsMap[buttonKey] = buttonMap;
            });
            return buttonsMap;
        };
        /**
         * @function _createDomIFrameMap
         * @description
         * @return
         */
        PageIdentification.prototype._createDomIFrameMap = function () {
            var iframes = document.querySelectorAll('iframe');
            console.log({ iframes: iframes });
        };
        /**
         * @function _createDomVideoMap
         * @description Create a list of attribute maps for each HTMLVideoElement element
         * @return {DomVideoMapType[]} an array of attributes about the HTMLVideoElement
         */
        PageIdentification.prototype._createDomVideoMap = function () {
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
                    elements: _this._createElementMap(video, false),
                };
                videosMap.push(mappedForm);
            });
            return videosMap;
        };
        /**
         * @function _checkDomElementsForKeywords
         * @description Check url object to see if it contains a keyword in the keywords array.
         * @param {Element[]} elements: an array of element from the dom
         * @param {string[]} keywords: array of keywords to search from
         */
        PageIdentification.prototype._checkDomElementsForKeywords = function (elements, keywords) {
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
            return !!keywordMatches.length ? keywordMatches : null;
        };
        /**
         * @function _checkUrlForKeywords
         * @description Check url object for keywords
         * @param {ParsedURLProps} url: url object
         * @param {string[]} keywords: array of keywords to search from
         */
        PageIdentification.prototype._checkUrlForKeywords = function (url, keywords) {
            var pathname = url.pathname;
            return pathname ? (keywords.find(function (k) { return pathname.includes(k); }) || null) : null;
        };
        /**
         * @function _isEcommPage
         * @description Check if page is an ecomm page by checking the url and dom for
         * ECOMM_KEYWORDS. If so, set the ecomm page flag true
         */
        PageIdentification.prototype._isEcommPage = function () {
            // Check for payment processor button
            // Determine if the JS objects, scripts or methods exist.
            // TODO: Get Clarity from Justin on this
            var _this = this;
            // Is there a PayPal button on the page?
            // Check for button element: <paypal-button-container />
            var paypalButton = document.querySelector('#paypal-button-container');
            if (paypalButton) {
                this.pageIdProps.eCommerce.dom.paypal = true;
            }
            // Is there a Google Pay button on the page?
            // Check for button element: <google-pay-button />
            var googlePayButton = document.querySelector('google-pay-button');
            if (googlePayButton) {
                this.pageIdProps.eCommerce.dom.google_pay = true;
            }
            // Is there an Apple Pay button on the page?
            // Check for button element: <google-pay-button />
            var applyPayButton = document.querySelector('apple-pay-button');
            if (applyPayButton) {
                this.pageIdProps.eCommerce.dom.apple_pay = true;
            }
            // <script src="https://js.stripe.com/v3/"></script>
            // Is there a Stripe script on the page?
            // Check for button element: <google-pay-button />
            document.querySelectorAll('script');
            if (applyPayButton) {
                this.pageIdProps.eCommerce.dom.apple_pay = true;
            }
            // Does the URL contain ecommerce keywords?
            if (this.url) {
                var keyword = this._checkUrlForKeywords(this.url, ECOMM_KEYWORDS);
                if (keyword) {
                    this.pageIdProps.eCommerce.url[keyword] = true;
                }
            }
            // Does the DOM contain ecommerce keywords?
            if (this.elements) {
                var keywords = this._checkDomElementsForKeywords(this.elements, ECOMM_KEYWORDS);
                if (keywords) {
                    keywords.forEach((function (keyword) { return _this.pageIdProps.eCommerce.dom[keyword] = true; }));
                }
            }
            // Check if page is an ecomm page
            this.pageIdProps.eCommerce.isEcommPage = (Object.values(this.pageIdProps.eCommerce.dom).some(function (value) { return value; }) ||
                Object.values(this.pageIdProps.eCommerce.url).some(function (value) { return value; }));
        };
        /**
         * @function _isConfirmationPage
         * @description Check if page is a confirmation page by checking the url and dom
         * for CONFIRMATION_KEYWORDS. If so, will set the confirmation page flag true
         */
        PageIdentification.prototype._isConfirmationPage = function () {
            var _this = this;
            // Does the URL contain CONFIRMATION_KEYWORDS keywords?
            if (this.url) {
                var keyword = this._checkUrlForKeywords(this.url, CONFIRMATION_KEYWORDS);
                if (keyword) {
                    this.pageIdProps.confirmation.url[keyword] = true;
                }
            }
            // Does the DOM contain CONFIRMATION_KEYWORDS keywords?
            if (this.elements) {
                var keywords = this._checkDomElementsForKeywords(this.elements, CONFIRMATION_KEYWORDS);
                if (keywords) {
                    keywords.forEach((function (keyword) { return _this.pageIdProps.confirmation.dom[keyword] = true; }));
                }
            }
            // Check if page is a confirmation page
            this.pageIdProps.confirmation.isConfirmationPage = (Object.values(this.pageIdProps.confirmation.dom).some(function (value) { return value; }) ||
                Object.values(this.pageIdProps.confirmation.url).some(function (value) { return value; }));
        };
        /**
         * @function _isLeadGenPage
         * @description Check if page is a lead gen page by checking the url and dom
         * for LEAD_GEN_KEYWORDS. If so, will set the lead gen page flag true
         */
        PageIdentification.prototype._isLeadGenPage = function () {
            var _this = this;
            // Does the DOM contain LEAD_GEN_KEYWORDS keywords?
            if (this.elements) {
                var keywords = this._checkDomElementsForKeywords(this.elements, LEAD_GEN_KEYWORDS);
                if (keywords) {
                    keywords.forEach((function (keyword) { return _this.pageIdProps.lead_gen.dom[keyword] = true; }));
                }
            }
            // Check if page is a lead gen page
            this.pageIdProps.lead_gen.isLeadGenPage = (Object.values(this.pageIdProps.lead_gen.dom).some(function (value) { return value; }));
        };
        /**
         * @function _isContactPage
         * @description Check if page is a contact page by checking the url and dom
         * for CONTACT_KEYWORDS. If so, will set the contact page flag true
         */
        PageIdentification.prototype._isContactPage = function () {
            var _this = this;
            // Does the URL contain CONTACT_US_KEYWORDS keywords?
            if (this.url) {
                var keyword = this._checkUrlForKeywords(this.url, CONTACT_US_KEYWORDS);
                if (keyword) {
                    this.pageIdProps.contact_us.url[keyword] = true;
                }
            }
            // Does the DOM contain CONTACT_US_KEYWORDS keywords?
            if (this.elements) {
                var keywords = this._checkDomElementsForKeywords(this.elements, CONTACT_US_KEYWORDS);
                if (keywords) {
                    keywords.forEach((function (keyword) { return _this.pageIdProps.contact_us.dom[keyword] = true; }));
                }
            }
            // Check if page is a contact page
            this.pageIdProps.contact_us.isContactUsPage = (Object.values(this.pageIdProps.contact_us.url).some(function (value) { return value; }) ||
                Object.values(this.pageIdProps.contact_us.dom).some(function (value) { return value; }));
        };
        /**
         * @function _isCareersPage
         * @description Check if page is a careers' page by checking the url and dom
         * for CAREERS_KEYWORDS. If so, will set the careers' page flag true
         */
        PageIdentification.prototype._isCareersPage = function () {
            // Does the URL contain CAREERS_KEYWORDS keywords?
            if (this.url) {
                var keyword = this._checkUrlForKeywords(this.url, CAREERS_KEYWORDS);
                if (keyword) {
                    this.pageIdProps.careers.url[keyword] = true;
                }
                // Check if page is careers page
                this.pageIdProps.careers.isCareersPage = (Object.values(this.pageIdProps.careers.url).some(function (value) { return value; }));
            }
        };
        /**
         * @function _isBlogPage
         * @description Check if page is a blog page by checking the url and dom
         * for BLOG_KEYWORDS. If so, will set the blog page flag true
         */
        PageIdentification.prototype._isBlogPage = function () {
            var _this = this;
            // Does the URL contain BLOG_KEYWORDS keywords?
            if (this.url) {
                var keyword = this._checkUrlForKeywords(this.url, BLOG_KEYWORDS);
                if (keyword) {
                    this.pageIdProps.blog.url[keyword] = true;
                }
            }
            // Does the DOM contain BLOG_KEYWORDS keywords?
            if (this.elements) {
                var keywords = this._checkDomElementsForKeywords(this.elements, BLOG_KEYWORDS);
                if (keywords) {
                    keywords.forEach((function (keyword) { return _this.pageIdProps.blog.dom[keyword] = true; }));
                }
            }
            // Check if page is a blog page
            this.pageIdProps.blog.isBlogPage = (Object.values(this.pageIdProps.blog.url).some(function (value) { return value; }) ||
                Object.values(this.pageIdProps.blog.dom).some(function (value) { return value; }));
        };
        /**
         * @function _checkGeneralProperties
         * @description Check page for general page properties. Will set general attributes
         * on general page id properties
         */
        PageIdentification.prototype._checkGeneralProperties = function () {
            var _a;
            // How many form inputs are on the page?
            var pageForms = this.forms && this.forms.filter(function (f) { return !f.isTemplateElement; });
            this.pageIdProps.general.form_inputs_on_page = (pageForms === null || pageForms === void 0 ? void 0 : pageForms.length) || 0;
            // How many videos are on the page?
            this.pageIdProps.general.videos_on_page = ((_a = this.videos) === null || _a === void 0 ? void 0 : _a.length) || 0;
            // How much content is on the page?
            // TODO: Get Clarity from Justin on this
        };
        /**
         * @function _checkMiscProperties
         * @description Check page for misc page properties. Will set general attributes
         * on misc page id properties
         */
        PageIdentification.prototype._checkMiscProperties = function () {
            // What buttons are on the page?
        };
        /**
         * @function _mapDom
         * @description Get and set, parsed Dom scripts and elements
         */
        PageIdentification.prototype._mapDom = function () {
            // Select all page elements
            var docElements = document.querySelectorAll('*');
            // Select all scripts
            var scripts = document.querySelectorAll('script');
            // Set DOM mapped attributes
            this.elements = Array.from(docElements);
            this.scripts = Array.from(scripts);
            this.buttons = this._createDomButtonMap();
            this.forms = this._createDomFormMap();
            this.links = this._createDomLinkMap();
            this.videos = this._createDomVideoMap();
            // TODO: Check IFrames somehow
            // this._createDomIFrameMap()
            // this.iframes = domMap.iframes
        };
        /**
         * @function _checkForPage
         * @description Run sequence of checks to determine what page the user is on
         */
        PageIdentification.prototype._checkForPage = function () {
            // TODO: Once page has been identified, can we stop checking?
            this._isEcommPage();
            this._isConfirmationPage();
            this._isLeadGenPage();
            this._isContactPage();
            this._isBlogPage();
            this._isCareersPage();
            // General and Misc items on the page
            this._checkGeneralProperties();
            this._checkMiscProperties();
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
            var siteId, MP, PageID, accountIsActive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = getSiteId(script);
                        if (!siteId) {
                            console.error('MP: Error verifying account. No site id provided');
                            return [2 /*return*/, false];
                        }
                        MP = window.MP;
                        if (!MP) {
                            console.error('MP: No MP object found on window');
                            return [2 /*return*/, false];
                        }
                        PageID = new PageIdentification(siteId);
                        window.MP_PageIdentification = PageID;
                        return [4 /*yield*/, MP.authenticateAccount()];
                    case 1:
                        accountIsActive = _a.sent();
                        if (!accountIsActive) return [3 /*break*/, 3];
                        console.debug('MP: Account is active.');
                        // Initialize MP class
                        return [4 /*yield*/, PageID.init()];
                    case 2:
                        // Initialize MP class
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.error("MP: Account is not active for site id " + siteId + ".");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
