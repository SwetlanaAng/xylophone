import RootView from "./view/rootView.js";
import { NOTES } from "./model/data/keys.js";
import XylophoneModel from "./model/xylophoneModel.js";
import XylophoneController from "./controller/xylophoneController.js";
import AudioEngine from "./model/AudioEngine.js";

const audio = new AudioEngine();
const model = new XylophoneModel(audio, NOTES);
const view = new RootView();
new XylophoneController(model, view).init();
