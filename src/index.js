import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import playGame from "./phaser/scene";
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js';

// export const config = {
//   type: Phaser.AUTO,
//   parent: "phaser",
//   width: "100%",
//   scene: playGame
// };

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: playGame,
  plugins: {
      scene: [{
          key: 'rexBoard',
          plugin: BoardPlugin,
          mapping: 'rexBoard'
      }]
  }
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById("root") || document.createElement("div")
);
