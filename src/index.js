import { Link } from './Link';
import { Route } from './Route';
import { Outlet } from './Outlet';
// TODO: Add default routes to outlets as an option. 
class SimpleUIRouter {
	constructor (config) {
		this._config = null;
		this._links = [];
		this._outlets = [];
		this._routes = [];
		this._mainOutlet = null;
		this._loadedURLs = [];
		this._isRouting = false;
		// this._currentState = null;
		// this._routerState = [];
		// this._current = null;
		this._ignoreHashChange = false;
		this._defaultRoute = null;
		this._notFoundRoute = null;
		window.onhashchange = this.onHashChange.bind(this);
	}

	init (config) {
		this._config = config;
		this.findOutlets();
		this.findLinks();
		this._mainOutlet = this.getMainOutlet();

		if (window.location.hash.length === 0) {
			// window.location.hash = '/'; // Route to the default route
			this.onHashChange(this._mainOutlet.defaultRoute || '/');
		} else {
			this.onHashChange(); // Route to whatever is in the url
		}
	}

	onHashChange (event) {
		if (!this._ignoreHashChange) {
			let hash = null; // (typeof event === 'string' || window.location.hash.length === 0) ? '/' : window.location.hash.substring(1);
			if (!!event && typeof event === 'string' && window.location.hash.length === 0) {
				hash = event;
			} else if (window.location.hash.length > 0) {
				hash = window.location.hash.substring(1);
			} else {
				hash = '/';
			}
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
				let defaultRoute = this.getAttributeValueByName(element, 'default-route') || null;
				let outlet = new Outlet(element, this.getAttributeValueByName(element, selector), defaultRoute);
				this._outlets.push(outlet);
			}
		}, this);
		if (!!!this.getMainOutlet()) {
			throw 'A main outlet is required.';
		}
	}

	processDefaultRoutes () {
		this._outlets.forEach((outlet) => {
			if (!!outlet.defaultRouteProcessed === false && outlet.isMain === false) {
				// TODO: route outlet to default route.
				outlet.defaultRouteProcessed = true;
				let link = {
					url: outlet.defaultRoute,
					outlet: outlet
				};
				this.initRouteHandling(link);
			}
		});
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
				if (this.shouldUnloadState(outlet.currentState, null)) {
					outlet.currentState.route.onUnloadState(outlet.currentState);
					outlet.currentState.isUnloaded = true;
				}
			}
			return stillExists;
		});
	}

	shouldUnloadState (state, incomingHTMLContent = null) {
		return !!state && (!!incomingHTMLContent) && state.route.onUnloadState && state.isUnloaded === false;
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
						} else if (routeLinkParts[i].startsWith(':') === true) { // This would be a route parameter. // TODO make optional params?
							params[routeLinkParts[i].substring(1)] = linkParts[i];
						} else {
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
		let outlet = link.outlet ? link.outlet : this._mainOutlet;
		if (outlet === this._mainOutlet) {
			this._ignoreHashChange = true;
			window.location.hash = link.url;
		}
		this.initRouteHandling(link, outlet);
	}

	initRouteHandling (link) {
		this._isRouting = true;
		const selectedRoute = this.findRoute(link);
		const state = {
			link: link,
			// outlet: link.outlet,
			route: selectedRoute.route,
			params: selectedRoute.params,
			routeContent: selectedRoute.route.cloneContent(), // We are cloneing it here so that it can be
			isUnloaded: false
		};

		if (this.shouldUnloadState(state.link.outlet.currentState, state.routeContent.html)) {
			state.link.outlet.currentState.route.onUnloadState(state.link.outlet.currentState);
			state.link.outlet.currentState.isUnloaded = true;
		}
		this.handleRoute(state);
	}

	handleRoute (state, isPrevAction = false) {
		if (state.route.onPostRouteProcessing) {
			state.route.onPostRouteProcessing(state);
		}

		if (this.shouldFetch(state) === true) {
			if (state.route.onPreFetchContent) {
				state.route.onPreFetchContent(state);
			}

			this.fetch(state);
		} else {
			if (state.routeContent.html && state.routeContent.html[0].loaded === true) {
				state.templateTextInstance = state.routeContent.html[0].template;
			}
			this.postFetch(state);
		}
	}

	fetch (state, method = 'GET', headers = null, user = null, password = null) {
		var xhr = new window.XMLHttpRequest();
		xhr.open(method, state.routeContent.html[0].url, true, user, password);
		xhr.onerror = this.handleFetchFailure;
		if (headers) {
			headers.forEach(function (header) {
				xhr.setRequestHeader(header.name, header.value);
			}, this);
		}
		xhr.onreadystatechange = () => {
			if (xhr.readyState === window.XMLHttpRequest.DONE) {
				// TODO: check xhr for info on what was returned.
				state.route.content.html[0].template = xhr.responseText;
				state.route.content.html[0].loaded = true;
				state.templateTextInstance = xhr.responseText;
				state.routeContent.html[0].template = xhr.responseText;
				state.routeContent.html[0].loaded = true;

				if (state.route.onPostFetchContent) {
					state.route.onPostFetchContent(state);
				}
				this.postFetch(state);
			}
		};
		xhr.send();
	}

	handleFetchFailure (evt) {
		throw evt;
	}

	postFetch (state) {
		if (this.shouldLoad(state)) {
			if (state.route.onPreContentLoad) {
				state.route.onPreContentLoad(state);
			}

			this.loadTemplate(state);
			this.load(state);
		} else {
			this.loadTemplate(state);
			this.postLoad(state);
		}
	}

	loadTemplate (state) {
		if (!!state.templateTextInstance) {
			state.tempalteLoaded = true;
			state.link.outlet.addContentString(state.templateTextInstance);
		}
	}

	load (state) {
		let head = document.getElementsByTagName('head')[0];
		let needToWait = false;
		state.didLoad = true;
		const content = state.routeContent;

		if (!state.route.isLoaded('css')) { // Right now we only support css loading via URL.
			needToWait = true;
			for (let i = 0; i < content.css.length; i++) {
				if (content.css[i].loaded === false && this._loadedURLs.indexOf(content.css[i].url) === -1) {
					let link = document.createElement('link');
					link.rel = 'stylesheet';
					link.type = 'text/css';
					link.href = content.css[i].url;
					link.srindex = i;
					link.media = 'all';
					link.onload = () => {
						state.route.content.css[link.srindex].loaded = true;
						state.routeContent.css[link.srindex].loaded = true;
						this._loadedURLs.push(state.routeContent.css[link.srindex].url);
						this.postLoad(state);
					};
					head.appendChild(link);
				}
			}
		}

		if (!state.route.isLoaded('js')) { // Right now we only support js loading via URL.
			needToWait = true;
			for (let i = 0; i < content.js.length; i++) {
				if (content.js[i].loaded === false && this._loadedURLs.indexOf(content.js[i].url) === -1) {
					let script = document.createElement('script');
					script.type = 'application/javascript';
					script.src = content.js[i].url;
					script.srindex = i;
					script.onload = () => {
						state.route.content.js[script.srindex].loaded = true;
						state.routeContent.js[script.srindex].loaded = true;
						this._loadedURLs.push(state.routeContent.js[script.srindex].url);
						this.postLoad(state);
					};
					head.appendChild(script);
				}
			}
		}

		if (!needToWait) {
			this.postLoad(state);
		}
	}

	isRouteContentLoaded (state) {
		var isLoaded = false;
		isLoaded = (state.route.isLoaded('html')) && (state.route.isLoaded('css')) && (state.route.isLoaded('js'));
		// console.log(`${state.route.isLoaded('html')} && ${(state.route.isLoaded('css'))} && ${(state.route.isLoaded('js'))}`);
		return isLoaded;
	}

	isNotLoaded (item) {
		return item.loaded === false;
	}

	postLoad (state) {
		if (this.isRouteContentLoaded(state) === true) {
			// console.log('All content loaded!');
			if (state.didLoad === true && state.route.onPostContentLoad) {
				state.route.onPostContentLoad(state);
			}

			if (state.route.handler) {
				state.route.handler(state);
			}

			// if(!!this._current) {
			//     this._routerState.push(this._current);
			// }

			// this._current = state;
			// console.log(this._routerState, this._current);

			this.findOutlets();
			this.findLinks();
			this.processDefaultRoutes();
			this._mainOutlet = this.getMainOutlet();

			this._isRouting = false;

			if (state.routeContent.html !== null) { // Is this the right criteria for maintaining state.
				state.link.outlet.currentState = state;
			}

			if (state.route.onPostRoutingHandler) {
				state.route.onPostRoutingHandler(state);
			}
		} else {
			// console.log('Still waiting');
		}
	}

	shouldFetch (state) {
		let shouldFetch = false;
		if (state.route.isLoaded('html') === false) {
			shouldFetch = true;
		}
		return shouldFetch;
	}

	shouldLoad (state) {
		let shouldLoad = false;
		if (!!state.templateTextInstance) {
			shouldLoad = true;
		}
		if (state.route.isLoaded('css') === false) {
			shouldLoad = true;
		}
		if (state.route.isLoaded('js') === false) {
			shouldLoad = true;
		}
		return shouldLoad;
	}

	handleLifeCycleFailure (data) {
		// TODO: add on failure callback for route, and potentially check if data passed into here is error based on properties available.
		// console.error('A failure occurred in lifecycle chain!', typeof data, data);
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
		let attr = element.attributes.getNamedItem(attrName);
		return attr ? attr.value : null;
	}
}

export const simpleUIRouter = new SimpleUIRouter();
