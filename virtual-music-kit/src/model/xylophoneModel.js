export default class XylophoneModel {
  constructor(audioEngine, notes) {
    this.audio = audioEngine;
    this.notes = notes;
    /* this.keyMap = keyMap;               // { a: 'C4', s: 'D4', ... } для кнопок клавы
      this.notesById = new Map(notes.map(n => [n.id, n])); // [{id,freq,...}] */
  }
  playNoteById(noteId) {
    const note = this.notes.find((note) => {
      return note.id === noteId;
    });
    this.audio.play(note.sampleUrl); 
  }
  playByKey(key) {}
  getNotes() {
    return this.notes;
  }
}
