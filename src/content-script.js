(() => {
  const ROOT_CLASS = "ypp-player-controls";
  const PLAYER_SELECTOR = "#movie_player.html5-video-player";
  const VIDEO_SELECTOR = "video.html5-main-video";
  const namespace = globalThis.YouTubePlayerPlus;
  const settings = namespace.DEFAULT_SETTINGS;
  const controlDefinitions = namespace.createControlDefinitions(settings);

  let scheduledFrame = null;

  const createSeekIcon = (seconds) => {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "ypp-player-controls__icon");
    icon.setAttribute("viewBox", "0 0 64 64");
    icon.setAttribute("aria-hidden", "true");

    icon.innerHTML = `
      <g class="ypp-player-controls__arrow">
        <path d="m29 12-11 8 11 8" />
        <path d="M19 20a22 22 0 1 0 23.5-5" />
      </g>
      <text x="32" y="43">${seconds}</text>
    `;

    return icon;
  };

  const seekVideo = (player, deltaSeconds) => {
    const video = player.querySelector(VIDEO_SELECTOR);

    if (!video) {
      return;
    }

    video.currentTime = namespace.calculateSeekTarget(
      video.currentTime,
      video.duration,
      deltaSeconds,
    );
  };

  const stopYouTubeGesture = (event) => {
    event.stopPropagation();
  };

  const createControlButton = (player, definition) => {
    const button = document.createElement("button");
    const deltaSeconds = definition.direction * definition.seconds;

    button.type = "button";
    button.className = [
      "ypp-player-controls__button",
      `ypp-player-controls__button--${definition.id}`,
    ].join(" ");
    button.dataset.controlId = definition.id;
    button.setAttribute("aria-label", definition.label);
    button.title = definition.label;
    button.append(createSeekIcon(definition.seconds));

    button.addEventListener("pointerdown", stopYouTubeGesture);
    button.addEventListener("dblclick", stopYouTubeGesture);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      seekVideo(player, deltaSeconds);
    });

    return button;
  };

  const mountControls = (player) => {
    if (player.querySelector(`:scope > .${ROOT_CLASS}`)) {
      return;
    }

    const controls = document.createElement("div");
    controls.className = ROOT_CLASS;
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "追加の再生操作");

    for (const definition of controlDefinitions) {
      controls.append(createControlButton(player, definition));
    }

    player.append(controls);
  };

  const ensureControls = () => {
    scheduledFrame = null;

    const player = document.querySelector(PLAYER_SELECTOR);

    if (player) {
      mountControls(player);
    }
  };

  const scheduleEnsureControls = () => {
    if (scheduledFrame !== null) {
      return;
    }

    scheduledFrame = requestAnimationFrame(ensureControls);
  };

  const observer = new MutationObserver(scheduleEnsureControls);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("yt-navigate-finish", scheduleEnsureControls);
  scheduleEnsureControls();
})();
