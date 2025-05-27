// story-points.js - Multi-coin Story Point Tracker with Flip Animation, Sound, and GM Coin Count Control

const MODULE_ID = "story-points";
const SOCKET_NAME = "module.story-points";
const FLIP_SOUND_PATH = `modules/${MODULE_ID}/sounds/flip.ogg`;

let coinStates = {};

function initializeCoinStates(count) {
  coinStates = {};
  for (let i = 1; i <= count; i++) {
    coinStates[`coin${i}`] = "gm";
  }
}

function updateAllClientsCoinCount(count) {
  initializeCoinStates(count);
  const container = document.getElementById("story-points-container");
  if (container) container.remove();
  createFloatingWindow();
}

function createFloatingWindow() {
  let container = document.getElementById("story-points-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "story-points-container";
    container.style.position = "absolute";
    container.style.top = "100px";
    container.style.left = "100px";
    container.style.zIndex = 10000;
    container.style.background = "none";
    container.style.border = "none";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.cursor = "default";
    document.body.appendChild(container);

    makeDraggable(container);
  }

  Object.keys(coinStates).forEach(renderCoin);
}

function renderCoin(coinId) {
  let container = document.getElementById("story-points-container");
  if (!container) return;

  let coin = document.getElementById(`story-point-${coinId}`);
  if (!coin) {
    coin = document.createElement("img");
    coin.id = `story-point-${coinId}`;
    coin.style.width = "50px";
    coin.style.height = "50px";
    coin.style.transition = "transform 0.4s ease";
    coin.style.cursor = "pointer";

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    coin.addEventListener("mousedown", (e) => {
      isDragging = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    coin.addEventListener("mouseup", (e) => {
      const dx = Math.abs(e.clientX - dragStartX);
      const dy = Math.abs(e.clientY - dragStartY);
      if (dx < 5 && dy < 5) {
        flipCoin(coinId);
      }
    });

    container.appendChild(coin);
  }

  coin.src = `modules/${MODULE_ID}/icons/${coinStates[coinId]}.png`;
  coin.alt = coinStates[coinId];
  coin.title = `Click to flip (${coinId})`;
}

function playFlipSound() {
  AudioHelper.play({ src: FLIP_SOUND_PATH, volume: 0.8, autoplay: true, loop: false }, true);
}

function flipCoin(coinId) {
  const currentState = coinStates[coinId];
  const newState = currentState === "gm" ? "player" : "gm";

  if (currentState === "gm" && newState === "player" && !game.user.isGM) {
    ui.notifications.warn("Only the GM can flip the coin to PLAYER.");
    return;
  }

  const coin = document.getElementById(`story-point-${coinId}`);
  if (coin) {
    coin.style.transform = "rotateY(180deg)";
    playFlipSound();
    setTimeout(() => {
      coinStates[coinId] = newState;
      renderCoin(coinId);
      coin.style.transform = "rotateY(0deg)";
    }, 200);
  } else {
    coinStates[coinId] = newState;
    renderCoin(coinId);
  }

  const user = game.user?.name || "Someone";
  const readableId = coinId.replace(/coin(\d+)/, "coin $1");
  const message = `${user} flipped ${readableId} to ${newState.toUpperCase()}`;
  ChatMessage.create({ content: message });

  game.socket.emit(SOCKET_NAME, { coinId, newState });
}

function applyCoinState({ coinId, newState }) {
  const coin = document.getElementById(`story-point-${coinId}`);
  if (coin) {
    coin.style.transform = "rotateY(180deg)";
    playFlipSound();
    setTimeout(() => {
      coinStates[coinId] = newState;
      renderCoin(coinId);
      coin.style.transform = "rotateY(0deg)";
    }, 200);
  } else {
    coinStates[coinId] = newState;
    renderCoin(coinId);
  }
}

function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

function createGMControlPanel() {
  if (!game.user.isGM) return;

  let panel = document.createElement("div");
  panel.id = "story-points-gm-panel";
  panel.style.position = "absolute";
  panel.style.top = "200px";
  panel.style.left = "100px";
  panel.style.zIndex = 10001;
  panel.style.background = "#222";
  panel.style.color = "#fff";
  panel.style.border = "1px solid #555";
  panel.style.borderRadius = "6px";
  panel.style.minWidth = "auto";
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; background: #444; padding: 4px; border-bottom: 1px solid #555; cursor: move;">
      <strong style="font-size: 14px;">Story Points</strong>
      <button style="background: none; border: none; color: #fff; font-weight: bold; cursor: pointer;" title="Close">×</button>
    </div>
    <div style="padding: 6px;">
      <label>Coins: <input type="number" min="1" max="20" value="${Object.keys(coinStates).length}" style="width: 40px;"/></label>
    </div>
  `;
  document.body.appendChild(panel);

  const input = panel.querySelector("input");
  input.addEventListener("change", () => {
    const newCount = Math.max(1, Math.min(20, parseInt(input.value)));
    game.settings.set(MODULE_ID, "coinCount", newCount);
    game.socket.emit(SOCKET_NAME, { updateAll: true, coinCount: newCount });
    updateAllClientsCoinCount(newCount);
  });

  const closeButton = panel.querySelector("button");
  closeButton.addEventListener("click", () => {
    panel.remove();
  });

  makeDraggable(panel);
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "coinCount", {
    name: "Coin Count",
    scope: "world",
    config: false,
    type: Number,
    default: 3
  });
});

Hooks.once("ready", () => {
  if (!game.socket) return;
  game.socket.on(SOCKET_NAME, (data) => {
    if (data.updateAll && data.coinCount !== undefined) {
      updateAllClientsCoinCount(data.coinCount);
    } else if (data.coinId && data.newState) {
      applyCoinState(data);
    }
  });

  const count = game.settings.get(MODULE_ID, "coinCount");
  initializeCoinStates(count);
  createFloatingWindow();
  createGMControlPanel();
});

