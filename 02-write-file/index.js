const fs = require("fs");
const path = require("path");
const readline = require("readline");

const fileName = "file.txt";
const outputFile = path.join(__dirname, fileName);

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt:
    "Hello! Please enter information that you want to record in the file\n",
});
const parting = "See you later!";

fs.writeFile(path.resolve(__dirname, fileName), "", (err) => {
  if (err) {
    throw err;
  }
  rl.prompt();
});
rl.on("SIGINT", (err) => {
  if (err) throw err;
  console.log(parting);
  rl.close();
});
rl.on("line", (input) => {
  if (input.toLowerCase() == "exit") {
    console.log(parting);
    rl.close();
  } else {
    fs.appendFile(outputFile, input, (err) => {
      if (err) throw err;
    });
  }
});
