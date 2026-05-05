// Configuration file used client-side.

// Settings relating to local rendering.
const useRendererServer = true; // Allow use of the renderer server (legacy rendering)
const fflResourcePath = "FFLResHigh.dat"; // Configure the path for where the resource file is located.

// Instance of FFL-Testing/Mii Studio API compatible renderer.
// const baseURL = "http://localhost:5000/miis/image"; // <-- Uncomment this when using local FFL-testing for development
const baseURL = "https://mii-unsecure.ariankordi.net/miis/image"; // <-- Comment this when committing for prod
// ^^ image.png, image.glb
const newApiParams = true;
// false if using FFL-Testing-with-hats
// true if using new FFL-Testing version with headwear

// Origin used for NNID, PNID, and random NNID fetch.
// Details: https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/README.md
const nnidFetchOrigin = "https://mii-unsecure.ariankordi.net";

export const Config = {
  renderer: {
    baseURL,
    useRendererServer,
    fflResourcePath,
    renderFFLMakeIcon: `${baseURL}.png?shaderType=miitomo&type=fflmakeicon&width=360&verifyCharInfo=0`,
    renderHeadshotURL: `${baseURL}.png?shaderType=wiiu&type=face&width=260&verifyCharInfo=0`,
    renderHeadshotURLNoParams: `${baseURL}.png`,
    renderFullBodyURL: `${baseURL}.png?shaderType=wiiu&type=all_body_sugar&width=420&verifyCharInfo=0&scale=1`,
    renderFullBodyAltURL: `${baseURL}.png?shaderType=wiiu&type=all_body_sugar&width=960&verifyCharInfo=0&scale=1`,
    render3DHeadURL: `${baseURL}.glb?shaderType=wiiu&type=face&width=260&verifyCharInfo=0`,
    renderFaceURL: `${baseURL}.png?scale=1&drawStageMode=mask_only&verifyCharInfo=0`,

    // Parameters determined by the specific version of the server used
    hatTypeParam: newApiParams ? "headwearIndex" : "hatType",
    hatTypeAdd: newApiParams ? 0 : 0,
    hatColorParam: newApiParams ? "headwearColor" : "hatColor",
    hatColorAdd: newApiParams ? -1 : 0,

    // Enable/disable use of 3D mode in editor only
    allow3DMode: true,
  },
  apis: {
    // For fetching data from various sources.
    nnidRandomURL: `${nnidFetchOrigin}/mii_data_random`,
    // Caller has to encodeURIComponent before passing:
    nnidFetchURL: (nnid: string) => `${nnidFetchOrigin}/mii_data/${nnid}`,
    pnidFetchURL: (pnid: string) =>
      `${nnidFetchOrigin}/mii_data/${pnid}?api_id=1`,
    // Configure Sentry here.
    useSentry: false,
    sentryURL: "ENTER_SENTRY_URL_HERE",
  },
  mii: {
    scalingMode: "scaleApply",
    // ^^ scaleLimit, scaleLimitClampY, scaleApply
  },
  version: {
    string: "v0.10.1",
    name: "Public Instance",

    // ignore that I'm just writing HTML here
    changelog: `
    <h1 style="font-size: 20px;text-align: center;">v0.10.1 - Public Instance & New Features</h1>

    <div class="flex-group">
      <img draggable="false" width=96 height=96 src="https://i.imgur.com/1dqrqiN.png">
      <div class="col" style="gap:12px">
        <small>AnonymousUser98</small>
        <div>Welcome to the public no-login version of Mii Creator!</div>
      </div>
    </div>

    <!--
    <div style="text-align:center;margin:12px 0">
      <p style="margin-bottom:0"><strong style="color:var(--error-color)">Please <a target="_blank" href="mailto:datkat21.yt@gmail.com">contact me</a> <small>(kat21)</small> if you have any feedback, feature requests, or bug reports.</strong></p>
      <small>(Some people are just not aware that kat21 made this app, not ariankordi. if you are one of those people you should know by now. Also this project is named "Mii Creator", not "Mii Creator Web," or any other "mii maker" thing. 🙂)</small>
    </div>
    
    <h3>NEW: v0.9.3.1 - Extremely Small Patch Update</h3>
    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li>Testing bringing back 3D mode, let's see how the server performs...</li>
    </ul>
    <h3>NEW: v0.9.3 - Very Small Patch Update</h3>
    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li style="color:var(--error-color)"><s>Temporarily disabled 3D mode in the editor to save on bandwidth while I try and work around a solution</s></li>
      <li style="color:var(--selection-color)">A lot of people are coming from FlipZ's tweet but that's OK, just know that I (kat21) made this website because the credit wasn't very clear</li>
    </ul>
    <h3>v0.9.2 - Small Patch Update</h3>
    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li style="color:var(--selection-color)">A LOT of new faces have shown up over the past few days, if you come from X/Twitter or YouTube, say hi!</li>
      <li>Some hat models have been improved! Beanie, cap and cat ears were properly fixed.</li>
      <li>2D renders now show hat textures!</li>
      <li>Some broken expressions (blank face, cat face, dog face) work now</li>
      <li>Bug fix Tomodachi Life QR codes not displaying the error message (they still do not work do not ask me about this)</li>
      <li>Bug fix hats clipping the mask</li>
      <li style="color:var(--gold-color)">More secret Special Miis added!</li>
    </ul>

    <h3>v0.9.1 - Patch Update</h3>

    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li>Bug fix the contact menu not closing</li>
      <li>Wii U theme small design tweaks to fix some stuff broken by the new UI</li>
      <li>Rename "Glossy" shader to "Toon"</li>
      <li>Fix a bug where the Wii U animations were sped up.</li>
      <li style="color:var(--gold-color)">Secret Special Miis can be obtained through random menus (there is only 1 for now)</li>
    </ul>
    -->

    <h3>Changes & New Features</h3>

    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li>Modified the render URLs and relative paths to make it work with GitHub Pages</li>
      <li>Added a button to open the GitHub repository in a new tab</li>
      <li>Re-enabled the Switch shader option in settings (it works fine for me)</li>
      <li>Changed the "Save/Exit" button to "Save / Exit" because it looks better with the spaces there</li>
      <ul>
        <li>I also fixed the capitalization in "Exit Without Saving"</li>
      </ul>
      <li>Updated the <i>Credits</i> and <i>Help/Contact</i> screens</li>
      <li>Added an easter egg that involves getting 30 extra lives</li>
      <li>Added some secret Miis that can be unlocked by entering a password</li>
      <li>Added an option to import a Mii from Base64 data</li>
      <li>Added a mysterious one-question quiz</li>
    </ul>

    <!--
    <h3>Plans</h3>
    <ul style="display:flex;flex-direction:column;gap:8px;line-height:1.75rem">
      <li>More theme options</li>
      <li>Online account system for saving your mii data across devices</li>
    </ul>

    <h3>Attributions / Acknowledgements</h5>

    <p>These people helped me with the new update!</p>

    <div class="flex-group" style="justify-content:flex-start">
      <div class="flex-group" style="gap:0px;justify-content:flex-start">
        <img draggable="false" width=96 height=96 src="${baseURL}.png?type=variableiconbody&data=080037030d020531020c030105040a0209000001000a011004010b0100662f04000214031603140d04000a020109&shaderType=switch&width=96&source=update&characterYRotate=8&bodyType=switch">
        <div class="col" style="gap:12px;flex:1">
          <small>Arian <a href="https://github.com/ariankordi">(@ariankordi)</a></small>
          <div>Wrote code for the new QR code feature, helped with Git, debugging, advice</div>
        </div>
      </div>
      <div class="flex-group" style="gap:0px;justify-content:flex-start">
        <img draggable="false" width=96 height=96 src="${baseURL}.png?type=variableiconbody&data=00070e3c4554575c616c6872818b909da0b1b7bec3cad0d78f93a1b1c0c78ce8f0f8fdf2f8f3f7ebebf6fdfcfffffb&shaderType=switch&width=96&source=update&characterYRotate=8&bodyType=switch">
        <div class="col" style="gap:12px;flex:1">
          <small>Timothy <a href="https://github.com/Timiimiimii">(@Timimimi)</a></small>
          <div>Implemented the new <code>.charinfo</code> <a href="https://github.com/datkat21/mii-creator/pull/15">export format</a></div>
        </div>
      </div>
      <div class="flex-group" style="gap:0px;justify-content:flex-start">
        <img draggable="false" width=96 height=96 src="${baseURL}.png?type=variableiconbody&data=00070e3b3f3c4649555e5c6675777a7a7f7e818890979ea5b4b7bebbbac188bdc6ced4ccd6cccfe3f5f8fffcff0513&shaderType=switch&width=96&source=update&characterYRotate=8&bodyType=switch">
        <div class="col" style="gap:12px;flex:1">
          <small>obj <a href="https://x.com/objecty_twitt">(@objecty)</a></small>
          <div>Helped with designing some new icons</div>
        </div>
      </div>
      <div class="flex-group" style="gap:0px;justify-content:flex-start">
        <img draggable="false" width=96 height=96 src="${baseURL}.png?type=variableiconbody&data=0800450308040402020c0308060406020a0001000006000804000a0800326702010314031304190d04000a040109&shaderType=switch&width=96&source=update&characterYRotate=8&bodyType=switch">
        <div class="col" style="gap:12px;flex:1">
          <small>David J. <a href="https://x.com/dwyazzo90">(@dwyazzo90)</a></small>
          <div>Provided suggestions and ideas</div>
        </div>
      </div>
      <div class="flex-group" style="gap:0px;justify-content:flex-start">
        <img draggable="false" width=96 height=96 src="${baseURL}.png?type=variableiconbody&data=00070e283208131d43484b524c515a5a606f75838a919ea5b4b7bebbb3ba8bced1d8e1fc03171d191b262d2e313745&shaderType=switch&width=96&source=update&characterYRotate=8&bodyType=switch">
        <div class="col" style="gap:12px;flex:1">
          <small>justcamtro <a href="https://x.com/justcamtro">(@justcamtro)</a></small>
          <div>Tested the new update and gave feedback</div>
        </div>
      </div>
    </div>
    -->

    <p style="margin-bottom:0;text-align:center"><strong>You can view this message again in Settings.</strong></p>
    `,
  },
};
