export class Link {
    constructor(element, outlet, clickHandler) {
        this.element = element;
        this.outlet = outlet;
        this.element.onclick = clickHandler;
        this.element.isRegistered = true;
        // let link = ele.attributes.getNamedItem(this._config.linkAttrName).value;
        // let targetName = ele.attributes.getNamedItem(this._config.outletTargetAttrName).value;
        // let targetOutlet = this.findOutletByName(targetName);
    }

    getHref () {
        return this.element.attributes.getNamedItem('route-href').value;
    }

    isElementLink (element) {
        return this.element === element;
    }
}