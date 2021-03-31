module.exports = class {
  constructor(md) {
    md = "<style>"+require("fs").readFileSync("./compiler/css.css", "utf8")+"</style>" + md;
    this.md = '<article class="markdown-body">' + md + "</article>";
  }
};
