import { isHTMLString } from './Helpers';

export class Route {
	/**
     * 
     * @param {string} routeUrl 
     * @param {object} events 
     * @param {string | DOMElement | null} template  
     * @param {string | array<string> | null} styleUrl  
     * @param {string | array<string> | null} scriptUrl  
     */
	constructor (routeUrl, events, template = null, styleData = null, scriptData = null) {
		this.routeUrl = routeUrl;

		this.onPostRouteProcessing = events.onPostRouteProcessing;
		this.onPreFetchContent = events.onPreFetchContent;
		this.onPostFetchContent = events.onPostFetchContent;
		this.handler = events.handler;
		this.onPreContentLoad = events.onPreContentLoad;
		this.onPostContentLoad = events.onPostContentLoad;
		this.onPostRoutingHandler = events.onPostRoutingHandler;
		this.onUnloadState = events.onUnloadState;

		let htmlSection = null;
		let cssSection = null;
		let scriptSection = null;

		if (!!template) {
			if (Array.isArray(template)) {
				throw 'Parameter template can not be an array.';
			}
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

		if (!!styleData) {
			cssSection = [];
			if (Array.isArray(styleData)) {
				styleData.forEach((url) => {
					cssSection.push({
						url: url,
						loaded: false
					});
				});
			} else {
				cssSection.push({
					url: styleData,
					loaded: false
				});
			}
		}

		if (!!scriptData) {
			scriptSection = [];
			if (Array.isArray(scriptData)) {
				scriptData.forEach((url) => {
					scriptSection.push({
						url: url,
						loaded: false
					});
				});
			} else {
				scriptSection.push({
					url: scriptData,
					loaded: false
				});
			}
		}

		this.content = {
			html: !!htmlSection ? [htmlSection] : null,
			css: cssSection,
			js: scriptSection
		};
	}

	isLoaded (prop) {
		return (!this.content[prop]) || (!!this.content[prop] && !this.content[prop].find((item) => { return item.loaded === false; }));
	}
}
