import ElementCreator from "../../utils/element-creator.js";
import XylophoneView from "./XylophoneView.js";
import HeaderView from "./headerView.js";
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
    const xylophoneView = new XylophoneView();
    const headerView = new HeaderView();
    main.append(headerView.createView());
    main.append(xylophoneView.createView());
  }
}
