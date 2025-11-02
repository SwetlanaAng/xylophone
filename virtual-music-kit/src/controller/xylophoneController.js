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

    this.model.onNoteStart = (noteId) => {
      this.xylophoneView.highlightKey(noteId, true);
    };
    this.model.onNoteEnd = (noteId) => {
      this.xylophoneView.highlightKey(noteId, false);
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

      this.model.playByKey(e.key);
    });
  }
}
