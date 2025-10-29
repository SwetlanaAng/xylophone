import ElementCreator from "../../utils/element-creator.js";
export default class RootView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["root-view"],
    });
  }
  createView() {
    const main = this.getElement();
    document.body.append(main);
  }
}
