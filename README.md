🪙 Story Points – Foundry VTT Module

Story Points is a lightweight module for Foundry VTT that adds a draggable window with interactive coins. These coins represent a shared narrative resource between the GM and players—perfect for tracking control, momentum, or advantage in systems like Genesys or Star Wars FFG.
✨ Features

    🪙 Add multiple interactive coins to the screen (1–20)

    🎯 Click a coin to flip it between the GM’s and Player’s side

    💬 Automatically sends a chat message when flipped (e.g., "Alex flipped coin 3 to the Player’s side")

    🌐 Real-time sync between GM and all players

    🔒 Only the GM can flip coins to the Player side

    🔊 Includes a flip sound effect for satisfying feedback

    🖱️ Fully draggable UI window that stays on top

    ⚙️ A GM-only gear icon opens the control panel

    🧮 Control panel lets the GM set the number of coins and coin style

    🧠 Coin states persist across sessions and world restarts

    🎨 Fully customizable icons and sound

🛠️ Installation

    Download or clone the repository

    Copy it into your FoundryVTT/Data/modules/story-points folder

    Enable the module in Foundry:
    Settings > Manage Modules > Story Points

🎮 Usage

Once enabled:

    A floating window with coins appears on screen

    Click a coin to flip it between GM and Player

    A chat message logs each flip and who flipped it

GM Control Panel

    A gear icon appears in the top-right of the coin tracker (GM only)

    Click it to open the control panel:

        Set the number of coins (1–20)

        Choose from multiple coin styles (fantasy, sci-fi, minimalist, modern, steampunk, destiny points, and feather tokens)
    

🎨 Customization
Coin Faces

Replace these files with your own transparent PNGs (64×64 or larger recommended):

    modules/story-points/icons/coins/<style>/player.png
    modules/story-points/icons/coins/<style>/gm.png

Flip Sound

Replace this file to change the sound effect:

    modules/story-points/sounds/flip.ogg

✅ Compatibility

    ✅ Foundry VTT v10–v13+

    🧩 No dependencies required

    💾 States persist across sessions

🙌 Credit

Created by @ipmillar
☕ ko-fi.com/ipmillar — Toss a coin to your dev!
