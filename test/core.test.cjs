const test = require("node:test");
const assert = require("node:assert/strict");

delete globalThis.YouTubePlayerPlus;
require("../src/core.js");

const {
  DEFAULT_SETTINGS,
  calculateSeekTarget,
  createControlDefinitions,
} = globalThis.YouTubePlayerPlus;

test("MVPの既定秒数は10秒である", () => {
  assert.equal(DEFAULT_SETTINGS.seekSeconds, 10);
});

test("秒数に応じた巻き戻し・早送り操作を生成する", () => {
  assert.deepEqual(createControlDefinitions({ seekSeconds: 15 }), [
    {
      id: "seek-backward",
      direction: -1,
      seconds: 15,
      label: "15秒巻き戻し",
    },
    {
      id: "seek-forward",
      direction: 1,
      seconds: 15,
      label: "15秒早送り",
    },
  ]);
});

test("移動先を動画の再生範囲内に収める", () => {
  assert.equal(calculateSeekTarget(5, 120, -10), 0);
  assert.equal(calculateSeekTarget(115, 120, 10), 120);
  assert.equal(calculateSeekTarget(50, 120, 10), 60);
});

test("ライブ動画など再生時間が未確定の場合も移動できる", () => {
  assert.equal(calculateSeekTarget(50, Number.NaN, 10), 60);
});
