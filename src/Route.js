export class Route {
    constructor(routeUrl, events, templateUrl = null, styleUrl = null, scriptUrl = null) {
        this.routeUrl = routeUrl;

        this.postRouteProcessing = events.postRouteProcessing;
        this.preFetchContent = events.preFetchContent;
        this.postFetchContent = events.postFetchContent;
        this.handler = events.handler;
        this.preContentLoad = events.preContentLoad;
        this.postContentLoad = events.postContentLoad;
        this.postRouteHandling = events.postRouteHandling;

        this.content = {
            html: (templateUrl) ? {
                url: templateUrl,
                gathered: false
            } : null,
            css: (styleUrl) ? {
                url: styleUrl,
                gathered: false
            } : null,
            js: (scriptUrl) ? {
                url: scriptUrl,
                gathered: false
            } : null
        };
    }
}