import ElementCreator from "../../utils/element-creator.js";
import XylophoneView from "./XylophoneView.js";
import HeaderView from "./headerView.js";
export default class RootView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["root-view"],
    });
    this.xylophoneView = new XylophoneView();
  }
  getXylophoneView() {
    return this.xylophoneView;
  }
  createView() {
    const main = this.getElement();
    document.body.append(main);
    const xylophoneView = this.xylophoneView;
    const headerView = new HeaderView();
    main.append(headerView.createView());
    main.append(xylophoneView.createView());
  }
}
