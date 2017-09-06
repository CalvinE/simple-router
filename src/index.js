const defaultConfigOptions = {
    linkAttrName: 'route-link', // should be a string
    outletAttrName: 'router-outlet', // should be a string
    outletTargetAttrName: 'route-target' // should be a string
}

export class SimpleRouter {
    constructor (config) {
        this._config = Object.assign({}, defaultConfigOptions, config);
        this._links = [];
        this._outlets = [];
        this._defaultRoute = {
            link: '/',
            handlers: {}
        };
        this._notFoundRoute = {
            link: null,
            handlers: {}
        };
        this._routes = {};

        this.findLinks();
        this.findOutlets();
    }

    findLinks (selector = `[${this._config.linkAttrName}]`, baseElement = document) {
        this.clearDeadLinks();
        baseElement.querySelectorAll(selector).forEach((element, index, array) => {
            if (!element.isRegistered) {
                element.isRegistered = true;
                element.onclick = (event) => {
                    this.handleLinkClick(event);
                };
                this._links.push(element);
            }
        }, this);
    }

    clearDeadLinks () {
        this._links = this._links.filter((element, index, array) => {
            const stillExists = document.body.contains(element);
            if (stillExists === false) {
                element.isRegistered = false;
                element.onclick = null;
                element = null;
            }
            return stillExists;
        });        
    }

    findOutlets (selector = `[${this._config.outletAttrName}]`, baseElement = document) {
        this.clearDeadOutlets();
        baseElement.querySelectorAll(selector).forEach((element, index, array) => {
            if (!element.isRegistered) {
                element.isRegistered = true;
                this._outlets.push(element);
            }
        }, this);
    }
    
    clearDeadOutlets () {
        this._outlets = this._outlets.filter((element, index, array) => {
            const stillExists = document.body.contains(element);
            if (stillExists === false) {
                element.isRegistered = false;
                element = null;
            }
            return stillExists;
        });        
    }

    handleLinkClick (event) {
        let ele = event.target;
        let link = ele.attributes.getNamedItem(this._config.linkAttrName).value;
        let targetName = ele.attributes.getNamedItem(this._config.outletTargetAttrName).value;
        let targetOutlet = this.findOutletByName(targetName);
        const route = this.findRoute(ele, link, targetOutlet);
        console.log(route);
    }

    findRoute (element, link, targetOutlet) {
        let specifiedRoute = (link == this._defaultRoute.link) ? this._defaultRoute : null;
        const linkParts = link.split('/');
        let params = null;

        specifiedRoute = this._routes.find((route) => {
            const routeLinkParts = route.href.split('/');
            let doesItMatch = true;
            if(routeLinkParts.length === linkParts.length) { // Does the incomming link have the same number of parts as the route link being examined.
                params = {};
                for(let i = 0; i < routeLinkParts.length; i++) {
                    if(linkParts[i] === routeLinkParts[i]) {
                        console.log('these parts match!')
                    } else if (routeLinkParts[i].startsWith(':') === true) { // This would be a route parameter. // TODO make optional params?
                        params[routeLinkParts[i].substring(1)] = linkParts[i];
                    } else {
                        console.log('no route matches!');
                        doesItMatch = false;
                        break;
                    }
                }
            }
            return doesItMatch;
        }, this);

        if(!specifiedRoute) {
            specifiedRoute = this._notFoundRoute;
            params = {
                linkProvided: link
            }
        }

        return {
            route: specifiedRoute,
            params: params
        };
    }

    handleRoute (route) {

    }

    findOutletByName (name) {        
        var outlet = this._outlets.find((element) => {
            const attr = element.attributes.getNamedItem(this._config.outletAttrName);
            return (attr && attr.value == name);
        }, this);
        return outlet;
    }



    registerRoute (...args) {
        if(typeof args[0] === 'function') {
            this._defaultHandler.events = args[0];
        } else if (typeof args[0] === 'string') {
            this._routes.push({
                href: args[0],
                events: args[1] // TODO: if there are no handlers provided in the events object then throw exception.
            });
        }
    }

    unregisterRoute (routeLink) {
        if (this._defaultHandler.link == routeLink) {
            this._defaultHandler.events = null;
        } // TODO: Remove routes from array
    }
}