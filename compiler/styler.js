module.exports = class {
  constructor(md) {
    md = '<article class="markdown-body">' + md + "</article>";
    this.md = '<link rel="stylesheet" href="'+require("../config.json").cssurl+'">' + md.split("\n").join("");
  }
};
