export default class XylophoneModel {
  constructor(audioEngine, notes, keyMap, ruEnMap) {
    this.audio = audioEngine;
    this.notes = notes;
    this.keyMap = keyMap;
    this.ruEnMap = ruEnMap;
  }
  normalizeToEn(char) {
    const key = char.toLowerCase();
    return this.ruEnMap[key] || key;
  }
  playNoteById(noteId) {
    const note = this.notes.find((note) => {
      return note.id === noteId;
    });
    this.audio.play(note.sampleUrl);
  }
  playByKey(key) {
    const normalizedKey = this.normalizeToEn(key);
    if (!this.keyMap[normalizedKey]) return;
    this.playNoteById(this.keyMap[normalizedKey]);
  }
  editKeyLabel(noteId) {}
  getNotes() {
    return this.notes;
  }
}
