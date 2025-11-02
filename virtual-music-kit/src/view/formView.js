import ElementCreator from "../../utils/element-creator.js";
import { KEY_MAP } from "../model/data/keyMap.js";
export default class FormView extends ElementCreator {
  constructor() {
    super({
      tag: "form",
      classNames: ["form"],
    });
    this.onSubmitHandler = null;
    this.keyMap = KEY_MAP;
  }
  onSubmit(handler) {
    this.onSubmitHandler = handler;
  }

  setDisabled(isDisabled) {
    const form = this.getElement();
    const input = form.querySelector(".input");
    const button = form.querySelector(".button");

    input.disabled = isDisabled;
    button.disabled = isDisabled;
    if (isDisabled) {
      form.classList.add("disabled");
    } else {
      form.classList.remove("disabled");
    }
  }

  clearInput() {
    const form = this.getElement();
    const input = form.querySelector(".input");
    if (input) {
      input.value = "";
    }
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
        ["maxlength", "14"],
        ["placeholder", "Your notes"],
      ],
      callback: (e) => {
        let value = e.target.value.replace(/[^A-Za-z]/g, "");

        const availableKeys = Object.keys(this.keyMap);
        value = value
          .split("")
          .filter((char) => {
            const normalizedChar = char.toLowerCase();
            return availableKeys.includes(normalizedChar);
          })
          .join("");

        e.target.value = value;
      },
      eventName: "input",
    });
    const button = new ElementCreator({
      tag: "button",
      classNames: ["button"],
      attributesNames: [["type", "button"]],
      textContent: "Play",
      callback: () => {
        this.onSubmitHandler?.(input.getElement().value);
      },
    });
    form.append(label.getElement());
    form.append(input.getElement());
    form.append(button.getElement());
    return form;
  }
}
