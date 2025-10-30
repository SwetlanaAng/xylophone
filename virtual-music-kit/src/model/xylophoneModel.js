export default class XylophoneModel {
  constructor(audioEngine, notes) {
    this.audio = audioEngine;
    this.notes = notes;
    /* this.keyMap = keyMap;               // { a: 'C4', s: 'D4', ... } для кнопок клавы
      this.notesById = new Map(notes.map(n => [n.id, n])); // [{id,freq,...}] */
  }
  playNoteById(noteId) {
    this.audio.play(noteId); // тут надо в массиве найти адрем ноты по id
  }
  playByKey(key) {}
  getNotes() {
    return this.notes;
  }
}
