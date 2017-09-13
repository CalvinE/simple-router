import { isHTMLString } from './Helpers';

export class Route {
    /**
     * 
     * @param {string} routeUrl 
     * @param {object} events 
     * @param {string | null} template  
     * @param {string | null} styleUrl  
     * @param {string | null} scriptUrl  
     */
    constructor(routeUrl, events, template = null, styleUrl = null, scriptUrl = null) {
        this.routeUrl = routeUrl;

        this.postRouteProcessing = events.postRouteProcessing;
        this.preFetchContent = events.preFetchContent;
        this.postFetchContent = events.postFetchContent;
        this.handler = events.handler;
        this.preContentLoad = events.preContentLoad;
        this.postContentLoad = events.postContentLoad;
        this.postRouteHandling = events.postRouteHandling;

        let htmlSection = null;
        if(!!template) {
            htmlSection = {};
            if(isHTMLString(template) === true) {
                htmlSection.template = template;
                htmlSection.gathered = true;
            } else {
                htmlSection.url = template;
                htmlSection.gathered = false;
            }
        }

        this.content = {
            html: htmlSection,
            css: (!!styleUrl) ? {
                url: styleUrl,
                gathered: false
            } : null,
            js: (!!scriptUrl) ? {
                url: scriptUrl,
                gathered: false
            } : null
        };
    }
}