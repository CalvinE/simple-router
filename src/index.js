const defaultConfigOptions = {
    linkAttrName: 'route-link', // should be a string
    outletAttrName: 'router-outlet',
    outletTargetAttrName: 'route-target'
}

export class SimpleRouter {
    constructor (config) {
        this.config = Object.assign({}, defaultConfigOptions, config);
        this.links = [];
        this.outlets = [];

        this.findLinks();
        this.findOutlets();
    }

    findLinks (selector = `[${this.config.linkAttrName}]`, baseElement = document) {
        baseElement.querySelectorAll(selector).forEach((element, index, array) => {
            if (!element.isRegistered) {
                element.isRegistered = true;
                element.onclick = (event) => {
                    this.handleLinkClick(event);
                };
                this.links.push(element);
            }
        }, this);
    }

    clearDeadLinks () {
        this.links = this.links.filter((element, index, array) => {
            const stillExists = document.body.contains(element);
            if (stillExists === false) {
                element.isRegistered = false;
                element.onclick = null;
                element = null;
            }
            return stillExists;
        });        
    }

    findOutlets (selector = `[${this.config.outletAttrName}]`, baseElement = document) {
        baseElement.querySelectorAll(selector).forEach((element, index, array) => {
            if (!element.isRegistered) {
                element.isRegistered = true;
                this.outlets.push(element);
            }
        }, this);
    }
    
    clearDeadOutlets () {
        this.outlets = this.outlets.filter((element, index, array) => {
            const stillExists = document.body.contains(element);
            if (stillExists === false) {
                element.isRegistered = false;
                element = null;
            }
            return stillExists;
        });        
    }

    handleLinkClick (event) {
        let ele = event.target;
        let link = ele.attributes.getNamedItem(this.config.linkAttrName).value;
        let targetName = ele.attributes.getNamedItem(this.config.outletTargetAttrName).value;
        let targetOutlet = this.findOutletByName(targetName);
        console.log('link clicked.');
    }

    findOutletByName (name) {        
        var outlet = this.outlets.find((element) => {
            const attr = element.attributes.getNamedItem(this.config.outletAttrName);
            return (attr && attr.value == name);
        }, this);
        return outlet;
    }
}