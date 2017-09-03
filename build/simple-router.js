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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfigOptions = {
    linkAttrName: 'route-link', // should be a string
    outletAttrName: 'router-outlet',
    outletTargetAttrName: 'route-target'
};

var SimpleRouter = exports.SimpleRouter = function () {
    function SimpleRouter(config) {
        _classCallCheck(this, SimpleRouter);

        this.config = Object.assign({}, defaultConfigOptions, config);
        this.links = [];
        this.outlets = [];

        this.findLinks();
        this.findOutlets();
    }

    _createClass(SimpleRouter, [{
        key: 'findLinks',
        value: function findLinks() {
            var _this = this;

            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[' + this.config.linkAttrName + ']';
            var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

            baseElement.querySelectorAll(selector).forEach(function (element, index, array) {
                if (!element.isRegistered) {
                    element.isRegistered = true;
                    element.onclick = function (event) {
                        _this.handleLinkClick(event);
                    };
                    _this.links.push(element);
                }
            }, this);
        }
    }, {
        key: 'clearDeadLinks',
        value: function clearDeadLinks() {
            this.links = this.links.filter(function (element, index, array) {
                var stillExists = document.body.contains(element);
                if (stillExists === false) {
                    element.isRegistered = false;
                    element.onclick = null;
                    element = null;
                }
                return stillExists;
            });
        }
    }, {
        key: 'findOutlets',
        value: function findOutlets() {
            var _this2 = this;

            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[' + this.config.outletAttrName + ']';
            var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

            baseElement.querySelectorAll(selector).forEach(function (element, index, array) {
                if (!element.isRegistered) {
                    element.isRegistered = true;
                    _this2.outlets.push(element);
                }
            }, this);
        }
    }, {
        key: 'clearDeadOutlets',
        value: function clearDeadOutlets() {
            this.outlets = this.outlets.filter(function (element, index, array) {
                var stillExists = document.body.contains(element);
                if (stillExists === false) {
                    element.isRegistered = false;
                    element = null;
                }
                return stillExists;
            });
        }
    }, {
        key: 'handleLinkClick',
        value: function handleLinkClick(event) {
            var ele = event.target;
            var link = ele.attributes.getNamedItem(this.config.linkAttrName).value;
            var targetName = ele.attributes.getNamedItem(this.config.outletTargetAttrName).value;
            var targetOutlet = this.findOutletByName(targetName);
            console.log('link clicked.');
        }
    }, {
        key: 'findOutletByName',
        value: function findOutletByName(name) {
            var _this3 = this;

            var outlet = this.outlets.find(function (element) {
                var attr = element.attributes.getNamedItem(_this3.config.outletAttrName);
                return attr && attr.value == name;
            }, this);
            return outlet;
        }
    }]);

    return SimpleRouter;
}();

/***/ })
/******/ ]);
});