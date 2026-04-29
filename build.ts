import { stripDebug } from "@namchee/bun-plugin-strip-debug";
import { join } from "path";
import { watch } from "fs";
import * as sass from "sass";
import type { BuildOutput } from "bun";

/**
 * Builds a TypeScript file to a directory.
 */
export async function compile(
  filePaths: string[],
  outputDir: string
): Promise<void> {
  const output = (await Bun.build({
    entrypoints: filePaths,
    outdir: outputDir,
    splitting: false,
    emitDCEAnnotations: true,
    sourcemap: "none",
    // Optional production optimisations:
    // minify: {
    //   identifiers: true,
    //   syntax: true,
    //   whitespace: true,
    // },
    // plugins: [stripDebug({ exclude: ["warn"] })],
  }).catch((e) => {
    console.error("Failed to build:", e);
    return null;
  })) as BuildOutput | null;

  if (!output) return;

  if (output.logs?.length) {
    for (const log of output.logs) {
      console.error(log);
    }
  }
}

async function build() {
  try {
    await compile(
      [
        join(import.meta.dir, "src/main.ts"),
        join(import.meta.dir, "src/helper.ts"),
        join(import.meta.dir, "src/popup.ts"),
        join(import.meta.dir, "src/worker.ts"),
      ],
      "./public/dist/"
    );
  } catch (e) {
    console.error(e);
  }

  try {
    const mainScss = sass.compile("./src/scss/main.scss");
    await Bun.write("./public/dist/main.css", mainScss.css);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Detect dev mode via CLI flag
 */
const isDev = process.argv.includes("--dev");

if (isDev) {
  console.log("Watching...");

  watch(
    join(import.meta.dir, "./src"),
    { recursive: true },
    async (event, filename) => {
      console.log(`Detected ${event} in ${filename}`);
      await build();
    }
  );

  // initial build
  await build();
} else {
  // production build (CI-safe, exits immediately)
  await build();
  console.log("Build complete");
  process.exit(0);
}
