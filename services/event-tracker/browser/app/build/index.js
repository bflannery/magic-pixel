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
    function getDiffFromTimestamp(time1, time2, scope) {
        var timeDiff = time1 - time2;
        if (scope === 'days') {
            return timeDiff / (1000 * 3600 * 24);
        }
        else if (scope === 'hours') {
            return timeDiff / (60 * 60 * 1000);
        }
        else {
            return timeDiff / (60 * 1000);
        }
    }
    function uuidv4() {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    var isChildLink = function (ancestors) {
        var isChildLink = false;
        for (var i = 0; i < ancestors.length; i++) {
            var element = ancestors[i];
            if (element.tagName == 'A') {
                isChildLink = true;
            }
        }
        return isChildLink;
    };
    var toObject = function (olike) {
        var o = {};
        var key;
        for (key in olike) {
            o[key] = olike[key];
        }
        return o;
    };
    var isObject = function (object) {
        return object != null && typeof object === 'object';
    };
    var deepEqual = function (object1, object2) {
        var keys1 = Object.keys(object1);
        var keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
            var key = keys1_1[_i];
            var val1 = object1[key];
            var val2 = object2[key];
            var areObjects = isObject(val1) && isObject(val2);
            if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
                return false;
            }
        }
        return true;
    };
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
    var parseUrl = function (url) {
        var link = document.createElement('a');
        link.href = url;
        if (link.host === '') {
            link.host = link.href;
        }
        return {
            href: link.href,
            hash: link.hash,
            host: link.host,
            hostname: link.hostname,
            pathname: link.pathname,
            protocol: link.protocol,
            query: parseQueryString(link.search),
        };
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
    var isSamePage = function (url1, url2) {
        var url1Object = parseUrl(url1);
        var url2Object = parseUrl(url2);
        // Ignore the hash when comparing to see if two pages represent the same resource:
        return (url1Object.protocol === url2Object.protocol &&
            url1Object.host === url2Object.host &&
            url1Object.pathname === url2Object.pathname &&
            deepEqual(url1Object.query, url2Object.query));
    };

    var EventHandler = /** @class */ (function () {
        function EventHandler() {
            this.handler = [];
        }
        EventHandler.prototype.push = function (f) {
            this.handler.push(f);
        };
        EventHandler.prototype.dispatch = function (e) {
            var args = Array.prototype.slice.call(arguments, 0);
            for (var i = 0; i < this.handler.length; i++) {
                try {
                    this.handler[i].apply(null, args);
                }
                catch (e) {
                    console.error(e);
                }
            }
        };
        return EventHandler;
    }());

    var getAncestors = function (node) {
        var cur = node;
        var result = [];
        while (cur && cur !== document.body) {
            result.push(cur);
            cur = cur.parentNode;
        }
        return result;
    };
    var getDataset = function (node) {
        if (node.dataset && typeof node.dataset !== 'undefined' && Object.keys(node).length > 0) {
            return toObject(node.dataset);
        }
        else if (node.attributes) {
            var dataset = {};
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attrItem = attrs.item(i);
                var name_1 = attrItem.name;
                var value = attrItem.value;
                dataset["data-" + name_1] = {
                    name: name_1,
                    value: value,
                };
            }
            return dataset;
        }
        else
            return {};
    };
    var genCssSelector = function (node) {
        var sel = '';
        while (node !== document.body) {
            var id = node.id;
            var classes = typeof node.className === 'string' ? node.className.trim().split(/\s+/).join('.') : '';
            var tagName = node.nodeName.toLowerCase();
            if (id && id !== '')
                id = '#' + id;
            if (classes !== '')
                classes = '.' + classes;
            var prefix = tagName + id + classes;
            var parent_1 = node.parentNode;
            var nthchild = 1;
            for (var i = 0; i < parent_1.childNodes.length; i++) {
                if (parent_1.childNodes[i] === node)
                    break;
                else {
                    var childTagName = parent_1.childNodes[i].tagName;
                    if (childTagName !== undefined) {
                        nthchild = nthchild + 1;
                    }
                }
            }
            if (sel !== '')
                sel = '>' + sel;
            sel = prefix + ':nth-child(' + nthchild + ')' + sel;
            node = parent_1;
        }
        return sel;
    };
    var getNodeDescriptor = function (node) {
        return {
            id: node.id,
            selector: genCssSelector(node),
            title: node.title === '' ? null : node.title,
            data: getDataset(node),
        };
    };
    var simulateMouseEvent = function (element, eventName, options) {
        if (options === void 0) { options = {}; }
        var eventMatchers = {
            HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
        };
        var mergedOptions = __assign({ pointerX: 0, pointerY: 0, button: 0, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, bubbles: true, cancelable: true }, options);
        var oEvent = null;
        var eventType = null;
        for (var name_2 in eventMatchers) {
            if (eventMatchers[name_2].test(eventName)) {
                eventType = name_2;
                break;
            }
        }
        if (!eventType) {
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
        }
        var evt = eventType === 'HTMLEvents' ? new Event('HTMLEvent') : new MouseEvent('MouseEvent');
        oEvent = __assign(__assign({}, evt), mergedOptions);
        try {
            element.dispatchEvent(oEvent);
        }
        catch (e) {
            // IE nonsense:
            console.error(e);
        }
        return element;
    };
    var getFormData = function (eventForm) {
        var acc = {};
        var setField = function (name, value) {
            if (name === '')
                name = 'anonymous';
            var oldValue = acc[name];
            if (oldValue != null) {
                if (oldValue instanceof Array) {
                    acc[name].push(value);
                }
                else {
                    acc[name] = [oldValue, value];
                }
            }
            else {
                acc[name] = value;
            }
        };
        for (var i = 0; i < eventForm.elements.length; i++) {
            var child = eventForm.elements[i];
            var nodeType = child.tagName.toLowerCase();
            if (nodeType == 'input' || nodeType == 'textfield') {
                // INPUT or TEXTFIELD element.
                // Make sure auto-complete is not turned off for the field:
                if ((child.getAttribute('autocomplete') || '').toLowerCase() !== 'off') {
                    // Make sure it's not a password:
                    if (child.type !== 'password') {
                        // Make sure it's not a radio or it's a checked radio:
                        if (child.type !== 'radio' || child.checked) {
                            var childKey = '';
                            if (child.name) {
                                childKey = child.name;
                            }
                            else if (child.labels && child.labels.length > 0) {
                                childKey = child.labels.join('');
                            }
                            else if (child.id) {
                                childKey = child.id;
                            }
                            setField(childKey, child.value);
                        }
                    }
                }
            }
            else if (nodeType == 'select') {
                // SELECT element:
                var option = child.options[child.selectedIndex];
                setField(child.name, option.value);
            }
        }
        return { formFields: acc };
    };
    var monitorElements = function (tagName, onNew, refresh) {
        refresh = refresh || 50;
        var checker = function () {
            var curElements = document.getElementsByTagName(tagName);
            for (var i = 0; i < curElements.length; i++) {
                var el = curElements[i];
                var scanned = el.getAttribute('mp_scanned');
                if (!scanned) {
                    el.setAttribute('mp_scanned', 'true');
                    try {
                        onNew(el);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            setTimeout(checker, refresh);
        };
        setTimeout(checker, 0);
    };
    var onReady = function (f) {
        if (document.body != null) {
            return f();
        }
        else {
            setTimeout(function () {
                onReady(f);
            }, 10);
        }
    };
    var onEvent = function (el, type, capture, f_) {
        var fixUp = function (f) { return function (e) {
            var retVal;
            if (!e.preventDefault) {
                e.preventDefault = function () {
                    retVal = false;
                };
            }
            return f(e) || retVal;
        }; };
        var f = fixUp(f_);
        if (el.addEventListener) {
            el.addEventListener(type, f, capture);
        }
        else {
            console.log('No Event listener');
            // @ts-ignore
            if (el.attachEvent) {
                // @ts-ignore
                el.attachEvent('on' + type, f);
            }
        }
    };
    var onSubmit = function (f_) {
        var handler = new EventHandler();
        onReady(function () {
            console.log('On Submit Ready');
            onEvent(document.body, 'submit', true, function (e) {
                console.log('On Submit Type');
                handler.dispatch(e);
            });
            // Intercept enter keypresses which will submit the form in most browsers.
            onEvent(document.body, 'keypress', false, function (e) {
                console.log('On Keypress Type');
                if (e.keyCode == 13) {
                    var target = e.target;
                    var form = (target && target.form) || null;
                    if (form) {
                        e.form = form;
                        handler.dispatch(e);
                    }
                }
            });
            // Intercept clicks on any buttons:
            onEvent(document.body, 'click', false, function (e) {
                var _a;
                console.log('On Click Type');
                var target = e.target;
                var targetType = ((target && target.type) || '').toLowerCase();
                if (target && target.form && (targetType === 'submit' || targetType === 'button')) {
                    e.form = target.form;
                    if ((_a = e.form) === null || _a === void 0 ? void 0 : _a.id) {
                        e.form.formId = e.form.id;
                    }
                    else if (e.form.name) {
                        e.form.formId = e.form.name;
                    }
                    handler.dispatch(e);
                }
            });
        });
        handler.push(f_);
    };

    var defaultURLProps = {
        href: null,
        hash: null,
        host: null,
        hostname: null,
        pathname: null,
        protocol: null,
        query: {},
    };
    var EventTracker = /** @class */ (function () {
        function EventTracker(accountSiteId) {
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
            this.javascriptRedirect = true;
            this.oldHash = document.location.hash;
            this.queue = [];
            this.handlers = [];
        }
        EventTracker.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var storageUserContext;
                return __generator(this, function (_a) {
                    console.debug('MP: Initializing Event Tracker');
                    storageUserContext = this.getStorageContext();
                    this.userContext = __assign(__assign({}, this.userContext), storageUserContext);
                    console.log({ EventTracker: this });
                    return [2 /*return*/];
                });
            });
        };
        EventTracker.prototype.initTracking = function () {
            // Init Trackers
            // this.initTrackers()
            // // Load Queue from storage
            // this.loadQueue()
            //
            // // Track pending events in the events Queue
            // if (this.queue.length > 0) {
            //   this.trackQueueEvents(this.queue)
            // }
        };
        // Context
        EventTracker.prototype.getStorageContext = function () {
            var mpStorageContext = localStorage.getItem('mp');
            if (!mpStorageContext) {
                return null;
            }
            return JSON.parse(mpStorageContext);
        };
        EventTracker.prototype.setStorageContext = function (data) {
            localStorage.setItem('mp', JSON.stringify(data));
        };
        // Session
        EventTracker.prototype.getStorageSessionId = function () {
            return sessionStorage.getItem('mp_sid');
        };
        EventTracker.prototype.getStorageQueue = function () {
            var mpEventsQueue = localStorage.getItem('mp_events_queue');
            return mpEventsQueue ? JSON.parse(mpEventsQueue) : [];
        };
        EventTracker.prototype.loadQueue = function () {
            this.queue = this.getStorageQueue();
        };
        EventTracker.prototype.addToQueue = function (event) {
            this.queue = __spreadArray(__spreadArray([], this.queue, true), [event], false);
        };
        EventTracker.prototype.saveQueue = function () {
            localStorage.setItem('mp_events_queue', JSON.stringify(this.queue));
        };
        EventTracker.prototype.clearQueue = function () {
            this.queue = [];
        };
        EventTracker.prototype.isAccountActive = function () {
            return this.userContext.accountStatus === 'active';
        };
        EventTracker.prototype.apiRequest = function (method, endpoint, body) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var jsonBody, response, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            if (!((_a = this.userContext) === null || _a === void 0 ? void 0 : _a.accountSiteId)) {
                                console.warn('MP: Error: Missing ids, cannot track event');
                                return [2 /*return*/, false];
                            }
                            jsonBody = JSON.stringify(body);
                            return [4 /*yield*/, fetch(endpoint, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: jsonBody,
                                })];
                        case 1:
                            response = _b.sent();
                            return [2 /*return*/, response.json()];
                        case 2:
                            e_1 = _b.sent();
                            console.error(e_1);
                            return [2 /*return*/, e_1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // TRACKERS
        EventTracker.prototype.initTrackers = function () {
            this.trackClicks();
            this.trackLinkClicks();
            this.trackFormSubmits();
        };
        // Track all clicks to the document
        EventTracker.prototype.trackClicks = function () {
            var _this = this;
            onReady(function () {
                return onEvent(document.body, 'click', true, function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var ancestors;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ancestors = getAncestors(e.target);
                                if (!!isChildLink(ancestors)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.track('click', {
                                        target: getNodeDescriptor(e.target),
                                    })];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        // Track all link clicks on the document
        EventTracker.prototype.trackLinkClicks = function () {
            var _this = this;
            monitorElements('a', function (el) {
                return onEvent(el, 'click', true, function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var target, parsedUrl, value;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                //return if this click it created with createEvent and not by a real click
                                if (!e.isTrusted) {
                                    return [2 /*return*/];
                                }
                                target = e.target;
                                // TODO: Make sure the link is actually to a pageIdentification.
                                // It's a click, not a Javascript redirect:
                                this.javascriptRedirect = false;
                                setTimeout(function () {
                                    _this.javascriptRedirect = true;
                                }, 500);
                                parsedUrl = parseUrl(el.href);
                                value = {
                                    target: __assign({ url: parsedUrl }, getNodeDescriptor(target)),
                                };
                                if (!isSamePage(parsedUrl.href, document.location.href)) return [3 /*break*/, 1];
                                console.log('User is jumping around the same pageIdentification');
                                // User is jumping around the same pageIdentification. Track here in case the
                                // client prevents the default action and the hash doesn't change
                                // (otherwise it would be tracked by onhashchange):
                                this.oldHash = null;
                                return [3 /*break*/, 5];
                            case 1:
                                if (!(parsedUrl.hostname === document.location.hostname)) return [3 /*break*/, 3];
                                // We are linking to a pageIdentification on the same site. There's no need to send
                                // the event now, we can safely send it later:
                                console.log('We are linking to a pageIdentification on the same site.');
                                return [4 /*yield*/, this.trackLater('click', value)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 3:
                                e.preventDefault();
                                console.log('We are linking to a pageIdentification that is not on this site.');
                                // We are linking to a pageIdentification that is not on this site. So we first
                                // wait to send the event before simulating a different click
                                // on the link. This ensures we don't lose the event if the user
                                // does not return to this site ever again.
                                return [4 /*yield*/, this.track('click', value, function () {
                                        // It's a click, not a Javascript redirect:
                                        _this.javascriptRedirect = false;
                                        if (target) {
                                            // Simulate a click to the original element if we were waiting on the tracker:
                                            simulateMouseEvent(target, 'click');
                                        }
                                    })];
                            case 4:
                                // We are linking to a pageIdentification that is not on this site. So we first
                                // wait to send the event before simulating a different click
                                // on the link. This ensures we don't lose the event if the user
                                // does not return to this site ever again.
                                _a.sent();
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
            });
        };
        // Track all form submissions
        EventTracker.prototype.trackFormSubmits = function () {
            var _this = this;
            onSubmit(function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!e.form) return [3 /*break*/, 2];
                            if (!e.form.id) {
                                e.form.id = uuidv4();
                            }
                            return [4 /*yield*/, this.trackLater('form_submit', {
                                    form: __assign(__assign({}, getFormData(e.form)), { formId: e.form.id }),
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        };
        EventTracker.prototype.createEvent = function (eventType, properties) {
            console.log({ eventType: eventType, properties: properties });
            return __assign({ eventType: eventType, timestamp: new Date().toISOString(), source: {
                    url: parseLocation(document.location),
                }, target: {
                    url: defaultURLProps,
                } }, properties);
        };
        /**
         * @function: track
         * @param {String} [eventName] A string that identifies an event. Ex. "Sign Up"
         * @param {Object} [properties] A set of properties to include with the event you're sending.
         * @param {Function} [callback] A string that identifies an event. Ex. "Sign Up"
         * These describe the details about the visitor and/or event.
         * @description: track a visitor and/or event details
         */
        EventTracker.prototype.track = function (eventName, properties, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var eventProps, mpEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Tracking Event: ', { eventName: eventName, properties: properties });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            eventProps = __assign(__assign({}, this.userContext), properties);
                            mpEvent = this.createEvent(eventName, eventProps);
                            console.log('Customer Tracking Event: ', { mpEvent: mpEvent });
                            return [4 /*yield*/, this.apiRequest('POST', this.apiDomain + "/event/collection", mpEvent)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 3:
                            _a.sent();
                            console.error('MP: Error trying to track event.');
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @function: trackScribeEvent
         * @param {ScribeEventType} [scribeEvent] A scribe-analytics event object
         * @description: internal method to track a visitor and/or event details via scribe-analytics
         */
        EventTracker.prototype.trackScribeEvent = function (scribeEvent) {
            return __awaiter(this, void 0, void 0, function () {
                var event_1, accountEvent, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            event_1 = scribeEvent.value;
                            accountEvent = __assign(__assign(__assign({}, event_1), { type: event_1.event }), this.userContext);
                            console.log({ scribeAccountEvent: accountEvent });
                            return [4 /*yield*/, this.apiRequest('POST', this.apiDomain + "/event/collection", accountEvent)];
                        case 1:
                            response = _a.sent();
                            if (response.status === '403') {
                                console.warn('MP: Unauthorized');
                                // TODO: Invalidate local storage data
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, true];
                        case 2:
                            _a.sent();
                            console.error('MP: Error sending scribe-analytics event to MP server.');
                            // TODO: Retry or invalidate local storage data
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @function: trackLater
         * @param {String} eventName A string that identifies an event. Ex. "Sign Up"
         * @param {Object | null} properties A key/pair object of custom event properties
         * @description: track a visitor and/or event details at a later time
         */
        EventTracker.prototype.trackLater = function (eventName, properties) {
            return __awaiter(this, void 0, void 0, function () {
                var eventProps, mpEvent;
                return __generator(this, function (_a) {
                    try {
                        eventProps = __assign(__assign({}, this.userContext), properties);
                        mpEvent = this.createEvent(eventName, eventProps);
                        this.addToQueue(mpEvent);
                        this.saveQueue();
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error('MP: Error trying to track event.');
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * @function: trackQueueEvents
         * @param {MPEventType[]} [events] A string that identifies an event. Ex. "Sign Up"
         * @description: track a visitor and/or event details
         */
        EventTracker.prototype.trackQueueEvents = function (events) {
            var _this = this;
            console.log('Track Queue Event');
            try {
                events.forEach(function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var eventType, sourceUrl, targetUrl;
                    return __generator(this, function (_a) {
                        console.log({ event: event });
                        eventType = event.eventType;
                        // Specially modify redirect, formSubmit events to save the new URL,
                        // because the URL is not known at the time of the event:
                        if (['redirect', 'formSubmit'].includes(eventType)) {
                            event.target = __assign(__assign({}, event.target), { url: parseLocation(document.location) });
                        }
                        // If source and target urls are the same, change redirect events
                        // to reload events:
                        if (eventType === 'redirect') {
                            try {
                                sourceUrl = event.source.url.href;
                                targetUrl = event.target.url.href;
                                if (sourceUrl === targetUrl) {
                                    // it's a page reload:
                                    event.eventType = 'reload';
                                }
                            }
                            catch (e) {
                                console.error(e);
                            }
                        }
                        console.log({ eventType: eventType, event: event });
                        return [2 /*return*/];
                    });
                }); });
                // this.clearQueue()
                // this.saveQueue()
                return true;
            }
            catch (e) {
                console.error('MP: Error trying to track event.');
                return false;
            }
        };
        /**
         * @function: identify
         * @param {String} [distinctUserId] A string that uniquely identifies a visitor.
         * @description: Identify a visitor with a unique ID to track their events and create a person.
         * By default, unique visitors are tracked using a UUID generated the first time they visit the site.
         * Should be called when you know the identity of the current visitor (i.e. login or signup).
         */
        EventTracker.prototype.identify = function (distinctUserId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // const body = {
                        //   accountSiteId: this.userContext?.accountSiteId,
                        //   distinctUserId: distinctUserId,
                        //   userId: this.userContext?.userId,
                        // }
                        // await this.apiRequest('POST', `${this.apiDomain}/identify`, body)
                        this.userContext.distinctPersonId = distinctUserId;
                        this.setStorageContext(this.userContext);
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error('MP: Error trying to identify user.');
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * @function: authenticateAccountId
         * @description: Will call api to verify the account status based on the host id provided in script.
         * Will update the MP class object data and local/session storage on successful response.
         */
        EventTracker.prototype.authenticateAccountId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var authBody, response, mpContext;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.userContext.accountSiteId) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            authBody = {
                                accountSiteId: this.userContext.accountSiteId,
                            };
                            return [4 /*yield*/, this.apiRequest('POST', this.apiDomain + "/authentication", authBody)];
                        case 2:
                            response = _a.sent();
                            mpContext = __assign(__assign({}, this.userContext), { accountSiteId: this.userContext.accountSiteId, accountStatus: response.accountStatus, lastVerified: Date.now() });
                            if (mpContext.accountStatus === 'active') {
                                this.userContext = mpContext;
                                this.setStorageContext(mpContext);
                                return [2 /*return*/, true];
                            }
                            return [2 /*return*/, false];
                        case 3:
                            _a.sent();
                            console.error('MP: Error verifying account.');
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/, false];
                    }
                });
            });
        };
        /**
         * @function: authenticateHostData
         * @description: Verify local storage and MP class object data.
         * Will check local storage for MP data, and determine if the account
         * is valid through a series of checks on the MP class object around the
         * account id, status, and the last time it was verified
         */
        EventTracker.prototype.authenticateHostData = function (mpStorageContext) {
            return __awaiter(this, void 0, void 0, function () {
                var lastVerified, accountStatus, now, lastVerifiedTimeStamp, lastVerifiedHours, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            // If no mpData kill it
                            if (!this.userContext) {
                                return [2 /*return*/, false];
                            }
                            if (!(this.userContext.accountSiteId !== mpStorageContext.accountSiteId)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.authenticateAccountId()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            lastVerified = mpStorageContext.lastVerified, accountStatus = mpStorageContext.accountStatus;
                            now = new Date().getTime();
                            lastVerifiedTimeStamp = lastVerified || new Date().getTime();
                            lastVerifiedHours = getDiffFromTimestamp(now, lastVerifiedTimeStamp, 'hours');
                            if (!(accountStatus === 'inactive' || accountStatus === 'delinquent')) return [3 /*break*/, 5];
                            if (!(lastVerifiedHours < 1)) return [3 /*break*/, 3];
                            return [2 /*return*/, false];
                        case 3: return [4 /*yield*/, this.authenticateAccountId()];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5:
                            if (!(accountStatus === 'active')) return [3 /*break*/, 8];
                            if (!(lastVerifiedHours >= 1)) return [3 /*break*/, 7];
                            console.debug("MP: Re-authenticating account id " + this.userContext.accountSiteId);
                            return [4 /*yield*/, this.authenticateAccountId()];
                        case 6: return [2 /*return*/, _a.sent()];
                        case 7:
                            this.userContext = __assign(__assign({}, this.userContext), mpStorageContext);
                            return [2 /*return*/, true];
                        case 8: return [2 /*return*/, false];
                        case 9:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [2 /*return*/, false];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @function: authenticateAccount
         * @description: The authenticateAccount function will authenticate an account
         * based on either host id provided in script or existing local and session storage data
         */
        EventTracker.prototype.authenticateAccount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var mpStorageContext;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mpStorageContext = this.getStorageContext();
                            console.log({ mpStorageContext: mpStorageContext });
                            if (!mpStorageContext) return [3 /*break*/, 2];
                            console.debug("MP: Authenticating host storage data for account site id " + this.userContext.accountSiteId);
                            return [4 /*yield*/, this.authenticateHostData(mpStorageContext)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: 
                        // console.debug(`MP: Authenticating host storage data for account site id ${this.userContext.accountSiteId}`)
                        // return await this.authenticateHostData(mpStorageContext)
                        return [2 /*return*/, false];
                    }
                });
            });
        };
        return EventTracker;
    }());

    var script = document.currentScript;
    /**
     * @function: init
     * @description: When page is ready, validates script and account status
     * before loading scribe-analytics tracking and page identification services
     */
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            var siteId, eventTracker, accountIsActive, newScript;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        siteId = getSiteId(script);
                        if (!siteId) {
                            console.error('MP: Error verifying account. No site id provided');
                            return [2 /*return*/, false];
                        }
                        eventTracker = new EventTracker(siteId);
                        window.MP_EVENT_TRACKER = eventTracker;
                        // Initialize MP class
                        return [4 /*yield*/, eventTracker.init()
                            // Check if account is active
                        ];
                    case 1:
                        // Initialize MP class
                        _a.sent();
                        accountIsActive = eventTracker.isAccountActive();
                        if (!accountIsActive) return [3 /*break*/, 3];
                        console.debug('MP: Account is active.');
                        // Initialize MP class
                        return [4 /*yield*/, eventTracker.initTracking()
                            // create a new script element
                        ];
                    case 2:
                        // Initialize MP class
                        _a.sent();
                        newScript = document.createElement('script');
                        newScript.src = "http://localhost:8082/scribe-analytics-debug.js?hid=" + siteId;
                        newScript.async = true;
                        // insert the scribe-analytics script element into doc
                        document.head.appendChild(newScript);
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
//# sourceMappingURL=index.js.map
