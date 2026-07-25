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

export const newFromBase64 = () => {
    function getBase64(miiDataInput) {
        var mii = new Mii(
        Buffer.from(
            miiDataInput,
            "base64"
        )
        );
        importMiiConfirmation(mii, "Imported from Base64");
    }
    var b64input = prompt("Type or paste the Base64 data:");
    var pwdEntry = b64input;
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
    case "888f0e5af87aa49835b77ab664d9de60b1f8318f422c657fd6244b437ae7367c":
    case "01e9466decafd071413a87b240b889446f18db7cde7cddef0799f34fcd72656a":
    case "35e62c48c303a9b08f62ef44e0602497675a22a00238674abfee691d6eb8b84d":
    case "992af5d9a027a3ec29065e0efd2cf9b05ba906118ee4c382e18476389e40e34b":
    case "2f73b18efb677656ae27e2243432efa8182088acfc9c3d4e45b9e7e81d140d46":
        var mii = new Mii(
        Buffer.from(
            "A0EAQAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxQAGkAZQByAG8AZwBpAAAAAAAAAGFfBbArBPFGYxYhQ4MShhAWSA4AGCkAUkhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAABw7AAwLAAAAAAAAAAAA",
            "base64"
        )
        );
        importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
        break;
    case "1d5a8dba1e03d241137ce785c0c55696b1aaee1bcc5f96a2d1a5f631d80e99af":
        var mii = new Mii(
        Buffer.from(
            "AwEAwAAAAAAAAAAAAP9wmS/5Fhz6rQAAACxaAGEAbQBtAGkAcwAAAAAAAAAAAFpmBQBWAIJmZBgzVEQUixIXqI4AHCmCUUhQSgBpAGYAZgB5AFAAbwBwAEoAcgAAAGVGAAAKAAAAAAAAAAAA",
            "base64"
        )
        );
        importMiiConfirmation(mii, "Mii Creator (Secret Mii)");
        break;
    default:
        getBase64(b64input);
    }
}
