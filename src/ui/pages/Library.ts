import Html from "@datkat21/html";
import localforage from "localforage";
import Modal, { buttonsOkCancel } from "../components/Modal";
import Mii from "../../external/mii-js/mii";
import { Buffer } from "../../../node_modules/buffer/index";
import { AddButtonSounds } from "../../util/AddButtonSounds";
import { createIconCard, createMiiCard } from "../../util/miiImageUtils";
import { Config } from "../../config";
import EditorIcons from "../../constants/EditorIcons";
import { saveArrayBuffer } from "../../util/downloadLink";
import { RandomInt } from "../../util/Numbers";
import {
  cPantsColorGoldHex,
  cPantsColorRedHex,
} from "../../class/3d/shader/fflShaderConst";
import { MiiFavoriteColorIconTable } from "../../constants/ColorTables";
import { getString as _ } from "../../l10n/manager";
import { replayUpdateNotice, Settings } from "./Settings";
import {
  adjustShaderQuery,
  ShaderType,
  BodyType,
} from "../../constants/BodyShaderTypes";
import { getSetting } from "../../util/SettingsHelper";
import { playSound } from "../../class/audio/SoundManager";
import { miiSelect } from "./library/select";
import { miiCreateDialog } from "./library/new/_dialog";
import { importMiiConfirmation } from "./library/importDialog";
import { sha3_256 } from "js-sha3";

export const savedMiiCount = async () =>
  (await localforage.keys()).filter((k) => k.startsWith("mii-")).length;
export const newMiiId = async () =>
  `mii-${Date.now()}-${await savedMiiCount()}`;
export const miiIconUrl = (
  mii: Mii,
  source: string = "unknown",
  view: string = "variableiconbody",
  width: number = 180,
  index: number = 0
) => {
  let url = Config.renderer.renderHeadshotURLNoParams;

  let params = new URLSearchParams();

  params.set("data", mii.encodeStudio().toString("hex"));
  // set shader type in query params
  adjustShaderQuery(params, currentShader);
  params.set("bodyType", currentBodyModel);
  params.set("type", view);
  params.set("width", width.toString());
  params.set("verifyCharInfo", "0");
  params.set("miic", encodeURIComponent(mii.encode().toString("base64")));
  params.set("version", Config.version.string);
  params.set("source", source ? "library" : "lookalike");
  params.set("index", index.toString());
  params.set(
    "pantsColor",
    mii.normalMii === false ? "gold" : mii.favorite === true ? "red" : "gray"
  );

  if (mii.extHatType !== 0) {
    params.set(
      Config.renderer.hatTypeParam,
      String(mii.extHatType + Config.renderer.hatTypeAdd)
    );
  }
  if (mii.extHatColor !== 0) {
    params.set(
      Config.renderer.hatColorParam,
      String(mii.extHatColor + Config.renderer.hatColorAdd)
    );
  }

  // params.set(
  //   "lightXDirection",
  //   "0"
  // );
  // params.set(
  //   "lightYDirection",
  //   "0"
  // );
  // params.set(
  //   "lightZDirection",
  //   "57"
  // );

  return `${url}?${params.toString()}`;
};

let currentShader: ShaderType = ShaderType.WiiU;
document.addEventListener("library-shader-update", async () => {
  currentShader = await getSetting("shaderType");
});
let currentBodyModel: BodyType = BodyType.WiiU;
document.addEventListener("library-body-update", async () => {
  currentBodyModel = await getSetting("bodyModel");
});
let shutdown: () => any = () => {
  console.log("Shutdown was called but was not set yet!");
};
export const _shutdown = () => shutdown;
export async function Library(highlightMiiId?: string) {
  currentShader = await getSetting("shaderType");
  currentBodyModel = await getSetting("bodyModel");
  function shutdownReal(): Promise<void> {
    return new Promise((resolve) => {
      container.class("fadeOut");
      setTimeout(() => {
        container.cleanup();
        resolve();
      }, 500);
    });
  }
  shutdown = shutdownReal;

  const container = new Html("div").class("mii-library").appendTo("body");

  const sidebar = new Html("div").class("library-sidebar").appendTo(container);

  sidebar.append(new Html("h1").text(_("generic.app_title")));

  const libraryList = new Html("div").class("library-list").appendTo(container);

  const miis = await Promise.all(
    (
      await localforage.keys()
    )
      .filter((k) => k.startsWith("mii-"))
      .sort((a, b) => Number(a.split("-")[1]!) - Number(b.split("-")[1]!))
      .map(async (k) => ({
        id: k,
        mii: (await localforage.getItem(k)) as string,
      }))
  );

  if (miis.length === 0) {
    libraryList.append(
      new Html("div")
        .style({ position: "absolute", top: "2rem", left: "2rem" })
        .text("You have no Miis yet. Create one to get started!")
    );
  }
  let miiErrorCount = 0,
    miiCount = 0;
  for (const mii of miis) {
    let miiContainer = new Html("div").class("library-list-mii");

    AddButtonSounds(miiContainer);

    try {
      const miiData = new Mii(Buffer.from(mii.mii, "base64"));
      // prevent error when importing converted Wii-era data
      miiData.unknown1 = 0;
      miiData.unknown2 = 0;

      let specialMii = false;
      if (
        miiData.consoleMAC[0] === 47 &&
        miiData.consoleMAC[1] === 249 &&
        miiData.consoleMAC[2] === 22 &&
        miiData.consoleMAC[3] === 28 &&
        miiData.consoleMAC[4] === 250 &&
        miiData.consoleMAC[5] === 173
      ) {
        miiContainer
          .classOn("highlight")
          .style({ "--selection-color": "#ffbf00" });
        specialMii = true;
      }

      // if (miiData)
      //   console.log(
      //     miiData.miiName + "'s birthPlatform:",
      //     miiData.deviceOrigin
      //   );

      miiContainer.style({
        "--color": MiiFavoriteColorIconTable[miiData.favoriteColor].top,
      });

      let extraData = "";
      // hat
      if (miiData.extHatType !== 0) {
        extraData += `&${Config.renderer.hatTypeParam}=${encodeURIComponent(
          miiData.extHatType + Config.renderer.hatTypeAdd
        )}&${Config.renderer.hatColorParam}=${encodeURIComponent(
          miiData.extHatColor + Config.renderer.hatColorAdd
        )}`;
      }

      let miiImage = new Html("img").class("lazy").attr({
        "data-src":
          miiIconUrl(miiData, "library", "variableiconbody", 180, miiCount) +
          extraData,
      });

      // Special
      if (
        miiData.normalMii === false ||
        miiData.favorite === true ||
        specialMii
      ) {
        const star = new Html("i")
          .style({ position: "absolute", top: "-22px", right: "-18px" })

          .appendTo(miiContainer);

        if (miiData.favorite === true) {
          star.html(EditorIcons.favorite).style({ color: cPantsColorRedHex });
        }
        if (miiData.normalMii === false || specialMii) {
          star.html(EditorIcons.special).style({ color: cPantsColorGoldHex });
        }
      }

      let miiName = new Html("span").text(miiData.miiName);

      let miiEditCallback = miiSelect(mii, miiData, specialMii);

      miiContainer.on("click", async () => {
        if (hasMiiErrored === true) {
          Modal.modal(
            "Oops",
            "This Mii hasn't loaded correctly. Do you still want to try and manage it?",
            "body",
            {
              text: "Cancel",
            },
            {
              callback(e) {
                miiEditCallback();
              },
              text: "Yes",
            },
            {
              text: "No",
            }
          );
          return;
        }

        miiEditCallback();
      });

      let hasMiiErrored = false;

      miiImage.on("error", () => {
        // prevent looping error load
        if (hasMiiErrored === true) return;
        miiImage.attr({
          src: "data:image/svg+xml," + encodeURIComponent(EditorIcons.error),
        });
        hasMiiErrored = true;
      });
      miiImage.on("load", () => {
        setTimeout(() => {
          // only play 50% of the time lol
          if (RandomInt(2) !== 0) return;
          playSound(`load${RandomInt(4) + 1}`);
        }, RandomInt(200));
      });

      miiContainer.appendMany(miiImage, miiName).appendTo(libraryList);

      requestAnimationFrame(() => {
        if (highlightMiiId !== undefined) {
          if (highlightMiiId === mii.id) {
            miiContainer.classOn("highlight");

            setTimeout(() => {
              if (specialMii === false) miiContainer.classOff("highlight");
            }, 2000);

            const mc = miiContainer.elm;
            mc.closest(".library-list")!.scroll({
              top:
                mc.getBoundingClientRect().top +
                mc.getBoundingClientRect().height,
              behavior: "smooth",
            });
          }
        }
      });

      miiCount++;
    } catch (e: unknown) {
      console.log("Oops", e);
      miiErrorCount++;

      let miiImage = new Html("img").attr({
        src: "data:image/svg+xml," + encodeURIComponent(EditorIcons.error),
      });
      let miiName = new Html("span").text("?");

      miiContainer.appendMany(miiImage, miiName).appendTo(libraryList);

      miiContainer.on("click", async () => {
        Modal.modal(
          "Oops",
          "This Mii might be corrupted. Choose an option below.",
          "body",
          {
            text: "Cancel",
          },
          {
            text: "Download a copy",
            callback(e) {
              console.log(mii);
              saveArrayBuffer(
                Buffer.from(mii.mii, "base64").buffer,
                mii.id + ".miic"
              );
            },
          },
          {
            text: "Download a copy (Base64 encoded)",
            callback(e) {
              console.log(mii);
              saveArrayBuffer(
                Buffer.from(mii.mii).buffer,
                mii.id + ".miic.txt"
              );
            },
          },
          {
            text: "Delete",
            callback(e) {
              Modal.modal(
                "Warning",
                "Are you sure you want to delete this Mii?",
                "body",
                {
                  async callback(e) {
                    await localforage.removeItem(mii.id);
                    await shutdown();
                    Library();
                  },
                  text: "Yes",
                  type: "danger",
                },
                {
                  text: "No",
                }
              );
            },
          }
        );
      });
    }
  }

  if (miiErrorCount > 0) {
    Modal.modal(
      "Error",
      `It appears that ${miiErrorCount} of your Miis have failed to load. Their data may be corrupted.\n\nIf you'd like to try and recover the Mii data, you can select the Miis with errors and choose to either save a copy or delete them.`,
      "body",
      ...buttonsOkCancel
    );
  }

  window.LazyLoad.update();

  sidebar.appendMany(
    new Html("div").class("sidebar-buttons").appendMany(
      AddButtonSounds(
        new Html("button").text("Create Mii").on("click", async () => {
          miiCreateDialog();
        })
      ),
      AddButtonSounds(
        new Html("button").text("Import from Base64").on("click", () => {
          var miiDataInput = prompt("Paste the Base64 data here:");
          var mii = new Mii(
            Buffer.from(
              miiDataInput,
              "base64"
            )
          );
          importMiiConfirmation(mii, "Imported from Base64");
        })
      ),
      AddButtonSounds(
        new Html("button").text("Settings").on("click", async () => {
          Settings();
        })
      )
    ),
    new Html("div").class("sidebar-credits").appendMany(
      new Html("div")
        .class("flex-group")
        .style({ width: "100%" })
        .appendMany(
          AddButtonSounds(
            new Html("button")
              .text("Credits")
              .on("click", async () => {
                var m = Modal.modal(
                  "Credits",
                  "",
                  "body",
                  { text: "Cancel" },
                  { text: "OK" }
                );
                m.qs(".modal-body span")!.cleanup();
                m.qs(".modal-content")!.style({
                  "max-width": "100%",
                  "max-height": "100%",
                });
                const mb = m.qs(".modal-body")!;
                m.qs(".modal-content")!.style({ position: "relative" });
                const container = new Html("div").class("col").prependTo(mb);
                new Html("span")
                  .text("Check out the people behind Mii Creator!")
                  .style({
                    "font-size": "20px",
                    "flex-shrink": "0",
                    "margin-bottom": "-16px",
                  })
                  .prependTo(mb);

                // hey stop snooping! you'll ruin the fun :(
                new Html("a")
                  .text("secret?")
                  .style({
                    "font-size": "10px",
                    opacity: "0.3",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                  })
                  .on("click", (e) => {
                    m.qs("button")?.elm.click();

                    const mii = new Mii(
                      Buffer.from(
                        "A8EAwELycUHCpfBSXhcDbS/5Fhz6rQAAWS1KAGEAcwBtAGkAbgBlAAAAAAAAABw3ExB7ASFuQxwNZMcYAAgegg0AMEGzW4JtcwBvAHMAaQBnAG8AbgBhAGwAAAAAAMwDAAAAAAAAAAAAAAAA",
                        "base64"
                      )
                    );
                    importMiiConfirmation(mii, "Mii Creator (Special Mii)");
                  })
                  .appendTo(mb);

                createMiiCard(
                  container,
                  "Austin☆²¹ / Kat21",
                  "datkat21",
                  "https://github.com/datkat21",
                  "Author of Mii Creator",
                  "00070e555d5863674e53666975777c767c7d848b9299989f9ea1a8a9b5bc89e1e9efececf6ecf6ece8f3faf7fbfdfe"
                );
                createMiiCard(
                  container,
                  "Arian",
                  "ariankordi",
                  "https://github.com/ariankordi",
                  'Creator of <a target="_blank" href="https://mii-unsecure.ariankordi.net">Mii Renderer (REAL)</a> and was a big help with debugging many issues',
                  "080037030d020531020c030105040a0209000001000a011004010b0100662f04000214031603140d04000a020109"
                );
                createMiiCard(
                  container,
                  "obj",
                  "objecty",
                  "https://x.com/objecty_twitt",
                  "Composed the music for the site",
                  "00070e3b3f3c4649555e5c6675777a7a7f7e818890979ea5b4b7bebbbac188bdc6ced4ccd6cccfe3f5f8fffcff0513"
                );
                createMiiCard(
                  container,
                  "Timothy",
                  "Timimimi",
                  "https://github.com/Timiimiimii",
                  "Modeled many of the custom hats and helped with debugging",
                  "00070e3c4554575c616c6872818b909da0b1b7bec3cad0d78f93a1b1c0c78ce8f0f8fdf2f8f3f7ebebf6fdfcfffffb"
                );
                createMiiCard(
                  container,
                  "David J.",
                  "dwyazzo90",
                  "https://x.com/dwyazzo90",
                  "Helped with design and created the Wii U theme",
                  "0800450308040402020c0308060406020a0001000006000804000a0800326702010314031304190d04000a040109"
                );
                createMiiCard(
                  container,
                  "AnonymousUser98",
                  "AnonymousUser98",
                  "https://github.com/AnonymousUser98",
                  "Creator of this public instance",
                  "00070e71797b86899297a3a7abb5bdb5bebec5ccd3dae5ecebf6fdfe060d29525d646d808aa0aac0d4d7dedbe6eeed"
                );
              })
              .style({ flex: "1" })
          ),
          AddButtonSounds(
            new Html("button")
              .text("Help/Contact")
              .on("click", async () => {
                var m = Modal.modal(
                  "Contact",
                  "",
                  "body",
                  { text: "Cancel" },
                  { text: "OK" }
                );
                m.qs(".modal-body span")!.cleanup();
                m.qs(".modal-content")!.style({
                  "max-width": "100%",
                  "max-height": "100%",
                });
                const mb = m.qs(".modal-body")!;
                m.qs(".modal-content")!.style({ position: "relative" });
                const container = new Html("div")
                  .class("col")
                  .style({ gap: "0" })
                  .prependTo(mb);
                new Html("span")
                  .text("Here's where you can contact the author, Kat21. You can also contact AnonymousUser98 with a GitHub issue. Note that Kat21 might not be available to help because this is an unofficial fork.")
                  .style({
                    "font-size": "20px",
                    "flex-shrink": "0",
                    "margin-bottom": "-16px",
                  })
                  .prependTo(mb);

                // hey stop snooping! you'll ruin the fun :(
                new Html("a")
                  .text("secret?")
                  .style({
                    "font-size": "10px",
                    opacity: "0.3",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                  })
                  .on("click", (e) => {
                    m.qs("button")?.elm.click();

                    const mii = new Mii(
                      Buffer.from(
                        "AwEAwAAAAAAAAAAAAP91dC/5Fhz6rQAAAChiAG8AbwBlAHkAAAAAAAAAAAAAABRvEwBJBBJvQxgNVGUUABoTqAoAACmwUUhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE8TAGMyCAAANgACC2QA",
                        "base64"
                      )
                    );
                    importMiiConfirmation(mii, "Mii Creator (Special Mii)");
                  })
                  .appendTo(mb);

                createIconCard(
                  container,
                  "E-mail (Preferred)",
                  "mailto:datkat21.yt@gmail.com",
                  "datkat21.yt@gmail.com",
                  EditorIcons.contact_email
                );
                createIconCard(
                  container,
                  "Discord",
                  "",
                  "kat21",
                  EditorIcons.contact_discord
                );
                createIconCard(
                  container,
                  "File an issue on GitHub",
                  "https://github.com/datkat21/mii-creator",
                  "datkat21/mii-creator",
                  EditorIcons.contact_github
                );
                createIconCard(
                  container,
                  "File an issue on GitHub",
                  "https://github.com/AnonymousUser98/mii-creator",
                  "AnonymousUser98/mii-creator",
                  EditorIcons.contact_github
                );
              })
              .style({ flex: "1" })
          )
        ),
      new Html("strong").text("This site is not affiliated with Nintendo."),
      new Html("small")
        .text(`${Config.version.string} (${Config.version.name})`)
        .style({ cursor: "pointer" })
        .on("click", () => {
          replayUpdateNotice();
        })
      // new Html("strong").text("Please send any feedback or bug reports either through GitHub issues or to my email: datkat21.yt@gmail.com"),
    ),
    new Html("button").text("View on GitHub").on("click", () => {
      window.open("https://github.com/AnonymousUser98/mii-creator", "_blank");
    }),
    new Html("button").text("Enter Password").on("click", () => {
      var pwdEntry = prompt("Enter a secret password (in ALL CAPS) to unlock a special Mii.");
      // Use this tool to calculate hashes: https://cryptotools.net/hash
      // See the private reference document for a list of passwords
      /* NOTES ABOUT THE MIIC FORMAT
        To make a Mii get recognized as "non-editable" and "obtained through Mii Creator", replace bytes $10 to $15 with "2F F9 16 1C FA AD", then update the checksum at $5E-$5F with CRC-16/XMODEM.
        To convert from MIIC to FFSD, remove the last 12 bytes (the ones after the checksum).
      */
      switch(sha3_256(pwdEntry)) {
        case "ec0b1cd6a5685d948813af6bdbc84cd45a0c4a89d3f3d5615b3fc92f180a23d7":
          var mii = new Mii(
            Buffer.from(
              "A8EAwAAAAAAAAAAAAN8Zmi/5Fhz6rQAAARxKAEIAWgBTACAAUwBhAG0AdQBzAG0uBQBkAx5HQxzTM0UcixrbKBEAACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAPNMAAAMABYAAAAAAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        case "82145d50fd50a7a71ea2114bf484ab04b5a4aa9af7eca700f8cf96bc323ba0b6":
          alert("Tell that to Microsoft!");
          break;
        case "7f030c6ad313181913f2f1c104d2bce73362f606a6407ebe0297d4aab686acfa":
        case "a52252a98f9bb8e910a66e22d91fedabd4e27fa0bf826e995e8948d28f571f0b":
          var mii = new Mii(
            Buffer.from(
              "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAAABCAHIAaQBnAGgAdAAgAEcAdQB5AEdEDwA3CYfOBBqANEUQiBghaBAAACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAHuqAABaPAAAAAAAAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        case "550814f27f5408929d0a92461e33a1309f1d7a6cb0227814273a42ae82d4fba9":
          var mii = new Mii(
            Buffer.from(
              "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxLAGkAdABiAG8AZwBhAAAAAAAAAFpgBQBDATFlYxYjU0UScBDYCo0ANCGGWUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAH/8AAAMABYAAA8AAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        case "f908010a9e7efeb0f5d41e443abdc560ff1917fbde0454507fceddc701b781c3":
        case "4ffb69a6020d8c77ec66cb799df506bc829fc211e03d4f9265fa867f5a6af637":
          var mii = new Mii(
            Buffer.from(
              "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxOAGEAcgBpAGgAaQByAG8AAAAAAEBACQBACDKGQxgMFCQUrRIGDg4AAimhUUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAK/rAAAIAAAAAAAAAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        case "80fa1e682532c441a5ab85d367c5ffb42042b3a951483fc8099168e0aa2d805b":
        case "fa6faa5bdc6b6297d977c49780502e7a3eb60b9abc5b2ba86a0c0e7d5870637b":
        case "f1e24658b3a625595082c7fc290d1bc6a951f611d87c7407921d9f3f24943562":
          var mii = new Mii(
            Buffer.from(
              "A8EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAAChQAGkAeABlAGwAAAAAAAAAAAAAAE1ZDQA+CJlmJRoBU0QUZhQPSA8AACkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAF5mAAAKAAAAAAAAAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        case "9699ac448f27c249867e54f506e5fea2be4a528cec9a811e051ae215fa36e8f3":
        case "8ec7d6a7e7f37fca82d9a45238808fe996173fbe172758220c59c498c0e4fbb4":
          var mii = new Mii(
            Buffer.from(
              "AwEAQAAAAAAAAAAAgP9wmS/5Fhz6rQAAACxIAGEAeQBhAGIAdQBzAGEAAAAAAH5/bAB2AhGoJRgJY0YSzRASSqwAwCgAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAADOIAAAAAAAAAAAAAAAA",
              "base64"
            )
          );
          importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
          break;
        default:
          alert("Invalid password.");
      }
    }
  )
);
}

export type MiiLocalforage = {
  id: string;
  mii: string;
};

export const miiQRConversionWarning = async (miiData: Mii) => {
  if (miiData.hasExtendedColors() === true) {
    let result = await Modal.prompt(
      "Warning",
      "This Mii is using extended Switch colors, but those colors will never show up if you scan this QR Code anywhere outside of this app. Is this OK?",
      "body",
      false
    );
    if (result === false) return false;
  }
  return true;
};

export const miiFFSDWarning = async (miiData: Mii) => {
  if (miiData.hasExtendedColors() === true) {
    let result = await Modal.prompt(
      "Warning",
      'This Mii is using extended Switch colors and/or MiiCreator features, but those features will be lost when converting to FFSD.\nUse "Save MiiCreator data" or "Save CharInfo (Switch) data" if you want to keep the data.\nIs this OK?',
      "body",
      false
    );
    if (result === false) return false;
  }
  return true;
};
