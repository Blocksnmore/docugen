const fs = require("fs");
const marked = require("marked");
const sanitizehtml = require("sanitize-html");
const styler = require("./styler.js");
const config = require("../config.json");
console.log("Starting DocuGen Version " + require("../package.json").version);
var docjson = [];

if (fs.existsSync("." + config.output + "/"))
  fs.rmdirSync("." + config.output + "/", {
    recursive: true,
  });
if (!fs.existsSync("." + config.input + "/")) {
  console.log("MARKDOWN FOLDER NOT MADE! Creating");
  fs.mkdirSync("." + config.input + "/");
}
docugen("");

async function docugen(directory) {
  fs.readdir("." + config.input + "/" + directory, async (err, file) => {
    if (!file || file.length < 1) return;
    let dirs = file.filter((f) => !isFile(directory + "/" + f));
    let files = file.filter((f) => isFile(directory + "/" + f));
    dirs.forEach((f) => {
      docugen(f);
    });
    files.forEach(async (f) => {
      let md = await marked(
        fs.readFileSync("." + config.input + "/" + directory + "/" + f, "utf-8")
      );
      md = await sanitizehtml(md);
      let dir =
        "." +
        config.output +
        "/" +
        directory +
        (directory === "" ? "" : "/") +
        (f.toLowerCase().endsWith(".md")
          ? f.toLowerCase() === config.main.toLowerCase() + ".md"
            ? "index.html"
            : f.toString().substring(0, f.toString().length - 3) + ".html"
          : f.toString());
      fs.mkdirSync(
        "." + config.output + "/" + directory + (directory === "" ? "" : "/")
      );
      fs.writeFileSync(dir, new styler(md).md);
      if (!fs.existsSync("." + config.output) + "/styles.css")
        fs.writeFileSync(
          "." + config.output + "/styles.css",
          fs.readFileSync("./compiler/css.css")
        );
    });
  });
}

function isFile(file) {
  return !fs.lstatSync("." + config.input + "/" + file).isDirectory();
}
