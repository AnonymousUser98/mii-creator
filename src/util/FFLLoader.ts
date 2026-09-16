import Modal, { buttonsOkCancel, closeModal } from "../ui/components/Modal";
import Notify from "../ui/components/Notify";
import {
  loadBodyModels,
  loadClothesTextures,
  loadHatModels
} from "../util/ModelLoader";
import { _, loadLang } from "./Lang";
import { Config } from "../config.js";
import { initializeFFL } from "../external/ffl.js/ffl.js";
import { getSetting } from "./SettingsHelper.js";
import type Html from "@datkat21/html";

const __ = _();

let FFLModule: any;
export const getFFL = () => FFLModule;

let currentLoadingModal: Html;
export const getCurrentLoadingModal = () => currentLoadingModal;

let FFLReadyPromise: Promise<void> | null = null;

export function ensureFFLReady(): Promise<void> {
  if (FFLReadyPromise) return FFLReadyPromise;
  return Promise.reject(new Error("Face Library is not loaded yet. Either the resource is still downloading, or it failed to load. TODO make this error message better."));
}

export async function prepareFFLAsync() {
  // Depending on config, load FFL.js

  if (FFLReadyPromise) return;

  FFLReadyPromise = (async () => {
  if (Config.renderer.useRendererServer !== false) {
    return console.log("why do you");
  }

    /*
    currentLoadingModal = Modal.modal(
    __("Notice"),
    // TODO: Make a better message? 😅
    // Displayed in a modal while loading resource files.
    __("Mii Creator is loading assets, please wait...")
  );
    */

  FFLModule = (await import("../external/ffl.js/ffl-emscripten.js")).default;

  FFLModule = await FFLModule({
    locateFile: (path: string) => {
      return new URL("./" + path, import.meta.url).href;
    }
  });

  console.log(FFLModule);
  console.log("We've got FFL!");

  // Import FFL.JS (c) 2025 Arian K. macOS Edition
  await loadBodyModels();
  await loadHatModels();
  // for some reason
  await loadClothesTextures();

  const fflResourceResponse = await fetch(
    Config.renderer.fflResourcePath[await getSetting("resourceType")]
  );
  const fflResourceData = new Uint8Array(await fflResourceResponse.arrayBuffer());

  let { module } = await initializeFFL(fflResourceData, FFLModule);
  FFLModule = module;

  console.log("Ready!");

    // closeModal(currentLoadingModal);
  })();
}
