export class Outlet {
	constructor (element, name, defaultRoute) {
		this.element = element;
		this.name = name;
		this.isMain = name === 'main';
		this.defaultRoute = defaultRoute;
		this.loaded = false;
		this.defaultRouteProcessed = (!!defaultRoute) ? false : null;
		this.currentState = null;
	}

	hasContent () {
		return this.element.children.length !== 0;
	}

	clearOutlet () {
		while (this.element.children.length > 0) {
			this.element.removeChild(this.element.children[0]);
		}
	}

	addContentString (content) {
		this.element.innerHTML = content;
	}

	addContent (content) {
		this.element.appendChild(content);
	}
}
