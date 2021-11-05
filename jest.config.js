module.exports = {
  testURL: "http://localhost",
  bail: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "<rootDir>/lib/abstractions/file.js",
    "<rootDir>/lib/abstractions/folder.js",
    "<rootDir>/lib/abstractions/item.js"
  ]
};
