import markdown from "./transforms/markdown.ts";

async function processMarkdown(filename: string) {
  return markdown(await Deno.readTextFile(filename));
}

export { processMarkdown };
