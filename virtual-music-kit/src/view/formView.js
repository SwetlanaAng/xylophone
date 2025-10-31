import ElementCreator from "../../utils/element-creator.js";
export default class FormView extends ElementCreator {
  constructor() {
    super({
      tag: "form",
      classNames: ["form"],
    });
  }
  createView() {
    const form = this.getElement();
    const label = new ElementCreator({
      tag: "label",
      classNames: ["label"],
      attributesNames: [["for", "input"]],
      textContent: "Enter the sequence of notes",
    });
    const input = new ElementCreator({
      tag: "input",
      classNames: ["input"],
      attributesNames: [
        ["id", "input"],
        ["type", "text"],
        ["placeholder", "Your notes"],
      ],
      callback: (e) =>{
        
      }
      eventName: "input"
    });
    const button = new ElementCreator({
      tag: "button",
      classNames: ["button"],
      attributesNames: [["type", "button"]],
      textContent: "Play",
    });
    form.append(label.getElement());
    form.append(input.getElement());
    form.append(button.getElement());
    return form;
  }
}
