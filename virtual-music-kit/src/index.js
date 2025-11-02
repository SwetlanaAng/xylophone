import RootView from "./view/rootView.js";
import { NOTES } from "./model/data/keys.js";
import { KEY_MAP } from "./model/data/keyMap.js";
import XylophoneModel from "./model/xylophoneModel.js";
import XylophoneController from "./controller/xylophoneController.js";
import AudioEngine from "./model/audioEngine.js";
import { RU_EN_MAP } from "./model/data/ruEnMap.js";

const audio = new AudioEngine();
const model = new XylophoneModel(audio, NOTES, KEY_MAP, RU_EN_MAP);
const view = new RootView();
new XylophoneController(model, view).init();
