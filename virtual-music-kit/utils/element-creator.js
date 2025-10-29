export default class ElementCreator {
    
    constructor(parameters) {
        this.createElement(parameters);
        this.element = this.getElement();
    }

    getElement(){
        return this.element;
    }

    addInnerElement(element) {
        this.element.append(element.getElement());
    }

    createElement(parameters){
        this.element = document.createElement(parameters.tag);
        this.setCssClasses(parameters.classNames);
        this.setAttributes(parameters.attributesNames);
        this.setTextContent(parameters.textContent);
        this.setCallback(parameters.callback, parameters.eventName);
    }

    setCssClasses(cssClasses){
        cssClasses.map((cssClass) => this.element.classList.add(cssClass));
    }

    setAttributes(attributesNames){
        attributesNames.map((item) => this.element.setAttribute(item[0], item[1]));
    }

    setTextContent(text){
        this.element.textContent = text;
    }

    setCallback(callback, eventName = 'click'){
            this.element.addEventListener(eventName, (event) => callback(event));
    }
}