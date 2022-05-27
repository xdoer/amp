const path = require("path");

// amp 配置文件
module.exports = {
  platform: "wx",
  appEntry: path.resolve("src/app.json"),
  style: ".less",
  entryIncludes: [
    path.resolve("src/app.ts"),
    path.resolve("src/app.less"),
    path.resolve("src/app.json?asConfig&type=app"),
  ],
};
