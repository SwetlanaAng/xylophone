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
    this.currentHighlightedKey = null;
    this.onEditConfirmHandler = null;
    this.onEditCancelHandler = null;
    this.isDisabled = false;
  }

  onEditConfirm(handler) {
    this.onEditConfirmHandler = handler;
  }
  onEditCansel(handler) {
    this.onEditCanselHandler = handler;
  }
  exitEditMode() {
    // Закрываем редактирование без сохранения изменений
    if (!this.editMode || !this.editingNoteId) {
      return;
    }

    const keyLabelBox = this.getElement().querySelector(
      `.${this.editingNoteId}-key-label-box`,
    );
    if (keyLabelBox) {
      clearElement(keyLabelBox);
      const { keyLabel, editKeyLabel } = this.createKeyLabelBoxContent(
        this.editingNoteId,
      );
      keyLabelBox.append(keyLabel.getElement());
      keyLabelBox.append(editKeyLabel.getElement());
    }
    this.editMode = false;
    this.editingNoteId = null;
    this.onEditCanselHandler?.();
  }

  enterEditMode(noteId, currentChar) {
    if (this.isDisabled) {
      return;
    }
    if (this.editMode && this.editingNoteId && this.editingNoteId !== noteId) {
      this.exitEditMode();
    }

    this.editMode = true;
    this.editingNoteId = noteId;
    const currentKeyLabel = Object.keys(this.keyMap).find(
      (k) => this.keyMap[k] === noteId,
    );

    const keyLabelBox = this.getElement().querySelector(
      `.${noteId}-key-label-box`,
    );
    const labelEl = this.getElement().querySelector(`.${noteId}-label`);
    if (!labelEl || !keyLabelBox) return;
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
        this.onEditConfirmHandler?.(noteId, e.target.value, currentKeyLabel);
        const { keyLabel, editKeyLabel } =
          this.createKeyLabelBoxContent(noteId);
        keyLabelBox.append(keyLabel.getElement());
        keyLabelBox.append(editKeyLabel.getElement());
        this.editMode = false;
      }
      if (e.key === "Escape") {
        this.exitEditMode();
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

  setDisabled(isDisabled) {
    this.isDisabled = isDisabled;
    const xylophone = this.getElement();
    const keys = xylophone.querySelectorAll(".key");
    const editLabels = xylophone.querySelectorAll(".edit-key-label");
    const keyLabelBoxes = xylophone.querySelectorAll(".key-label-box");

    keys.forEach((key) => {
      if (isDisabled) {
        key.classList.add("disabled");
      } else {
        key.classList.remove("disabled");
      }
    });

    editLabels.forEach((editLabel) => {
      if (isDisabled) {
        editLabel.classList.add("disabled");
      } else {
        editLabel.classList.remove("disabled");
      }
    });

    keyLabelBoxes.forEach((box) => {
      if (isDisabled) {
        box.classList.add("disabled");
      } else {
        box.classList.remove("disabled");
      }
    });

    if (isDisabled) {
      xylophone.classList.add("disabled");
    } else {
      xylophone.classList.remove("disabled");
    }

    if (isDisabled && this.editMode) {
      this.exitEditMode();
    }
  }

  highlightKey(noteId, isOn) {
    if (
      isOn &&
      this.currentHighlightedKey &&
      this.currentHighlightedKey !== noteId
    ) {
      const oldKeyElement = this.getElement().querySelector(
        `.${this.currentHighlightedKey}`,
      );
      if (oldKeyElement) {
        oldKeyElement.classList.remove("active");
      }
    }

    const keyElement = this.getElement().querySelector(`.${noteId}`);
    if (keyElement) {
      if (isOn) {
        keyElement.classList.add("active");
        this.currentHighlightedKey = noteId;
      } else {
        keyElement.classList.remove("active");
        if (this.currentHighlightedKey === noteId) {
          this.currentHighlightedKey = null;
        }
      }
    }
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
