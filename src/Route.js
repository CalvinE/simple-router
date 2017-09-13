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
            if (template.innerHTML && isHTMLString(template.innerHTML) === true) { // Handle template objects being pased in the form of say a script tag with content inside of it.
                htmlSection.template = template.innerHTML;
                htmlSection.loaded = true;
            } else if (isHTMLString(template) === true) { // Handle a string HTML template
                htmlSection.template = template;
                htmlSection.loaded = true;
            } else { // Handle a URL which will need to be fetched upon routing.
                htmlSection.url = template;
                htmlSection.loaded = false;
            }
        }

        this.content = {
            html: htmlSection,
            css: (!!styleUrl) ? {
                url: styleUrl,
                loaded: false
            } : null,
            js: (!!scriptUrl) ? {
                url: scriptUrl,
                loaded: false
            } : null
        };
    }
}