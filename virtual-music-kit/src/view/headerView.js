import ElementCreator from "../../utils/element-creator.js";
import FormView from "./formView.js";
export default class HeaderView extends ElementCreator {
  constructor() {
    super({
      tag: "header",
      classNames: ["header"],
    });
  }
  createView() {
    const header = this.getElement();
    const headingBox = new ElementCreator({
      tag: "div",
      classNames: ["heading-box"],
    });
    const heading = new ElementCreator({
      tag: "h1",
      classNames: ["h1"],
      textContent: "Virtual Music Kit",
    });
    const instrument = new ElementCreator({
      tag: "h3",
      classNames: ["h3"],
      textContent: "Xylophone",
    });
    const form = new FormView();
    headingBox.addInnerElement(heading);
    headingBox.addInnerElement(instrument);

    header.append(headingBox.getElement());
    header.append(form.createView());
    return header;
  }
}
