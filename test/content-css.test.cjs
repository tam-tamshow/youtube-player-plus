const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(
  path.resolve(__dirname, "../src/content.css"),
  "utf8",
);

test("追加の再生ボタンはプレーヤーにマウスポインターが乗るまで隠す", () => {
  assert.match(
    css,
    /\.ypp-player-controls\s*\{[^}]*visibility:\s*hidden;[^}]*opacity:\s*0;/s,
  );
  assert.match(
    css,
    /\.html5-video-player:hover\s*>\s*\.ypp-player-controls\s*\{[^}]*visibility:\s*visible;[^}]*opacity:\s*1;/s,
  );
});
