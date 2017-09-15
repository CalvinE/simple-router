export class Link {
	constructor (element, outlet, clickHandler) {
		this.element = element;
		this.url = this.element.attributes.getNamedItem('route-url').value;
		this.outlet = outlet;
		this.element.onclick = clickHandler;
		// this.element.href += this.url;
		this.element.isRegistered = true;
		// let link = ele.attributes.getNamedItem(this._config.linkAttrName).value;
		// let targetName = ele.attributes.getNamedItem(this._config.outletTargetAttrName).value;
		// let targetOutlet = this.findOutletByName(targetName);
	}
}
