// story-points.js - Multi-coin Story Point Tracker with Flip Animation, Sound, and GM Coin Count Control + Gear Toggle + Style Selector

const MODULE_ID = "story-points";
const SOCKET_NAME = "module.story-points";
const FLIP_SOUND_PATH = `modules/${MODULE_ID}/sounds/flip.ogg`;

let coinStates = {};

function initializeCoinStates(count) {
  for (let i = 1; i <= count; i++) {
    const saved = game.settings.get(MODULE_ID, `coinState${i}`);
    coinStates[`coin${i}`] = saved || "gm";
  }
  Object.keys(coinStates).forEach((key) => {
    const num = parseInt(key.replace("coin", ""), 10);
    if (num > count) {
      delete coinStates[key];
      game.settings.set(MODULE_ID, `coinState${num}`, undefined);
    }
  });
}

function getCoinStyle() {
  return CONFIG[MODULE_ID]?.coinStyleOverride || game.settings.get(MODULE_ID, "coinStyle") || "fantasy";
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

    if (game.user.isGM) {
      const gear = document.createElement("img");
      gear.src = `modules/${MODULE_ID}/icons/gear.png`;
      gear.style.width = "20px";
      gear.style.height = "20px";
      gear.style.cursor = "pointer";
      gear.style.position = "absolute";
      gear.style.top = "-10px";
      gear.style.right = "-10px";
      gear.title = "GM Settings";
      gear.addEventListener("click", () => {
        const existingPanel = document.getElementById("story-points-gm-panel");
        if (existingPanel) {
          existingPanel.remove();
        } else {
          createGMControlPanel();
        }
      });
      container.appendChild(gear);
    }
  }
  Object.keys(coinStates).forEach(renderCoin);
}

function renderCoin(coinId) {
  let container = document.getElementById("story-points-container");
  if (!container) return;

  let coin = document.getElementById(`story-point-${coinId}`);
  const style = getCoinStyle();

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

  coin.src = `modules/${MODULE_ID}/icons/coins/${style}/${coinStates[coinId]}.png`;
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
      if (game.user.isGM) game.settings.set(MODULE_ID, `coinState${coinId.replace("coin", "")}`, newState);
      renderCoin(coinId);
      coin.style.transform = "rotateY(0deg)";
    }, 200);
  } else {
    coinStates[coinId] = newState;
    if (game.user.isGM) game.settings.set(MODULE_ID, `coinState${coinId.replace("coin", "")}`, newState);
    renderCoin(coinId);
  }

  const user = game.user?.name || "Someone";
  const readableId = coinId.replace(/coin(\d+)/, "coin $1");
  const message = `${user} flipped ${readableId} to the ${newState === "gm" ? "GM's" : "Player's"} side`;
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
  if (game.user.isGM) game.settings.set(MODULE_ID, `coinState${coinId.replace("coin", "")}`, newState);
      renderCoin(coinId);
      coin.style.transform = "rotateY(0deg)";
    }, 200);
  } else {
    coinStates[coinId] = newState;
    game.settings.set(MODULE_ID, `coinState${coinId.replace("coin", "")}`, newState);
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

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "coinCount", {
    name: "Number of Coins",
    default: 3,
    type: Number,
    scope: "world",
    config: false,
  });

  game.settings.register(MODULE_ID, "coinStyle", {
    name: "Coin Style",
    default: "fantasy",
    type: String,
    scope: "world",
    config: false,
  });

  for (let i = 1; i <= 20; i++) {
    game.settings.register(MODULE_ID, `coinState${i}`, {
      name: `Coin ${i} State`,
      default: "gm",
      type: String,
      scope: "world",
      config: false,
    });
  }
});

function createGMControlPanel() {
  if (!game.user.isGM) return;

  const existing = document.getElementById("story-points-gm-panel");
  if (existing) return;

  const panel = document.createElement("div");
  panel.id = "story-points-gm-panel";
  panel.style.position = "absolute";
  panel.style.top = "160px";
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
    <div style="padding: 6px; display: flex; flex-direction: column; gap: 6px;">
      <label>Coins: <input type="number" min="1" max="20" value="${Object.keys(coinStates).length}" style="width: 40px;"/></label>
      <label>Style:
        <select id="coin-style-select">
          <option value="fantasy">Fantasy</option>
          <option value="minimalist">Minimalist</option>
          <option value="modern">Modern</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="steampunk">Steampunk</option>
          <option value="destiny-points">Destiny Points</option>
          <option value="feather-token">Feather Token</option>
        </select>
      </label>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector("#coin-style-select").value = getCoinStyle();

  const input = panel.querySelector("input");
  input.addEventListener("change", () => {
    const newCount = Math.max(1, Math.min(20, parseInt(input.value)));
    game.settings.set(MODULE_ID, "coinCount", newCount);
    game.socket.emit(SOCKET_NAME, { updateAll: true, coinCount: newCount });
    updateAllClientsCoinCount(newCount);
  });

  const styleSelect = panel.querySelector("#coin-style-select");
  styleSelect.addEventListener("change", () => {
    const newStyle = styleSelect.value;
    if (game.user.isGM) {
      game.settings.set(MODULE_ID, "coinStyle", newStyle);
    }
    CONFIG[MODULE_ID] = CONFIG[MODULE_ID] || {};
    CONFIG[MODULE_ID].coinStyleOverride = newStyle;
    game.socket.emit(SOCKET_NAME, { newStyle });
    updateAllClientsCoinCount(Object.keys(coinStates).length);
  });

  const closeButton = panel.querySelector("button");
  closeButton.addEventListener("click", () => {
    panel.remove();
  });

  makeDraggable(panel);
}


Hooks.once("ready", () => {
  if (!game.socket) return;
  game.socket.on(SOCKET_NAME, (data) => {
    if (data.updateAll && data.coinCount !== undefined) {
      updateAllClientsCoinCount(data.coinCount);
    } else if (data.newStyle) {
      CONFIG[MODULE_ID] = CONFIG[MODULE_ID] || {};
      CONFIG[MODULE_ID].coinStyleOverride = data.newStyle;
      updateAllClientsCoinCount(Object.keys(coinStates).length);
    } else if (data.coinId && data.newState) {
      applyCoinState(data);
    }
  });

  const coinCount = game.settings.get(MODULE_ID, "coinCount") || 3;
  initializeCoinStates(coinCount);
  createFloatingWindow();
});

