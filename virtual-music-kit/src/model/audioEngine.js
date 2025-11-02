export default class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.queue = [];
    this.isPlaying = false;
    this.isPlayingSequence = false;
    this.onNoteStartCallback = null;
    this.onNoteEndCallback = null;
    this.onSequenceStartCallback = null;
    this.onSequenceEndCallback = null;
    this.endTimeout = null;

    this.audio.addEventListener("ended", () => {
      this.handleNoteEnd();
    });
  }

  onNoteStart(callback) {
    this.onNoteStartCallback = callback;
  }

  onNoteEnd(callback) {
    this.onNoteEndCallback = callback;
  }

  onSequenceStart(callback) {
    this.onSequenceStartCallback = callback;
  }

  onSequenceEnd(callback) {
    this.onSequenceEndCallback = callback;
  }

  handleNoteEnd() {
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }

    const endedNoteId = this.currentNoteId;
    this.currentNoteId = null;

    if (endedNoteId) {
      this.onNoteEndCallback?.(endedNoteId);
    }

    this.playNext();
  }

  play(url, noteId = null) {
    const previousNoteId = this.currentNoteId;

    this.queue = [];
    this.isPlaying = false;

    this.audio.pause();
    this.audio.currentTime = 0;

    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }

    if (previousNoteId && previousNoteId !== noteId) {
      this.onNoteEndCallback?.(previousNoteId);
    }

    setTimeout(() => {
      this.start(url, noteId);
    }, 10);
  }

  playSequence(items) {
    if (this.currentNoteId) {
      this.onNoteEndCallback?.(this.currentNoteId);
      this.currentNoteId = null;
    }

    this.isPlayingSequence = true;
    this.queue = items;

    this.onSequenceStartCallback?.();

    if (!this.isPlaying) this.playNext();
  }

  start(url, noteId = null) {
    if (this.currentNoteId && this.currentNoteId !== noteId) {
      this.onNoteEndCallback?.(this.currentNoteId);
    }

    this.isPlaying = true;
    this.currentNoteId = noteId;

    if (noteId) {
      this.onNoteStartCallback?.(noteId);
    }

    this.audio.src = url;
    this.audio.currentTime = 0;

    this.endTimeout = setTimeout(() => {
      if (this.currentNoteId === noteId) {
        this.handleNoteEnd();
      }
    }, 1500);

    this.audio.play().catch(() => {
      if (this.endTimeout) {
        clearTimeout(this.endTimeout);
        this.endTimeout = null;
      }
      if (noteId && this.currentNoteId === noteId) {
        this.onNoteEndCallback?.(noteId);
        this.currentNoteId = null;
      }
      this.isPlaying = false;
    });
  }

  playNext() {
    const next = this.queue.shift();
    if (!next) {
      this.isPlaying = false;
      if (this.isPlayingSequence) {
        this.isPlayingSequence = false;
        this.onSequenceEndCallback?.();
      }
      return;
    }
    this.start(next.url, next.noteId);
  }
}
