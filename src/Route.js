const defaultEvents = {
    postRouteProcessing: (callback) => {

    }

}

export class Route {
    constructor(href, events, isDefaultRoute = false, isNotFoundRoute = false;) {
        this.href = href;
        this.isDefaultRoute = isDefaultRoute;
        this.isNotFoundRoute = isNotFoundRoute;

        this.postRouteProcessing = events.postRouteProcessing || ((data) => {
            return this.preFetchContent(data);
        });

        this.preFetchContent = events.preFetchContent || ((data) => {
            return this.postFetchContent(data);
        });

        this.postFetchContent = events.postFetchContent || ((data) => {
            return this.handler(data);
        });

        this.handler = events.handler || ((data) => {
            return this.preContentLoad(data);
        });

        this.preContentLoad = events.preContentLoad || ((data) => {
            return this.postContentLoad(data);
        });

        this.postContentLoad = events.postContentLoad || ((data) => {
            return this.postRouteHandling(data);
        });

        this.postRouteHandling = events.postRouteHandling || ((data) => {
            return data;
        });
    }
}