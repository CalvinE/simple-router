export class Outlet {
    constructor (element, name) {
        this.element = element;
        this.name = name;
    }

    hasContent () {
        return this.element.hasChildren();
    }

    clearOutlet () {
        this.element.childNodes.forEach(function(child) {
            this.element.removeChild(child);
        }, this);
    }

    addContent(content) {
        this.element.appendChild(content);
    }
}