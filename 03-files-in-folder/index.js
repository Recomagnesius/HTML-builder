const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, "secret-folder");
const files = [];
fs.readdir(dirPath, { withFileTypes: true }, (err, objects) => {
  if (err) console.log(err);
  else {
    objects.forEach((file) => {
      files.push(file);
    });

    files.forEach((elem) => {
      if (elem.isFile()) {
        const file = {};
        file.name = elem.name.split(".")[0];
        file.ext = elem.name.split(".")[1];
        fs.stat(path.join(dirPath, elem.name), (err, stats) => {
          if (err) console.log(err);
          else {
            file.size = (stats.size / 1024).toFixed(3);
            console.log(`${file.name} - ${file.ext} - ${file.size}kb`);
          }
        });
      }
    });
  }
});
