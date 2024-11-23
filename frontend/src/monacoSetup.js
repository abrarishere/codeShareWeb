import * as monaco from "monaco-editor";

// Function to initialize Monaco Editor
export function initializeEditor(container, value, theme, language) {
  return monaco.editor.create(container, {
    value: value,
    language: language,
    theme: theme,
    automaticLayout: true,
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
    },
  });
}

// Define Monaco Environment with manual worker paths
self.MonacoEnvironment = {
  getWorker: function (_, label) {
    switch (label) {
      case "json":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/json/json.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
      case "css":
      case "scss":
      case "less":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/css/css.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
      case "html":
      case "handlebars":
      case "razor":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/html/html.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
      case "typescript":
      case "javascript":
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/language/typescript/ts.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
      default:
        return new Worker(
          new URL(
            "monaco-editor/esm/vs/editor/editor.worker.js",
            import.meta.url,
          ),
          { type: "module" },
        );
    }
  },
};
