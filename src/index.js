const defaultConfigOptions = {
    linkAttrName: 'route-link', // should be a string
    outletAttrName: 'router-outlet', // should be a string
    outletTargetAttrName: 'route-target' // should be a string
}

const defaultEventObject = {
    postRouteProcessing: (data) => {
        data.incrementor = 0;
        return Promise.resolve(data);
    },
    preContentFetch: (data) => {
        data.incrementor = 1;
        return Promise.resolve(data);
    },
    postContentFetch: (data) => {
        data.incrementor = 2;
        return Promise.resolve(data);
    },
    handler: (data) => {
        data.incrementor = 3;
        return Promise.resolve(data);
    },
    preContentLoad: (data) => {
        data.incrementor = 4;
        return Promise.resolve(data);
    },
    postContentLoad: (data) => {
        data.incrementor = 5;
        return Promise.resolve(data);
    },
    postLinkHandle: (data) => {
        data.incrementor = 6;
        return Promise.resolve(data);
    }    
};

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
        this._routes = [];

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
    
    handleLinkClick (event) {
        let ele = event.target;
        let link = ele.attributes.getNamedItem(this._config.linkAttrName).value;
        let targetName = ele.attributes.getNamedItem(this._config.outletTargetAttrName).value;
        let targetOutlet = this.findOutletByName(targetName);
        const selectedRoute = this.findRoute(ele, link, targetOutlet);
        selectedRoute.targetOutlet = targetOutlet;
        console.log(selectedRoute);
        this.handleRoute(selectedRoute).then((data) => {
            console.log('handle route is complete.', data);    
        }, (data) => this.handleLifeCycleFailure(data)
        )['catch']((data) => {
            console.log('an exception was thrown in the life cycle chain.', arguments);  
        });        
    }

    handleRoute (selectedRoute) {
        let data = {
            params: selectedRoute.params
        }
        let route = selectedRoute.route;
        return new Promise((resolve, reject) => {
            route.events.postRouteProcessing(data).then((data) => {
                route.events.preContentFetch(data).then((data) => {
                    // throw 'ex';
                    route.events.postContentFetch(data).then((data) => {
                        route.events.handler(data).then((data) => {
                            route.events.preContentLoad(data).then((data) => {
                                route.events.postContentLoad(data).then((data) => {
                                    route.events.postLinkHandle(data).then((data) => {
                                        let x = route.fake.faker;
                                        return resolve(data);
                                    }, (data) => reject(data)).catch((data) => reject(data));
                                }, (data) => reject(data)).catch((data) => reject(data));                                
                            }, (data) => reject(data)).catch((data) => reject(data));
                        }, (data) => reject(data)).catch((data) => reject(data));
                    }, (data) => reject(data)).catch((data) => reject(data));
                }, (data) => reject(data)).catch((data) => reject(data));
            }, (data) => reject(data)).catch((data) => reject(data));
         });
    }

    handleLifeCycleFailure(data) {
        // TODO: add on failure callback for route, and potentially check if data passed into here is error based on properties available.
        console.error('A failure occurred in lifecycle chain!', typeof data, data);
        // return Promise.reject(data);
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
                events: Object.assign({}, defaultEventObject, args[1]) // TODO: if there are no handlers provided in the events object then throw exception.
            });
        }
    }

    unregisterRoute (routeLink) {
        if (this._defaultHandler.link == routeLink) {
            this._defaultHandler.events = null;
        } // TODO: Remove routes from array
    }
}