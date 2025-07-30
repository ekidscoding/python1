// Просте отримання DOM-елементів
const repl = document.getElementById("repl");
const run = document.getElementById("run");
const output = document.getElementById("output");

function addToOutput(s) {
  output.value = s;
}

let outputBuffer = [];
let pyodide;
let monacoEditor;

async function main() {
  // Завантаження Pyodide
  pyodide = await loadPyodide({
    stdout: (msg) => outputBuffer.push(msg),
    stderr: (msg) => console.error("Python Error:", msg),
  });

  // Завантаження коду з GitHub
  const fileContent = await fetch(
    "https://raw.githubusercontent.com/ekidscoding/python/refs/heads/main/examples/kirilche/4_1.py"
  ).then((res) => res.text());

  // Динамічне імпортування Monaco Editor
  const monaco = await import("https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/+esm");

  // Ініціалізація редактора
  monacoEditor = monaco.editor.create(repl, {
    value: fileContent,
    language: "python", // https://github.com/microsoft/monaco-editor/tree/f420968fc91d2d10d9d3e47dc52e2f2bda0778dd/src/basic-languages
    theme: "vs",        // 'vs', 'vs-dark' or 'hc-black'
    automaticLayout: true,
  });

  // Обробка кнопки запуску
  run.addEventListener("click", () => {
    const code = monacoEditor.getValue();
    outputBuffer = [];
    pyodide.runPython(code);
    addToOutput(outputBuffer.join("\n"));
  });
}

main();
