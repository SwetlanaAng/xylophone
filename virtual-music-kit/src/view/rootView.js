import ElementCreator from "../../utils/element-creator.js";
import XylophoneView from "./xylophoneView.js";
import HeaderView from "./headerView.js";
import FormView from "./formView.js";
export default class RootView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["root-view"],
    });
    this.xylophoneView = new XylophoneView();
    this.formView = new FormView();
    this.header = new HeaderView();
  }
  getXylophoneView() {
    return this.xylophoneView;
  }
  getFormView() {
    return this.formView;
  }
  createView() {
    const main = this.getElement();
    document.body.append(main);
    const headerView = this.header.createView();
    headerView.append(this.formView.createView());
    main.append(headerView);
    main.append(this.xylophoneView.createView());
  }
}
