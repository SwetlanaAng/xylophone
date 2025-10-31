import ElementCreator from "../../utils/element-creator.js";
import { NOTES } from "../model/data/keys.js";
import { KEY_MAP } from "../model/data/keyMap.js";
import { clearElement } from "../../utils/functions.js";

export default class XylophoneView extends ElementCreator {
  constructor() {
    super({
      tag: "div",
      classNames: ["xylophone"],
    });
    this.onKeyClickHandler = null;
    this.onEditKeyLabelClickHandler = null;
    this.editingNoteId = null;
    this.notes = NOTES;
    this.keyMap = KEY_MAP;
    this.editMode = false;
  }

  replaceKeyLabel(noteId, newLabel, currentKeyLabel) {
    if (newLabel && !this.keyMap[newLabel]) {
      this.notes.find((note) => note.id === noteId).keyLabel = newLabel;
      delete this.keyMap[currentKeyLabel];
      this.keyMap[newLabel] = noteId;
      return true;
    }
    return false;
  }

  enterEditMode(noteId, currentChar) {
    this.editMode = true;
    this.editingNoteId = noteId;
    const currentKeyLabel = Object.keys(this.keyMap).find(
      (k) => this.keyMap[k] === noteId,
    );

    const keyLabelBox = this.getElement().querySelector(
      `.${noteId}-key-label-box`,
    );
    const labelEl = this.getElement().querySelector(`.${noteId}-label`);
    const editIcon = keyLabelBox.querySelector(`.${noteId}-edit-label`);
    if (!labelEl) return;
    clearElement(keyLabelBox);

    const input = new ElementCreator({
      tag: "input",
      classNames: ["input-edit"],
      attributesNames: [
        ["id", "input-edit"],
        ["type", "text"],
        ["maxlength", "1"],
        ["value", currentChar || ""],
      ],
    });
    keyLabelBox.append(input.getElement());

    const inp = input.getElement();
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearElement(keyLabelBox);
        this.replaceKeyLabel(noteId, e.target.value, currentKeyLabel);
        const { keyLabel, editKeyLabel } =
          this.createKeyLabelBoxContent(noteId);
        keyLabelBox.append(keyLabel.getElement());
        keyLabelBox.append(editKeyLabel.getElement());
        this.editMode = false;
      }
      if (e.key === "Escape") {
        clearElement(keyLabelBox);
        const { keyLabel, editKeyLabel } =
          this.createKeyLabelBoxContent(noteId);
        keyLabelBox.append(keyLabel.getElement());
        keyLabelBox.append(editKeyLabel.getElement());
        this.editMode = false;
      }
    });
    inp.addEventListener("input", (e) => {
      const keys = Object.keys(this.keyMap).join("");
      const regex = new RegExp(`[${keys}]`, "g");
      e.target.value = e.target.value.replace(regex, "");
      e.target.value = e.target.value.replace(/[^A-Za-z]/g, "");
    });
  }

  createView() {
    const xylophone = this.getElement();
    this.createKeys(xylophone);
    return xylophone;
  }

  onKeyClick(handler) {
    this.onKeyClickHandler = handler;
  }

  onEditKeyLabelClick(handler) {
    this.onEditKeyLabelClickHandler = handler;
  }

  isEditMode() {
    return this.editMode;
  }

  createKeyLabelBoxContent(noteId) {
    const note = this.notes.find((note) => note.id === noteId);

    const keyLabel = new ElementCreator({
      tag: "div",
      classNames: [`${note.id}-label`, "key-label"],
      textContent: `${note.keyLabel}`,
    });
    const editKeyLabel = new ElementCreator({
      tag: "div",
      classNames: [`${note.id}-edit-label`, "edit-key-label"],
      callback: () => {
        this.onEditKeyLabelClickHandler?.(`${note.id}`);
      },
    });
    const editIcon = new ElementCreator({
      tag: "img",
      classNames: ["edit-img"],
      attributesNames: [["src", "/assets/editIcon.png"]],
    });

    editKeyLabel.addInnerElement(editIcon);
    return { keyLabel, editKeyLabel };
  }
  createKeys(xylophone) {
    this.notes.forEach((note) => {
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

      const keyLabelBox = new ElementCreator({
        tag: "div",
        classNames: [`${note.id}-key-label-box`, "key-label-box"],
        callback: () => {
          this.enterEditMode(note.id, note.keyLabel);
        },
      });
      const { keyLabel, editKeyLabel } = this.createKeyLabelBoxContent(note.id);
      keyLabelBox.addInnerElement(keyLabel);
      keyLabelBox.addInnerElement(editKeyLabel);
      keyBox.addInnerElement(key);
      keyBox.addInnerElement(keyLabelBox);
      xylophone.append(keyBox.getElement());
    });
  }
}
