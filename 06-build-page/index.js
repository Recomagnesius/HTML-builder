//Я ДОДЕЛАЮ, ПОЖАЛУЙСТА ОСТАВЬТЕ СВОИ КОТНАКТЫ ИЛИ ПРОВЕРЬТЕ К КОНЦУ СРОКА ЕСЛИ ЕСТЬ ТАКАЯ ВОЗМОЖНОСТЬ
const fs = require("fs");
const path = require("path");
const { text } = require("stream/consumers");

const projectDistPath = path.join(__dirname, "project-dist");

//check dir existance, if there is no dir - create dir, if there is dir - delete and create dir
fs.stat(projectDistPath, function (err) {
  if (!err) {
    fs.rm(projectDistPath, { force: true, recursive: true }, (err) => {
      if (err) console.log(err);
      else {
        fs.mkdir(projectDistPath, { recursive: true }, (err) => {
          if (err) console.log();
          else {
            buildPage();
          }
        });
      }
    });
  } else if (err.code === "ENOENT") {
    fs.mkdir(projectDistPath, { recursive: true }, (err) => {
      if (err) console.log();
      else {
        buildPage();
      }
    });
  }
});

async function buildPage() {
  const templatePath = path.join(__dirname, "template.html"); // Обьявление путей
  const stylesPath = path.join(__dirname, "styles");
  const assetsPath = path.join(__dirname, "assets");
  const copyAssetsPath = path.join(projectDistPath, "assets");
  const componentsPath = path.join(__dirname, "components");

  //копирование assets
  fs.mkdir(copyAssetsPath, (err) => {
    if (err) console.log(err);
    else {
      copyDirRecursive(assetsPath, copyAssetsPath);
    }
  });
  function copyFile(filePath, fileCopyPath) {
    fs.copyFile(filePath, fileCopyPath, (err) => {
      if (err) console.log(err);
    });
  }
  function copyDirRecursive(dirPath, dirCopyPath) {
    fs.readdir(dirPath, { withFileTypes: true }, (err, data) => {
      if (err) console.log(err);
      else {
        const items = data;
        items.forEach((item) => {
          const itemPath = path.join(dirPath, item.name);
          const itemCopyPath = path.join(dirCopyPath, item.name);
          if (item.isFile()) {
            copyFile(itemPath, itemCopyPath);
          } else {
            fs.mkdir(itemCopyPath, (err) => {
              if (err) console.log(err);
              else {
                copyDirRecursive(itemPath, itemCopyPath);
              }
            });
          }
        });
      }
    });
  }

  //запись html
  let htmlContent;
  fs.readdir(componentsPath, { withFileTypes: true }, (err, data) => {
    //чтение папки с html
    if (err) console.log(err);
    else {
      const components = data;
      let htmlContent;

      fs.readFile(templatePath, { encoding: "utf-8" }, (err, data) => {
        //запись шаблона html в переменную
        if (err) console.log(err);
        else {
          htmlContent = data;
          let realComponents = [];
          components.forEach((elem, index) => {
            const ext = path.extname(elem.name);
            if (elem.isFile() && ext == ".html") {
              realComponents.push(elem);
            }
          });
          // запись компонентов html в шаблон
          realComponents.forEach((elem, index, arr) => {
            const name = elem.name.split(".")[0];
            const ext = path.extname(elem.name);
            if (elem.isFile() && ext == ".html") {
              let readStream = fs.createReadStream(
                path.join(componentsPath, elem.name),
                "utf-8"
              );
              let fileContent = "";
              readStream.on("data", (chunk) => {
                fileContent += chunk;
              });
              readStream.on("end", () => {
                htmlContent = htmlContent.replace(`{{${name}}}`, fileContent);
                fs.writeFile(
                  path.join(projectDistPath, "index.html"),
                  "",
                  {
                    encoding: "utf-8",
                  },
                  (err) => {
                    if (err) console.log(err);
                    else {
                      if (index == arr.length - 1) {
                        fs.appendFile(
                          path.join(projectDistPath, "index.html"),
                          htmlContent,
                          (err) => {
                            if (err) console.log(err);
                          }
                        );
                      }
                    }
                  }
                );
              });
            }
          });
        }
      });
    }
  });
}
