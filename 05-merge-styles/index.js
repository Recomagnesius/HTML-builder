const fs = require("fs");
const path = require("path");

const stylesPath = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    fs.writeFile(bundlePath, "", (err) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          if (file.isFile()) {
            const filePath = path.join(stylesPath, file.name);
            console.log(filePath);
            const name = file.name;
            const ext = path.extname(name);
            if (ext == ".css") {
              fs.readFile(filePath, (err, data) => {
                if (err) console.log(err);
                else {
                  fs.appendFile(bundlePath, data, (err) => {
                    if (err) console.log(err);
                  });
                }
              });
            }
          }
        });
      }
    });
  }
});
