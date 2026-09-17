// Most of these aren't needed here, but IDK which ones are, so I won't remove any.
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

import { _ } from "../util/Lang";
import { getCurrentLoadingModal, prepareFFLAsync } from "../util/FFLLoader";
import Html from "@datkat21/html";

// START OF ACTUAL CODE

export const newFromPassword = () => {
  var pwdin = prompt("Enter a secret password to unlock a special Mii:");

  switch(pwdin) {
  case "JUSTIN BAILEY":
      var mii = new Mii(
      Buffer.from(
          "A8EAwAAAAAAAAAAAAN8Zmi/5Fhz6rQAAARxKAEIAWgBTACAAUwBhAG0AdQBzAG0uBQBkAx5HQxzTM0UcixrbKBEAACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAPNMAAAMABYAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "BUSH HID THE FACTS":
      alert("isTextUnicode()");
      break;
  case "ORANGE EGGS":
  case "PEANUT BUTTER CRACKERS":
      var mii = new Mii(
      Buffer.from(
          "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAAABCAHIAaQBnAGgAdAAgAEcAdQB5AEdEDwA3CYfOBBqANEUQiBghaBAAACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAHuqAABaPAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "DO NOT REDEEM":
      var mii = new Mii(
      Buffer.from(
          "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxLAGkAdABiAG8AZwBhAAAAAAAAAFpgBQBDATFlYxYjU0UScBDYCo0ANCGGWUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAH/8AAAMABYAAA8AAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "NARPAS SWORD0 000000 000000":
  case "NARPASSWORD0000000000000":
      var mii = new Mii(
      Buffer.from(
          "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxOAGEAcgBpAGgAaQByAG8AAAAAAEBACQBACDKGQxgMFCQUrRIGDg4AAimhUUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAK/rAAAIAAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "YROTS EVAC":
  case "ORGANYA":
  case "DOUKUTSU MONOGATARI":
  case "BUSHLANDS":
      var mii = new Mii(
      Buffer.from(
          "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAAChQAGkAeABlAGwAAAAAAAAAAAAAAE1ZDQA+CJlmJRoBU0QUZhQPSA8AACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAF5mAAAKAAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "A WINNER IS YOU":
  case "A WINNER IS YOU!":
      var mii = new Mii(
      Buffer.from(
          "AwEAQAAAAAAAAAAAgP9wmS/5Fhz6rQAAACxIAGEAeQBhAGIAdQBzAGEAAAAAAH5/bAB2AhGoJRgJY0YSzRASSqwAwCgAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAADOIAAAAAAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "DONT GET SCAMMED":
  case "DON'T GET SCAMMED":
  case "SCAMMER PAYBACK":
      var mii = new Mii(
      Buffer.from(
          "A0EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxQAGkAZQByAG8AZwBpAAAAAAAAAGFfBbArBPFGYxYhQ4MShhAWSA4AGCkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAABw7AAwLAAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  case "L IS REAL 2401":
      var mii = new Mii(
      Buffer.from(
          "AwEAwAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxaAGEAbQBtAGkAcwAAAAAAAAAAAFpmBQBWAIJmZBgzVEQUixIXqI4AHCmCUUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAGVGAAAKAAAAAAAAAAAA",
          "base64"
      )
      );
      importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
      break;
  default:
      alert("Invalid password.");
      break;
  }
}
