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

    var ContentIdentification = /** @class */ (function () {
        function ContentIdentification() {
            this.url = null;
        }
        ContentIdentification.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.debug('MP: Initializing Content Identification');
                    // Check the url
                    this.url = parseLocation(document.location);
                    this.addVideoEventListeners();
                    this.addScrollDepthListeners();
                    this.addFormEventListeners();
                    console.log({ ContentIdentification: this });
                    return [2 /*return*/];
                });
            });
        };
        ContentIdentification.prototype.trackIdentifiedContent = function () {
            return __awaiter(this, void 0, void 0, function () {
                var MP, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            MP = window.MP;
                            if (!MP) {
                                console.error('MP: No MP instance exists.');
                                return [2 /*return*/, false];
                            }
                            console.log("Track Identified Content Request Body:", { pageType: {} });
                            return [4 /*yield*/, MP.apiRequest('POST', 'identification/content', {})];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                        case 2:
                            e_1 = _a.sent();
                            console.error("Error tracking page: " + e_1);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ContentIdentification.prototype.addScrollDepthListeners = function () {
            window.addEventListener("scroll", function (event) {
                // console.log({ scrollEvent: event })
            });
            window.onscroll = function () {
                document.documentElement.scrollTop;
                // console.log({ top })
            };
        };
        ContentIdentification.prototype.addVideoEventListeners = function () {
            // Search for video elements
            var videos = document.querySelectorAll('video');
            // // Search for external video libraries
            // const videoJsVideos = document.querySelectorAll('video-js')
            var allVideoElements = __spreadArray([], Array.from(videos), true);
            allVideoElements.map(function (videoElement) {
                console.log({ videoElement: videoElement });
                videoElement.onplay = function (event) {
                    console.log({ onPlayEvent: event });
                };
                videoElement.onpause = function (event) {
                    console.log({ onPauseEvent: event });
                };
            });
        };
        ContentIdentification.prototype.addFormEventListeners = function () {
            var forms = document.querySelectorAll('form');
            var allFormElements = __spreadArray([], Array.from(forms), true);
            allFormElements.map(function (formElement) {
                console.log({ formElement: formElement });
                formElement.oninput = function (event) {
                    console.log({ onInputEvent: event });
                };
                formElement.onsubmit = function (event) {
                    console.log({ onSubmitEvent: event });
                    debugger;
                };
            });
        };
        return ContentIdentification;
    }());

    var script = document.currentScript;
    /**
     * @function: init
     * @description: When page is ready, validates script and account status
     * before loading scribe-analytics tracking and page identification services
     */
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            var siteId, MP, accountIsActive, ContentId;
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
                        return [4 /*yield*/, MP.authenticateAccount()];
                    case 1:
                        accountIsActive = _a.sent();
                        if (!accountIsActive) return [3 /*break*/, 3];
                        console.debug('MP: Account is active.');
                        ContentId = new ContentIdentification();
                        window.MP_ContentIdentification = ContentId;
                        // Initialize MP class
                        return [4 /*yield*/, ContentId.init()];
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
        init().then(function () { return 'Successfully initiated ContentIdentification Pixel'; });
    }

})();
//# sourceMappingURL=index.js.map
