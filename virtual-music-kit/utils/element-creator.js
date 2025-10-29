export default class ElementCreator {
  constructor(parameters) {
    this.createElement(parameters);
    this.element = this.getElement();
  }

  getElement() {
    return this.element;
  }

  addInnerElement(element) {
    this.element.append(element.getElement());
  }

  createElement(parameters) {
    this.element = document.createElement(parameters.tag);
    if (parameters.classNames) this.setCssClasses(parameters.classNames);
    if (parameters.attributesNames)
      this.setAttributes(parameters.attributesNames);
    if (parameters.textContent) this.setTextContent(parameters.textContent);
    if (parameters.callback)
      this.setCallback(parameters.callback, parameters.eventName);
  }

  setCssClasses(cssClasses) {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  setAttributes(attributesNames) {
    attributesNames.map((item) => this.element.setAttribute(item[0], item[1]));
  }

  setTextContent(text) {
    this.element.textContent = text;
  }

  setCallback(callback, eventName = "click") {
    this.element.addEventListener(eventName, (event) => callback(event));
  }
}
