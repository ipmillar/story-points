
let storyPointSocket;

class StoryPointCoinApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "story-point-coin",
      template: "modules/story-points/templates/coin.html",
      popOut: false,
      width: 64,
      height: 64,
      left: window.innerWidth - 100,
      top: 60
    });
  }

  async getData() {
    const side = await game.settings.get("story-points", "coinState");
    return { side };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("#coin-image").on("click", async () => {
      const currentState = html.find("#coin-image").data("side");
      const newState = currentState === "player" ? "gm" : "player";

      if (game.user.isGM) {
        await game.settings.set("story-points", "coinState", newState);
        ChatMessage.create({
          content: `The Story Point coin was flipped to the <strong>${newState.toUpperCase()}</strong> side.`
        });
        storyPointSocket.executeForEveryone("forceRerender");
      } else {
        storyPointSocket.executeAsGM("flipCoin", newState);
      }
    });
  }
}

Hooks.once("init", () => {
  game.settings.register("story-points", "coinState", {
    name: "Coin Side",
    scope: "world",
    config: false,
    type: String,
    default: "player"
  });
});

Hooks.once("socketlib.ready", () => {
  storyPointSocket = socketlib.registerModule("story-points");

  storyPointSocket.register("flipCoin", async (newState) => {
    await game.settings.set("story-points", "coinState", newState);
    ChatMessage.create({
      content: `The Story Point coin was flipped to the <strong>${newState.toUpperCase()}</strong> side.`
    });
    storyPointSocket.executeForEveryone("forceRerender");
  });

  storyPointSocket.register("forceRerender", async () => {
    await game.storyPointCoin?.render(true);
  });
});

Hooks.once("ready", async () => {
  game.storyPointCoin = new StoryPointCoinApp();
  game.storyPointCoin.render(true);
});

Hooks.on("settings.set", (scope, key, value) => {
  if (scope === "story-points" && key === "coinState") {
    game.storyPointCoin?.render(true);
  }
});
