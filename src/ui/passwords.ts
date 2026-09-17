import localforage from "localforage";
import { MiiEditor, MiiGender } from "../../../../class/MiiEditor";
import Modal from "../../../components/Modal";
import { _shutdown, Library, newMiiId } from "../../Library";
import { miiCreateDialog } from "./_dialog";
// Above import lines copied from `fromScratch.ts`

import Mii from "../../../../external/mii-js/mii";
import { importMiiConfirmation } from "../importDialog";
import { sha3_256 } from "js-sha3";
import { Buffer } from "../../../../../node_modules/buffer/index";

// Import lines copied from `/src/ui/pages/library/new/base64.ts` in the pre-local branch.

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
