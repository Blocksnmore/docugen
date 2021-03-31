module.exports = class {
  constructor(md) {
    md = '<article class="markdown-body">' + md + "</article>";
    this.md = '<link rel="stylesheet" href="/styles.css">' + md.split("\n").join("");
  }
};
