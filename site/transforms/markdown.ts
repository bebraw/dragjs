import { marked } from "https://unpkg.com/marked@4.0.0/lib/marked.esm.js";
import { install, tw } from "https://esm.sh/@twind/core@1.1.1"; // 1.1.3 doesn't work!
import highlight from "https://unpkg.com/@highlightjs/cdn-assets@11.3.1/es/core.min.js";
import highlightJS from "https://unpkg.com/highlight.js@11.3.1/es/languages/javascript";
import highlightTS from "https://unpkg.com/highlight.js@11.3.1/es/languages/typescript";
import highlightXML from "https://unpkg.com/highlight.js@11.3.1/es/languages/xml";
import twindSetup from '../twindSetup.ts'

install(twindSetup);

highlight.registerLanguage("js", highlightJS);
highlight.registerLanguage("javascript", highlightJS);
highlight.registerLanguage("html", highlightXML);
highlight.registerLanguage("ts", highlightTS);
highlight.registerLanguage("typescript", highlightTS);

marked.setOptions({
  gfm: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  highlight: (code: string, language: string) =>
    highlight.highlight(code, { language }).value,
});

function transformMarkdown(input: string) {
  // https://github.com/markedjs/marked/issues/545
  const tableOfContents: { slug: string; level: number; text: string }[] = [];

  // https://marked.js.org/using_pro#renderer
  // https://github.com/markedjs/marked/blob/master/src/Renderer.js
  marked.use({
    renderer: {
      code(code: string, infostring: string): string {
        const lang = ((infostring || "").match(/\S*/) || [])[0];

        // @ts-ignore How to type this?
        if (this.options.highlight) {
          // @ts-ignore How to type this?
          const out = this.options.highlight(code, lang);

          if (out != null && out !== code) {
            code = out;
          }
        }

        code = code.replace(/\n$/, "") + "\n";

        if (!lang) {
          return "<pre><code>" +
            code +
            "</code></pre>\n";
        }

        return '<pre class="' +
          tw`overflow-auto -mx-4 md:mx-0 p-2 bg-gray-100 my-4` +
          '"><code class="' +
          // @ts-ignore How to type this?
          this.options.langPrefix +
          lang +
          '">' +
          code +
          "</code></pre>\n";
      },
      paragraph(text: string) {
        return '<p class="' + tw("my-2") + '">' + text + "</p>";
      },
      heading(
        text: string,
        level: number,
        raw: string,
        slugger: { slug: (s: string) => string },
      ) {
        const slug = slugger.slug(raw);

        tableOfContents.push({ slug, level, text });

        const classes = {
          1: "inline-block underline text-gray-900 font-extrabold leading-3 text-3xl mt-0 mb-8",
          2: "inline-block underline text-gray-900 font-bold leading-4 text-xl mt-4 mb-2",
          3: "inline-block underline text-gray-900 font-semibold leading-5 text-lg mt-1 mb-1",
          4: "inline-block underline text-gray-900 font-medium leading-6 mt-1 mb-0.5",
        };

        return (
          '<a class="' +
          tw(classes[level]) +
          '" href="#' +
          slug +
          '"><h' +
          level +
          ' class="' +
          tw`inline` +
          '"' +
          ' id="' +
          slug +
          '">' +
          text +
          "</h" +
          level +
          ">" +
          "</a>\n"
        );
      },
      link(href: string, title: string, text: string) {
        if (href === null) {
          return text;
        }
        let out = '<a class="' + tw`underline` + '" href="' + href + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += ">" + text + "</a>";
        return out;
      },
      list(body: string, ordered: string, start: number) {
        const type = ordered ? "ol" : "ul",
          startatt = ordered && start !== 1 ? ' start="' + start + '"' : "",
          klass = ordered
            ? "list-decimal list-outside my-2"
            : "list-disc list-outside my-2";
        return (
          "<" +
          type +
          startatt +
          ' class="' +
          tw(klass) +
          '">\n' +
          body +
          "</" +
          type +
          ">\n"
        );
      },
    },
  });

  return { content: marked(input), tableOfContents };
}

export default transformMarkdown;
