🪙 Story Points – Foundry VTT Module

Story Points is a lightweight Foundry VTT module that adds a draggable window with interactive coins. These coins represent a shared narrative resource between the GM and players—perfect for tracking narrative control, advantage, or momentum, inspired by systems like Genesys or Star Wars FFG.
✨ Features

    🪙 Add multiple interactive coins to the screen.

    🔁 Click to flip each coin between the GM and Player side.

    📣 Chat messages announce who flipped which coin and to what.

    👁️ Visual updates in real time for all users (no refresh needed).

    🔒 Only the GM can flip coins to the Player side (optional rule).

    🔊 Flip sound effect for satisfying feedback.

    🖱️ Draggable floating window to place the tracker wherever you want.

🛠️ Installation

    Download or clone this repository.

    Copy the contents to your Foundry VTT Data/modules/story-points folder.

    Enable the module from Settings > Manage Modules.

🎮 Usage

Once enabled:

    A floating window with 3 coins will appear on screen.

    Click a coin to flip it between GM and Player sides.

    All users see the same state, updated in real time.

    A chat message logs each flip and who flipped it.

🎨 Customization

Want to use your own coin graphics?

Replace these files:

modules/story-points/icons/player.png
modules/story-points/icons/gm.png

✅ Recommended: Transparent PNGs at least 64x64 pixels.
🔊 Sound Effect

To customize the flip sound, replace:

modules/story-points/sounds/flip.ogg

➕ Adding More Coins

Want more than 3 coins? It’s easy!

    Open the module’s story-points.js file.

    Locate the coinStates object near the top:

let coinStates = {
  coin1: "gm",
  coin2: "gm",
  coin3: "gm"
};

Add more coins by following the same format:

    let coinStates = {
      coin1: "gm",
      coin2: "gm",
      coin3: "gm",
      coin4: "gm",  // Add as many as you want
      coin5: "gm"
    };

Each coin will appear in the floating window automatically and behave the same way.

✅ You can rename the coin IDs (e.g., destiny1, threatToken, etc.)—they’ll still sync and work just fine.

✅ Compatibility

    Compatible with Foundry VTT v10–v13.

    Does not require SocketLib or any dependencies.

🙌 Credit

Created by @ipmillar
Ko-fi: ipmillar — If you’d like to toss a coin to your dev 🎵
