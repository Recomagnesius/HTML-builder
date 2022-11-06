const fs = require("fs");
const path = require("path");
const { text } = require("stream/consumers");

const copyDirPath = path.join(__dirname, "files-copy");
const dirPath = path.join(__dirname, "files");

//check dir existance, if there is no dir - create dir, if there is dir - delete and create dir
fs.stat(copyDirPath, function (err) {
  if (!err) {
    fs.rmdir(copyDirPath, (err) => {
      if (err) console.log(err);
      else {
        fs.mkdir(copyDirPath, (err) => {
          if (err) console.log();
          else {
            copyDir();
          }
        });
      }
    });
  } else if (err.code === "ENOENT") {
    fs.mkdir(copyDirPath, (err) => {
      if (err) console.log();
      else {
        copyDir();
      }
    });
  }
});

function copyDir() {
  fs.readdir(dirPath, { withFileTypes: true }, (err, objects) => {
    if (err) console.log(err);
    else {
      objects.forEach((file) => {
        const copyFilePath = path.join(copyDirPath, file.name);
        const filePath = path.join(dirPath, file.name);
        fs.copyFile(filePath, copyFilePath, (err) => {
          if (err) console.log(err);
        });
        // let fileContent = "";
        // fs.writeFile(copyFilePath, "", (err) => {
        //   if (err) console.log(err);
        //   else {
        //     fs.readFile(filePath, (err, data) => {
        //       if (err) console.log(err);
        //       else {
        //         fs.appendFile(copyFilePath, data, (err) => {
        //           if (err) console.log(err);
        //         });
        //       }
        //     });
        //   }
        // });
      });
    }
  });
}
