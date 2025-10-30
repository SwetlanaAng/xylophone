export default class XylophoneController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.xylophoneView = view.getXylophoneView();
  }
  init() {
    this.view.createView(); // сюда ноты буду передавать
    this.xylophoneView.onKeyClick((noteId) => {
      this.model.playNoteById(noteId);
    });
    window.addEventListener("keydown", (e) => this.model.playByKey(e.key));
  }
}
