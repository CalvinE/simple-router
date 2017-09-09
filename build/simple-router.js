(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleRouter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Link = __webpack_require__(1);

var _Route = __webpack_require__(2);

var _Outlet = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: Add default routes to outlets as an option. 
var SimpleRouter = exports.SimpleRouter = function () {
    function SimpleRouter(config) {
        _classCallCheck(this, SimpleRouter);

        this._config = config; //Object.assign({}, defaultConfigOptions, config);
        this._links = [];
        this._outlets = [];
        this._routes = [];
        this.current = null;
        this._defaultRoute = new _Route.Route('/', {
            handler: function handler() {}
        }, null);
        this._notFoundRoute = new _Route.Route(null, {
            handler: function handler() {}
        }, '');

        this.findOutlets();
        this.findLinks();
    }

    _createClass(SimpleRouter, [{
        key: 'findOutlets',
        value: function findOutlets() {
            var _this = this;

            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'router-outlet';
            var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

            this.clearDeadOutlets();
            baseElement.querySelectorAll('[' + selector + ']').forEach(function (element, index, array) {
                if (!element.isRegistered) {
                    element.isRegistered = true;
                    _this._outlets.push(new _Outlet.Outlet(element, _this.getAttributeValueByName(element, selector)));
                }
            }, this);
        }
    }, {
        key: 'clearDeadOutlets',
        value: function clearDeadOutlets() {
            this._outlets = this._outlets.filter(function (outlet, index, array) {
                var stillExists = document.body.contains(outlet.element);
                if (stillExists === false) {
                    outlet.element.isRegistered = false;
                    outlet.element = null;
                }
                return stillExists;
            });
        }
    }, {
        key: 'findOutletByName',
        value: function findOutletByName(name) {
            var outlet = this._outlets.find(function (possibleOutlet) {
                return possibleOutlet.name == name;
            }, this);
            return outlet;
        }
    }, {
        key: 'findLinks',
        value: function findLinks() {
            var _this2 = this;

            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'route-url';
            var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

            this.clearDeadLinks();
            baseElement.querySelectorAll('[' + selector + ']').forEach(function (element) {
                if (!element.isRegistered) {
                    _this2._links.push(new _Link.Link(element, _this2.findOutletByName(_this2.getAttributeValueByName(element, 'route-target')), _this2.handleLinkClick.bind(_this2)));
                }
            }, this);
        }
    }, {
        key: 'clearDeadLinks',
        value: function clearDeadLinks() {
            this._links = this._links.filter(function (link) {
                var stillExists = document.body.contains(link.element);
                if (stillExists === false) {
                    link.element.isRegistered = false;
                    link.element.onclick = null;
                    link.element = null;
                } // TODO: what is flink exists but outlet no longer exists...
                return stillExists;
            });
        }
    }, {
        key: 'findRoute',
        value: function findRoute(link) {
            var specifiedRoute = link.url == this._defaultRoute.link ? this._defaultRoute : null;
            var linkParts = link.url.split('/');
            var params = null;

            specifiedRoute = this._routes.find(function (route) {
                var routeLinkParts = route.routeUrl.split('/');
                var doesItMatch = true;
                if (routeLinkParts.length === linkParts.length) {
                    // Does the incomming link have the same number of parts as the route link being examined.
                    params = {};
                    for (var i = 0; i < routeLinkParts.length; i++) {
                        if (linkParts[i] === routeLinkParts[i]) {
                            console.log('these parts match!');
                        } else if (routeLinkParts[i].startsWith(':') === true) {
                            // This would be a route parameter. // TODO make optional params?
                            params[routeLinkParts[i].substring(1)] = linkParts[i];
                        } else {
                            console.log('no route matches!');
                            doesItMatch = false;
                            break;
                        }
                    }
                } else {
                    doesItMatch = false;
                }
                return doesItMatch;
            }, this);

            if (!specifiedRoute) {
                specifiedRoute = this._notFoundRoute;
                params = {
                    linkProvided: link.url
                };
            }

            return {
                route: specifiedRoute,
                params: params
            };
        }
    }, {
        key: 'handleLinkClick',
        value: function handleLinkClick(event) {
            var ele = event.target;
            var link = this._links.find(function (possibleLink) {
                return ele === possibleLink.element;
            });
            var selectedRoute = this.findRoute(link);
            console.log(selectedRoute);
            this.handleRoute(selectedRoute); // TODO: add callback for post processing
        }
    }, {
        key: 'handleRoute',
        value: function handleRoute(selectedRoute) {}
    }, {
        key: 'handleLifeCycleFailure',
        value: function handleLifeCycleFailure(data) {
            // TODO: add on failure callback for route, and potentially check if data passed into here is error based on properties available.
            console.error('A failure occurred in lifecycle chain!', typeof data === 'undefined' ? 'undefined' : _typeof(data), data);
            // return Promise.reject(data);
        }
    }, {
        key: 'registerRoute',
        value: function registerRoute() {
            if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function') {
                this._defaultRoute.events = new _Route.Route('/', arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
            } else if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
                this._routes.push(new _Route.Route(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]));
            }
        }
    }, {
        key: 'unregisterRoute',
        value: function unregisterRoute(routeUrl) {
            if (this._defaultRoute.url == routeLink) {
                this._defaultRoute.events = null;
            } // TODO: Remove routes from array
        }
    }, {
        key: 'getAttributeValueByName',
        value: function getAttributeValueByName(element, attrName) {
            return element.attributes.getNamedItem(attrName).value;
        }
    }]);

    return SimpleRouter;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Link = exports.Link = function Link(element, outlet, clickHandler) {
    _classCallCheck(this, Link);

    this.element = element;
    this.url = this.element.attributes.getNamedItem('route-url').value;
    this.outlet = outlet;
    this.element.onclick = clickHandler;
    this.element.isRegistered = true;
    // let link = ele.attributes.getNamedItem(this._config.linkAttrName).value;
    // let targetName = ele.attributes.getNamedItem(this._config.outletTargetAttrName).value;
    // let targetOutlet = this.findOutletByName(targetName);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = exports.Route = function Route(routeUrl, events, templateUrl) {
    _classCallCheck(this, Route);

    this.routeUrl = routeUrl;
    this.templateUrl = templateUrl;

    this.postRouteProcessing = events.postRouteProcessing;
    this.preFetchContent = events.preFetchContent;
    this.postFetchContent = events.postFetchContent;
    this.handler = events.handler;
    this.preContentLoad = events.preContentLoad;
    this.postContentLoad = events.postContentLoad;
    this.postRouteHandling = events.postRouteHandling;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Outlet = exports.Outlet = function () {
    function Outlet(element, name) {
        _classCallCheck(this, Outlet);

        this.element = element;
        this.name = name;
    }

    _createClass(Outlet, [{
        key: "hasContent",
        value: function hasContent() {
            return this.element.hasChildren();
        }
    }, {
        key: "clearOutlet",
        value: function clearOutlet() {
            this.element.childNodes.forEach(function (child) {
                this.element.removeChild(child);
            }, this);
        }
    }, {
        key: "addContent",
        value: function addContent(content) {
            this.element.appendChild(content);
        }
    }]);

    return Outlet;
}();

/***/ })
/******/ ]);
});