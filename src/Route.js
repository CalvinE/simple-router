export class Route {
    constructor(routeUrl, events, templateUrl) {
        this.routeUrl = routeUrl;
        this.templateUrl = templateUrl;

        this.postRouteProcessing = events.postRouteProcessing;
        this.preFetchContent = events.preFetchContent;
        this.postFetchContent = events.postFetchContent;
        this.handler = events.handler;
        this.preContentLoad = events.preContentLoad;
        this.postContentLoad = events.postContentLoad;
        this.postRouteHandling = events.postRouteHandling;
    }
}