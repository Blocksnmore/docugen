const fs = require("fs");
const marked = require("marked");
const sanitizehtml = require("sanitize-html");
const styler = require("./styler.js");
console.log("Starting DocuGen Version " + require("../package.json").version);
var docjson = [];

if (fs.existsSync("." + require("../config.json").output + "/"))
  fs.rmdirSync("." + require("../config.json").output + "/", {
    recursive: true,
  });
if (!fs.existsSync("." + require("../config.json").input + "/")) {
  console.log("MARKDOWN FOLDER NOT MADE! Creating");
  fs.mkdirSync("." + require("../config.json").input + "/");
}

docugen("");

async function docugen(directory) {
  fs.readdir(
    "." + require("../config.json").input + "/" + directory,
    async (err, file) => {
      if (!file || file.length < 1) return;
      let dirs = file.filter((f) => !isFile(directory + "/" + f));
      let files = file.filter((f) => isFile(directory + "/" + f));
      dirs.forEach((f) => {
        docugen(f);
      });
      files.forEach(async (f) => {
        let md = await marked(
          fs.readFileSync(
            "." + require("../config.json").input + "/" + directory + "/" + f,
            "utf-8"
          )
        );
        md = await sanitizehtml(md);
        let dir =
          "." +
          require("../config.json").output +
          "/" +
          directory +
          (directory === "" ? "" : "/") +
          (f.toLowerCase().endsWith(".md")
            ? f.toLowerCase() ===
              require("../config.json").main.toLowerCase() + ".md"
              ? "index.html"
              : f.toString().substring(0, f.toString().length - 3) + ".html"
            : f.toString());
        fs.mkdirSync(
          "." +
            require("../config.json").output +
            "/" +
            directory +
            (directory === "" ? "" : "/")
        );
        fs.writeFileSync(dir, new styler(md).md);
      });
    }
  );
}
function isFile(file) {
  return !fs
    .lstatSync("." + require("../config.json").input + "/" + file)
    .isDirectory();
}
