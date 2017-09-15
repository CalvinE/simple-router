import { Link } from './Link';
import { Route } from './Route';
import { Outlet } from './Outlet';
// TODO: Add default routes to outlets as an option. 
export class SimpleRouter {
	constructor (config) {
		this._config = config;
		this._links = [];
		this._outlets = [];
		this._routes = [];
		// this._routerState = [];
		// this._current = null;
		this._ignoreHashChange = false;
		this._defaultRoute = null;
		this._notFoundRoute = null;
		window.onhashchange = this.onHashChange.bind(this);
		this.findOutlets();
		this.findLinks();

		this._mainOutlet = this.getMainOutlet();
	}

	init () {
		if (window.location.hash.length === 0) {
			// window.location.hash = '/'; // Route to the default route
			this.onHashChange('/');
		} else {
			this.onHashChange(); // Route to whatever is in the url
		}
	}

	onHashChange (event) {
		if (!this._ignoreHashChange) {
			let hash = (typeof event === 'string' || window.location.hash.length === 0) ? '/' : window.location.hash.substring(1);
			let link = {
				url: hash,
				outlet: this._mainOutlet
			};
			this.initRouteHandling(link);
		} else {
			this._ignoreHashChange = false;
		}
	}

	findOutlets (selector = 'router-outlet', baseElement = document) {
		this.clearDeadOutlets();
		baseElement.querySelectorAll(`[${selector}]`).forEach((element, index, array) => {
			if (!element.isRegistered) {
				element.isRegistered = true;
				this._outlets.push(new Outlet(element, this.getAttributeValueByName(element, selector)));
			}
		}, this);
		if (!!!this.getMainOutlet()) {
			throw 'A main outlet is required.';
		}
	}

	getMainOutlet () {
		return this._outlets.find((item) => {
			return item.isMain === true;
		});
	}

	clearDeadOutlets () {
		this._outlets = this._outlets.filter((outlet, index, array) => {
			const stillExists = document.body.contains(outlet.element);
			if (stillExists === false) {
				outlet.element.isRegistered = false;
				outlet.element = null;
			}
			return stillExists;
		});
	}

	findOutletByName (name) {
		var outlet = this._outlets.find((possibleOutlet) => {
			return (possibleOutlet.name === name);
		}, this);
		return outlet;
	}

	findLinks (selector = 'route-url', baseElement = document) {
		this.clearDeadLinks();
		baseElement.querySelectorAll(`[${selector}]`).forEach((element) => {
			if (!element.isRegistered) {
				let targetOutlet = this.findOutletByName(this.getAttributeValueByName(element, 'route-target')) || this.getMainOutlet();
				this._links.push(new Link(element, targetOutlet, this.handleLinkClick.bind(this)));
			}
		}, this);
	}

	clearDeadLinks () {
		this._links = this._links.filter((link) => {
			const stillExists = document.body.contains(link.element);
			if (stillExists === false) {
				link.element.isRegistered = false;
				link.element.onclick = null;
				link.element = null;
			} // TODO: what is flink exists but outlet no longer exists...
			return stillExists;
		});
	}

	findRoute (link) {
		let specifiedRoute = (link.url === this._defaultRoute.link) ? this._defaultRoute : null;
		const linkParts = link.url.split('/');
		let params = null;

		if (link.url === '/') {
			specifiedRoute = this._defaultRoute;
		} else {
			specifiedRoute = this._routes.find((route) => {
				const routeLinkParts = route.routeUrl.split('/');
				let doesItMatch = true;
				if (routeLinkParts.length === linkParts.length) { // Does the incomming link have the same number of parts as the route link being examined.
					params = {};
					for (let i = 0; i < routeLinkParts.length; i++) {
						if (linkParts[i] === routeLinkParts[i]) {
							console.log('these parts match!');
						} else if (routeLinkParts[i].startsWith(':') === true) { // This would be a route parameter. // TODO make optional params?
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
		}

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

	handleLinkClick (event) {
		event.preventDefault();
		let ele = event.target;
		let link = this._links.find((possibleLink) => {
			return ele === possibleLink.element;
		});
		if (link.outlet === this._mainOutlet) {
			this._ignoreHashChange = true;
			window.location.hash = link.url;
		}
		this.initRouteHandling(link);
	}

	initRouteHandling (link) {
		const selectedRoute = this.findRoute(link);
		const state = {
			link: link,
			route: selectedRoute.route,
			params: selectedRoute.params
		};
		this.handleRoute(state);
	}

	handleRoute (state, isPrevAction = false) {
		if (state.route.postRouteProcessing) {
			state.route.postRouteProcessing(state);
		}

		if (this.shouldFetch(state) === true) {
			if (state.route.preFetchContent) {
				state.route.preFetchContent(state);
			}

			this.fetch(state);
		} else {
			state.templateTextInstance = state.route.content.html.template;
			this.postFetch(state);
		}
	}

	fetch (state, method = 'GET', headers = null, user = null, password = null) {
		var xhr = new window.XMLHttpRequest();
		xhr.open(method, state.route.content.html.url, true, user, password);
		xhr.onerror = this.handleFetchFailure;
		if (headers) {
			headers.forEach(function (header) {
				xhr.setRequestHeader(header.name, header.value);
			}, this);
		}
		xhr.onreadystatechange = () => {
			if (xhr.readyState === window.XMLHttpRequest.DONE) {
				// TODO: check xhr for info on what was returned.
				state.route.content.html.template = xhr.responseText;
				state.route.content.html.loaded = true;
				state.templateTextInstance = xhr.responseText;
				this.postFetch(state);
			}
		};
		xhr.send();
	}

	handleFetchFailure (evt) {
		throw evt;
	}

	postFetch (state) {
		if (state.route.postFetchContent) {
			state.route.postFetchContent(state);
		}

		if (this.shouldLoad(state)) {
			if (state.route.preContentLoad) {
				state.route.preContentLoad(state);
			}

			this.load(state);
		} else {
			this.postLoad(state);
		}
	}

	load (state) {
		let head = document.getElementsByTagName('head')[0];
		let needToWait = false;
		if (!!state.templateTextInstance) {
			state.link.outlet.addContentString(state.templateTextInstance);
		}

		const content = state.route.content;

		if (!!content.css && !content.css.loaded) { // Right now we only support css loading via URL.
			needToWait = true;
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = content.css.url;
			link.media = 'all';
			link.onload = () => {
				state.route.content.css.loaded = true;
				this.postLoad(state);
			};
			head.appendChild(link);
		}

		if (!!content.js && !content.js.loaded) { // Right now we only support js loading via URL.
			needToWait = true;
			let js = document.createElement('script');
			js.type = 'application/javascript';
			js.src = content.js.url;
			js.onload = () => {
				state.route.content.js.loaded = true;
				this.postLoad(state);
			};
			head.appendChild(js);
		}

		if (!needToWait) {
			this.postLoad(state);
		}
	}

	postLoad (state) {
		const content = state.route.content;
		if ((!content.html || content.html.loaded) && (!content.css || content.css.loaded) && (!content.js || content.js.loaded)) {
			if (state.route.postContentLoad) {
				state.route.postContentLoad(state);
			}

			if (state.route.handler) {
				state.route.handler(state);
			}

			// if(!!this._current) {
			//     this._routerState.push(this._current);
			// }

			// this._current = state;
			// console.log(this._routerState, this._current);

			if (state.route.postLinkHandler) {
				state.route.postLinkHandler(state);
			}
		} else {
			console.log('Still waiting');
		}
	}

	shouldFetch (state) {
		let shouldFetch = false;
		const content = state.route.content;
		if (!!content.html && !!content.html.url && !content.html.loaded) {
			shouldFetch = true;
		}
		return shouldFetch;
	}

	shouldLoad (state) {
		let shouldLoad = false;
		const content = state.route.content;
		if (!!state.templateTextInstance) {
			shouldLoad = true;
		}
		if (!shouldLoad && !!content.css && !!content.css.url) {
			shouldLoad = true;
		}
		if (!shouldLoad && !!content.js && !!content.js.url) {
			shouldLoad = true;
		}
		return shouldLoad;
	}

	handleLifeCycleFailure (data) {
		// TODO: add on failure callback for route, and potentially check if data passed into here is error based on properties available.
		console.error('A failure occurred in lifecycle chain!', typeof data, data);
		// return Promise.reject(data);
	}

	registerRoute (...args) {
		if (typeof args[0] === 'object' && args[0] !== null) {
			this._defaultRoute = new Route('/', args[0], args[1], args[2], args[3]);
		} else if (typeof args[0] === 'string') {
			this._routes.push(
				new Route(args[0], args[1], args[2], args[3], args[4])
			);
		} else if (args[0] === null) {
			this._notFoundRoute = new Route(args[0], args[1], args[2], args[3], args[4]);
		}
	}

	unregisterRoute (routeUrl) {
		if (this._defaultRoute.url === routeUrl) {
			this._defaultRoute.events = null;
		} // TODO: Remove routes from array
	}

	getAttributeValueByName (element, attrName) {
		return element.attributes.getNamedItem(attrName).value;
	}
}
