export default class XylophoneModel {
  constructor(audioEngine, notes, keyMap, ruEnMap) {
    this.audio = audioEngine;
    this.notes = notes;
    this.keyMap = keyMap;
    this.ruEnMap = ruEnMap;
    this.onNoteStart = null;
    this.onNoteEnd = null;
    this.onSequenceStart = null;
    this.onSequenceEnd = null;

    this.audio.onNoteStart((noteId) => {
      this.onNoteStart?.(noteId);
    });
    this.audio.onNoteEnd((noteId) => {
      this.onNoteEnd?.(noteId);
    });
    this.audio.onSequenceStart(() => {
      this.onSequenceStart?.();
    });
    this.audio.onSequenceEnd(() => {
      this.onSequenceEnd?.();
    });
  }
  normalizeToEn(char) {
    const key = char.toLowerCase();
    return this.ruEnMap[key] || key;
  }
  playNoteById(noteId) {
    const note = this.notes.find((note) => {
      return note.id === noteId;
    });
    this.audio.play(note.sampleUrl, noteId);
  }
  playByKey(key) {
    const normalizedKey = this.normalizeToEn(key);
    if (!this.keyMap[normalizedKey]) return;
    this.playNoteById(this.keyMap[normalizedKey]);
  }
  cancelEdit() {}

  replaceKeyLabel(noteId, newLabel, currentKeyLabel) {
    if (newLabel && !this.keyMap[newLabel]) {
      this.notes.find((note) => note.id === noteId).keyLabel = newLabel;
      delete this.keyMap[currentKeyLabel];
      this.keyMap[newLabel] = noteId;
      return true;
    }
    return false;
  }
  playNotes(sequence) {
    const items = [];
    const keys = sequence.toLowerCase().split("");

    for (const key of keys) {
      const normalizedKey = this.normalizeToEn(key);
      const noteId = this.keyMap[normalizedKey];

      if (noteId) {
        const note = this.notes.find((n) => n.id === noteId);
        if (note && note.sampleUrl) {
          items.push({ url: note.sampleUrl, noteId: noteId });
        }
      }
    }
    if (items.length > 0) {
      this.audio.playSequence(items);
    }
  }
  getNotes() {
    return this.notes;
  }
}
