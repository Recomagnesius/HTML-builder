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
  // console.log("asdsad");
  const templatePath = path.join(__dirname, "template.html"); // Обьявление путей
  const stylesPath = path.join(__dirname, "styles");
  const assetsPath = path.join(__dirname, "assets");
  const copyAssetsPath = path.join(projectDistPath, "assets");
  const componentsPath = path.join(__dirname, "components");

  let htmlContent;

  let assets;

  fs.readdir(assetsPath, { withFileTypes: true }, (err, data) => {
    if (err) console.log(err);
    else {
      assets = data;
      assets.forEach((elem) => {
        recursive(elem, assetsPath, copyAssetsPath);
      });
    }
  });
  // recursive();
  function recursive(item, itemPath, copyItemPath) {
    if (item.isFile()) {
      fs.copyFile(itemPath, copyItemPath, (err) => {
        if (err) console.log(err);
      });
    } else {
      fs.mkdir(path.join(copyItemPath, item.name), (err) => {
        if (err) console.log();
        else {
        }
      });
    }
  }
  //запись html
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

          // запись компонентов html в шаблон
          components.forEach((elem) => {
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
                let writeStream = fs.createWriteStream(
                  path.join(projectDistPath, "index.html"),
                  "utf-8"
                );
                writeStream.write(htmlContent);
              });
            }
          });
        }
      });
    }
  });
}
