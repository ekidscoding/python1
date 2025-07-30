const repl = document.getElementById("repl");
const run = document.getElementById("run");
const output = document.getElementById("output");


function addToOutput(s) {
  output.value = s;
}

let outputBuffer = [];

async function main() {
  let pyodide = await loadPyodide({
    stdout: (msg) => (outputBuffer.push(msg)),
    stderr: (msg) => (console.error("Python Error:", msg)),
  });

  const fileContent = await fetch(
    "https://raw.githubusercontent.com/ekidscoding/python/refs/heads/main/examples/kirilche/4_1.py",
  ).then((v) => v.text());

  repl.value = fileContent;

  run.addEventListener("click", () => {
    const code = repl.value;
    outputBuffer = [];
    pyodide.runPython(code);
    addToOutput(outputBuffer.join("\n"));
  });
}
main();