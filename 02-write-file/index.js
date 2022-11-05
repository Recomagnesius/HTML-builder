const fs = require("fs");
const path = require("path");
const readline = require("readline");

const outputFile = path.resolve(__dirname, "file.txt");

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt:
    "Hello! Please enter information that you want to record in the file\n",
});
fs.writeFile(path.resolve(__dirname, "file.txt"), "", (err) => {
  if (err) {
    throw err;
  }
  rl.prompt();
});
process.on("SIGINT", (err) => {
  if (err) throw err;
  console.log("enter ctrl + c");
});
rl.on("line", (input) => {
  if (input.toLowerCase() == "exit") {
    console.log("See you later!");
    rl.close();
  } else {
    fs.appendFile(outputFile, input, (err) => {
      if (err) throw err;
    });
  }
});
