export default class XylophoneController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.formView = view.getFormView();
    this.xylophoneView = view.getXylophoneView();
  }
  init() {
    this.view.createView();

    this.isPlayingSequence = false;
    this.pressedNotes = new Set();

    this.model.onNoteStart = (noteId) => {
      this.xylophoneView.highlightKey(noteId, true);
    };
    this.model.onNoteEnd = (noteId) => {
      if (!this.pressedNotes.has(noteId)) {
        this.xylophoneView.highlightKey(noteId, false);
      }
    };

    this.model.onSequenceStart = () => {
      this.isPlayingSequence = true;
      this.xylophoneView.setDisabled(true);
      this.formView.setDisabled(true);
    };
    this.model.onSequenceEnd = () => {
      this.isPlayingSequence = false;
      this.xylophoneView.setDisabled(false);
      this.formView.setDisabled(false);
    };

    this.xylophoneView.onKeyMouseDown((noteId) => {
      if (this.isPlayingSequence) {
        return;
      }
      if (!this.pressedNotes.has(noteId)) {
        this.pressedNotes.add(noteId);
        this.xylophoneView.highlightKey(noteId, true);
        this.model.playNoteById(noteId);
      }
    });

    this.xylophoneView.onKeyMouseUp((noteId) => {
      this.pressedNotes.delete(noteId);
      setTimeout(() => {
        if (!this.pressedNotes.has(noteId)) {
          this.xylophoneView.highlightKey(noteId, false);
        }
      }, 50);
    });

    this.xylophoneView.onKeyClick((noteId) => {
      if (this.isPlayingSequence) {
        return;
      }

      this.model.playNoteById(noteId);
    });

    this.xylophoneView.onEditConfirm((noteId, newLabel, currentKeyLabel) => {
      if (this.isPlayingSequence) {
        return;
      }
      const success = this.model.replaceKeyLabel(
        noteId,
        newLabel,
        currentKeyLabel,
      );

      if (success) {
        this.formView.clearInput();
      }
    });
    this.xylophoneView.onEditCansel(() => {
      this.model.cancelEdit();
    });
    this.formView.onSubmit((notes) => {
      if (this.isPlayingSequence) {
        return;
      }
      this.model.playNotes(notes);
    });
    window.addEventListener("keydown", (e) => {
      if (this.xylophoneView.isEditMode()) {
        return;
      }

      if (this.isPlayingSequence) {
        return;
      }

      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === "INPUT") {
        return;
      }

      const noteId = this.model.getNoteIdByKey(e.key);
      if (noteId) {
        if (!this.pressedNotes.has(noteId)) {
          this.pressedNotes.add(noteId);
          this.xylophoneView.highlightKey(noteId, true);
          this.model.playByKey(e.key);
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.isPlayingSequence) {
        return;
      }

      const noteId = this.model.getNoteIdByKey(e.key);
      if (noteId && this.pressedNotes.has(noteId)) {
        this.pressedNotes.delete(noteId);
        setTimeout(() => {
          if (!this.pressedNotes.has(noteId)) {
            this.xylophoneView.highlightKey(noteId, false);
          }
        }, 50);
      }
    });
  }
}
