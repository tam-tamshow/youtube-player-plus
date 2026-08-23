(() => {
  const namespace = (globalThis.YouTubePlayerPlus ??= {});

  namespace.DEFAULT_SETTINGS = Object.freeze({
    seekSeconds: 10,
  });

  namespace.createControlDefinitions = ({ seekSeconds }) =>
    Object.freeze([
      Object.freeze({
        id: "seek-backward",
        direction: -1,
        seconds: seekSeconds,
        label: `${seekSeconds}秒巻き戻し`,
      }),
      Object.freeze({
        id: "seek-forward",
        direction: 1,
        seconds: seekSeconds,
        label: `${seekSeconds}秒早送り`,
      }),
    ]);

  namespace.calculateSeekTarget = (currentTime, duration, deltaSeconds) => {
    const target = Math.max(0, currentTime + deltaSeconds);

    return Number.isFinite(duration) ? Math.min(target, duration) : target;
  };
})();
