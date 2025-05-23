# Story Points - Foundry VTT Module

**Story Points** is a lightweight Foundry VTT module that adds a single interactive coin to the screen. This coin represents a shared narrative resource that can be flipped between the **Player** side and the **GM** side to track who currently has narrative control, advantage, or momentum—similar to mechanics seen in systems like *Genesys* or *Star Wars FFG*.

## Features

- Adds a coin icon to the Foundry VTT interface.
- The coin can be flipped by **either the GM or players**.
- Clicking the coin:
  - Flips it to the other side.
  - Broadcasts a chat message showing the new side.
  - Visually updates the coin for all users in real time (no refresh required).
- State is saved per world and shared across all users.

## Installation

1. Download or clone this repository.
2. Copy the contents to your Foundry VTT `Data/modules/story-points` folder.
3. Enable the module in your game through *Settings > Manage Modules*.

## Usage

Once enabled:
- A small coin icon will appear near the top of the screen.
- Click the coin to flip it between "Player" and "GM" sides.
- The side is visually represented and stored automatically.
- Everyone in the game sees the same state.

## Customization

You can replace the coin face images by editing the files in:
modules/story-points/icons/player.png
modules/story-points/icons/gm.png

Ensure they are at least 64x64 pixels and transparent for best results.

## Compatibility

- Built and tested for Foundry VTT v11+.
- Requires the [socketlib](https://foundryvtt.com/packages/socketlib) module to function properly.

## Credit

Created by ipmillar
KoFi: ipmillar - If you wanna buy me a drink
