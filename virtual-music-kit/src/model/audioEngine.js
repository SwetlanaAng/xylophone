export default class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.queue = [];
    this.isPlaying = false;

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.playNext();
    });
  }

  // Сыграть одиночный звук немедленно (обрывая текущий)
  play(url) {
    /* this.queue = [];
    this.isPlaying = false; */
    this.start(url);
  }

  // Сыграть список звуков строго по очереди
  playSequence(urls) {
    this.queue = urls.map((url) => ({ url }));
    if (!this.isPlaying) this._playNext();
  }

  start(url) {
    this.isPlaying = true;
    this.audio.src = url;
    this.audio.currentTime = 0;
    // play() не await’им — нам это не нужно
    this.audio.play().catch(() => {}); // на всякий случай игнор ошибок автоплея
  }

  playNext() {
    const next = this.queue.shift();
    if (!next) return;
    this._start(next.url);
  }
}
