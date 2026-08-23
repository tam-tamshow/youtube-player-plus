const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "manifest.json"), "utf8"),
);

test("Manifest V3のChrome拡張として構成されている", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.content_scripts.length, 1);
  assert.ok(manifest.content_scripts[0].matches.includes("https://www.youtube.com/*"));
});

test("マニフェストから参照するファイルがすべて存在する", () => {
  const contentScript = manifest.content_scripts[0];
  const referencedFiles = [...contentScript.js, ...contentScript.css];

  for (const referencedFile of referencedFiles) {
    assert.ok(
      fs.existsSync(path.join(projectRoot, referencedFile)),
      `${referencedFile} が存在する`,
    );
  }
});
