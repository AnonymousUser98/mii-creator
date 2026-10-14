import localforage from "localforage";
import { getMusicManager } from "../class/audio/MusicManager";
import { getSoundManager } from "../class/audio/SoundManager";
import Modal, { buttonsOkCancel, closeModal } from "./components/Modal";
import { Library } from "./pages/Library";
import Mii from "../class/MiiData";
import { MiiEditor } from "../class/MiiEditor";
import {
  displayUpdateNotice,
  Settings,
  updateSettings
} from "./pages/Settings";
import { Config } from "../config";
import { customRender } from "./pages/library/render/customRender";
import { importMiiConfirmation } from "./pages/library/importDialog";

import { newFromPassword } from "./passwords";

import { _ } from "../util/Lang";
import { getCurrentLoadingModal, prepareFFLAsync } from "../util/FFLLoader";
import Html from "@datkat21/html";
const __ = _();

export async function setupUi() {
  let mm = getMusicManager();
  getSoundManager();

  let shownSessionModal = false;
  if (Config.syncAPIBase) {
  // Check session every 60s
  setInterval(() => {
    // console.log("checking session..");
      fetch(Config.syncAPIBase + "/session")
      .then((e) => {
        if (!e.ok) {
          // not ok
          showSessionModal();
        }
      })
      .catch((e) => {
        // also not ok
        showSessionModal();
      });
  }, 45_000);
  }

  function showSessionModal() {
    if (shownSessionModal) return;
    shownSessionModal = true;
    Modal.modal(
      __("Warning"),
      __("Mii Creator has lost connection to the server. Click OK to reload."),
      "body",
      {
        text: "OK",
        callback(e) {
          location.reload();
        }
      }
    );
  }

  updateSettings(true);

  prepareFFLAsync().catch((e) => {
    closeModal(getCurrentLoadingModal());
    let m = Modal.modal(
      "Error",
      "Oops, an error occurred when loading Mii Creator.." +
        "\n\nLoading will not continue."
    );
    m.qs(".modal-body")!.appendMany(
      new Html("pre").style({ margin: "0" }).text(e.stack),
      new Html("span").html(
        'If the error persists, please report this to the developer <a href="mailto:datkat21.yt@gmail.com">kat21\'s e-mail</a>!'
      )
    );
    throw e;
  });

  displayUpdateNotice();

  function showBrowserWarning() {
    if (
      navigator.userAgent.includes("Firefox") &&
      sessionStorage.getItem("seen-firefox-notice") === null
    ) {
      sessionStorage.setItem("seen-firefox-notice", "yes");
      Modal.modal(
        __("Warning"),
        __(
          "You're using Mii Creator under Firefox. Using the Firefox browser WILL experience slowdowns and lag."
        ),
        "body",
        ...buttonsOkCancel
      );
    }
    if (
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1 /*&&
      sessionStorage.getItem("seen-safari-notice") === null*/
    ) {
      // sessionStorage.setItem("seen-safari-notice", "yes");
      Modal.modal(
        __("Warning"),
        __(
          "You're using Mii Creator under Safari. Safari on iOS or iPadOS may experience instability with Mii Creator, causing the page to crash and refresh randomly. Some checks have been enabled to try and prevent the page from crashing right now. You have been warned."
        ),
        "body",
        ...buttonsOkCancel
      );
    }
  }

  if (
    navigator.userAgent.indexOf("Safari") != -1 &&
    navigator.userAgent.indexOf("Chrome") == -1
  ) {
    //@ts-expect-error
    window.browserMitigations = true;
    // alert("safari check PASSED");
  } else {
    // alert("safari check FAILED");
  }

  // for U theme
  let state: "main" | "edit" = "main";
  document.addEventListener("editor-launch", () => {
    state = "edit";
    setTimeout(() => {
      updateMusicVol();
    }, 100);
  });
  document.addEventListener("editor-shutdown", () => {
    state = "main";
    setTimeout(() => {
      updateMusicVol();
    }, 100);
  });

  function updateMusicVol() {
    if (!mm.editGainNode || !mm.mainGainNode) return;
    // a bit repetitive
    if (state === "main") {
      mm.mainGainNode.gain.linearRampToValueAtTime(
        -0.6,
        getMusicManager().audioContext.currentTime + 0.5
      );
      mm.editGainNode.gain.linearRampToValueAtTime(
        -1,
        getMusicManager().audioContext.currentTime + 0.5
      );
    }
    if (state === "edit") {
      mm.mainGainNode.gain.linearRampToValueAtTime(
        -1,
        getMusicManager().audioContext.currentTime + 0.5
      );
      mm.editGainNode.gain.linearRampToValueAtTime(
        -0.6,
        getMusicManager().audioContext.currentTime + 0.5
      );
    }
  }

  mm.initMusic();

  if (location.search !== "") {
    const searchParams = new URLSearchParams(location.search);

    // open editor with specific data
    if (searchParams.has("data")) {
      new MiiEditor(
        0,
        async (data, shutdownProperly) => {
          Library();
        },
        searchParams.get("data")!
      );
    } else if (searchParams.has("custom-render-preview")) {
      const miiData = new Mii(searchParams.get("custom-render-preview")!);
      customRender(miiData);
    } else if (searchParams.has("settings")) {
      Settings();
    } else Library();
  } else Library();

  getSoundManager().setVolume(0.28);
  mm.setVolume(0.28);

  window.addEventListener("blur", () => {
    if (mm.mainGainNode) {
      mm.mainGainNode.gain.linearRampToValueAtTime(
        -1,
        getMusicManager().audioContext.currentTime + 0.5
      );
      if (mm.editGainNode) {
        mm.editGainNode.gain.linearRampToValueAtTime(
          -1,
          getMusicManager().audioContext.currentTime + 0.5
        );
      }
    } else getMusicManager().setVolume(0);
    getSoundManager().setVolume(0);
  });
  window.addEventListener("focus", () => {
    if (mm.mainGainNode) {
      if (state === "main") {
        mm.mainGainNode.gain.setValueAtTime(-1, mm.audioContext.currentTime);
        mm.mainGainNode.gain.linearRampToValueAtTime(
          -0.6,
          getMusicManager().audioContext.currentTime + 0.5
        );
      } else if (state === "edit") {
        if (mm.editGainNode) {
          mm.editGainNode.gain.setValueAtTime(-1, mm.audioContext.currentTime);
          mm.editGainNode.gain.linearRampToValueAtTime(
            -0.6,
            getMusicManager().audioContext.currentTime + 0.5
          );
        } else {
          mm.mainGainNode.gain.setValueAtTime(-1, mm.audioContext.currentTime);
          mm.mainGainNode.gain.linearRampToValueAtTime(
            -0.6,
            getMusicManager().audioContext.currentTime + 0.5
          );
        }
      }
    } else getMusicManager().setVolume(0);
    getSoundManager().setVolume(getSoundManager().previousVolume);
  });

  //@ts-expect-error
  window.MusicManager = getMusicManager();
  //@ts-expect-error
  window.soundManager = getSoundManager();

  let kci = 0;
  const codeKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

  document.addEventListener("keydown", (e) => {
    if (document.activeElement === document.body) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.code === "KeyS") {
        Modal.modal(
          "sound test",
          "choose a sound",
          "body",
          ...Object.keys(getSoundManager().soundBufs).map((k) => ({
            text: k,
            callback() {
              getSoundManager().playSound(k);
              //@ts-expect-error used for debugging
              window.lastPlayedSound = k;
            },
          }))
        )
          .qs(".modal-content")!
          .style({ "max-width": "unset", "max-height": "unset" });
      }
      if (e.code === "KeyD") {
        // debug key enables debug options
        window.localforage = localforage;
        window.Mii = Mii;
      }
      if (e.code === "KeyV") {
        const vol = Number(
          prompt("Enter volume level from 0-1 (default is 0.35)")
        );

        if (vol < 0) return;
        if (vol > 1) return;
        if (vol === null) return;

        getSoundManager().setVolume(vol);
        mm.setVolume(vol);
      }
      if (e.code === "ArrowUp") {
        if (kci === 0 || kci === 1) {
          kci++;
        } else {
          if (kci === 2) {
            // Do Nothing
          } else {
            kci = 0;
          }
        }
      }
      if (e.code === "ArrowDown") {
        if (kci === 2 || kci === 3) {
          kci++;
        } else {
          kci = 0;
        }
      }
      if (e.code === "ArrowLeft") {
        if (kci === 4 || kci === 6) {
          kci++;
        } else {
          kci = 0;
        }
      }
      if (e.code === "ArrowRight") {
        if (kci === 5 || kci === 7) {
          kci++;
        } else {
          kci = 0;
        }
      }
      if (e.code === "KeyB") {
        if (kci === 8) {
          kci++;
        } else {
          kci = 0;
        }
      }
      if (e.code === "KeyA") {
        if (kci === 9) {
          const mii = new Mii(
            "A4EAwAAAAAAAAAAAAP9wmS/5Fhz6rQAAABBNAGEAcgBtAHUAbAAAAAAAAAAAAGt2aZUiDmsJQxivFUUUbBISaK0AKSmgUQAlSgBpAGYAZgB5AFAAbwBwAEoAcgAAAGtGAAA8QhNNHwAAAAAA"
          );
          importMiiConfirmation(mii, "Mii Creator (Special Mii)");
          kci = 0;
        } else {
          kci = 0;
        }
      }
      if (!codeKeys.includes(e.code)) {
        kci = 0;
      }
    }
  });
}

/* NOTES ABOUT THE MIIC FORMAT
To make a Mii get recognized as "non-editable" and "obtained through Mii Creator", replace bytes $10 to $15 with "2F F9 16 1C FA AD", then update the checksum at $5E-$5F with CRC-16/XMODEM.
To convert from MIIC to FFSD, remove the last 12 bytes (the ones after the checksum).
*/
