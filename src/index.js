import { Link } from './Link';
import { Route } from './Route';
import { Outlet } from './Outlet'
// TODO: Add default routes to outlets as an option. 
export class SimpleRouter {
    constructor(config) {
        this._config = config; //Object.assign({}, defaultConfigOptions, config);
        this._links = [];
        this._outlets = [];
        this._routes = [];
        this.current = null;
        this._defaultRoute = new Route('/', {
            handler: () => {}
        }, null);
        this._notFoundRoute = new Route(null, {
            handler: () => {}
        }, '');

        this.findOutlets();
        this.findLinks();

    }

    findOutlets(selector = 'router-outlet', baseElement = document) {
        this.clearDeadOutlets();
        baseElement.querySelectorAll(`[${selector}]`).forEach((element, index, array) => {
            if (!element.isRegistered) {
                element.isRegistered = true;
                this._outlets.push(new Outlet(element, this.getAttributeValueByName(element, selector)));
            }
        }, this);
    }

    clearDeadOutlets() {
        this._outlets = this._outlets.filter((outlet, index, array) => {
            const stillExists = document.body.contains(outlet.element);
            if (stillExists === false) {
                outlet.element.isRegistered = false;
                outlet.element = null;
            }
            return stillExists;
        });
    }

    findOutletByName(name) {
        var outlet = this._outlets.find((possibleOutlet) => {
            return (possibleOutlet.name == name);
        }, this);
        return outlet;
    }

    findLinks(selector = 'route-url', baseElement = document) {
        this.clearDeadLinks();
        baseElement.querySelectorAll(`[${selector}]`).forEach((element) => {
            if (!element.isRegistered) {
                this._links.push(new Link(element, this.findOutletByName(this.getAttributeValueByName(element, 'route-target')), this.handleLinkClick.bind(this)));
            }
        }, this);
    }

    clearDeadLinks() {
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

    findRoute(link) {
        let specifiedRoute = (link.url == this._defaultRoute.link) ? this._defaultRoute : null;
        const linkParts = link.url.split('/');
        let params = null;

        specifiedRoute = this._routes.find((route) => {
            const routeLinkParts = route.routeUrl.split('/');
            let doesItMatch = true;
            if (routeLinkParts.length === linkParts.length) { // Does the incomming link have the same number of parts as the route link being examined.
                params = {};
                for (let i = 0; i < routeLinkParts.length; i++) {
                    if (linkParts[i] === routeLinkParts[i]) {
                        console.log('these parts match!')
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

        if (!specifiedRoute) {
            specifiedRoute = this._notFoundRoute;
            params = {
                linkProvided: link.url
            }
        }

        return {
            route: specifiedRoute,
            params: params
        };
    }

    handleLinkClick(event) {
        let ele = event.target;
        let link = this._links.find((possibleLink) => {
            return ele === possibleLink.element;
        });
        const selectedRoute = this.findRoute(link);
        console.log(selectedRoute);
        this.handleRoute(selectedRoute); // TODO: add callback for post processing
    }

    handleRoute(selectedRoute) {

    }

    handleLifeCycleFailure(data) {
        // TODO: add on failure callback for route, and potentially check if data passed into here is error based on properties available.
        console.error('A failure occurred in lifecycle chain!', typeof data, data);
        // return Promise.reject(data);
    }

    registerRoute(...args) {
        if (typeof args[0] === 'function') {
            this._defaultRoute.events = new Route('/', args[0], args[1])
        } else if (typeof args[0] === 'string') {
            this._routes.push(
                new Route(args[0], args[1], args[2])
            );
        }
    }

    unregisterRoute(routeUrl) {
        if (this._defaultRoute.url == routeLink) {
            this._defaultRoute.events = null;
        } // TODO: Remove routes from array
    }

    getAttributeValueByName (element, attrName) {
        return element.attributes.getNamedItem(attrName).value;
    }
}