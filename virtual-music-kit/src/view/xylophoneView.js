import ElementCreator from "../../utils/element-creator.js";
import { NOTES } from "../model/data/keys.js";
export default class XylophoneView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["xylophone"],
    });
    this.onKeyClickHandler = null;
  }
  createView() {
    const xylophone = this.getElement();
    this.createKeys(xylophone);
    return xylophone;
  }
  onKeyClick(handler) {
    this.onKeyClickHandler = handler;
  }
  createKeys(xylophone) {
    NOTES.forEach((note) => {
      const keyBox = new ElementCreator({
        tag: "div",
        classNames: [`${note.id}-key-box`, "key-box"],
      });
      const key = new ElementCreator({
        tag: "div",
        classNames: [`${note.id}`, "key"],
        textContent: `${note.label}`,
        callback: () => {
          this.onKeyClickHandler?.(`${note.id}`);
        },
      });
      const keyLabel = new ElementCreator({
        tag: "div",
        classNames: [`${note.id}-label`, "key-label"],
        textContent: `${note.keyLabel}`,
      });
      const keyLabelBox = new ElementCreator({
        tag: "div",
        classNames: ["key-label-box"],
      });
      const editKeyLabel = new ElementCreator({
        tag: "div",
        classNames: [`${note.id}-edit-label`, "edit-key-label"],
      });
      const editIcon = new ElementCreator({
        tag: "img",
        classNames: ["edit-img"],
        attributesNames: [["src", "/assets/editIcon.png"]],
      });

      editKeyLabel.addInnerElement(editIcon);
      keyLabelBox.addInnerElement(keyLabel);
      keyLabelBox.addInnerElement(editKeyLabel);
      keyBox.addInnerElement(key);
      keyBox.addInnerElement(keyLabelBox);
      xylophone.append(keyBox.getElement());
    });
  }
}
