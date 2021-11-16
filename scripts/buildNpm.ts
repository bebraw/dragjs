// ex. scripts/build_npm.ts
import { build } from "https://deno.land/x/dnt@0.7.0/mod.ts";

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    // package.json properties
    name: "dragjs",
    version: Deno.args[0],
    description:
      "Simple utility to make it easier to implement drag based things (ie. sliders and such)",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/bebraw/dragjs.git",
    },
    bugs: {
      url: "https://github.com/bebraw/dragjs/issues",
    },
    keywords: ["drag", "dragging", "draggable"],
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
