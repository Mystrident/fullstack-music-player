import React from "react";

import SongDetail from "../player/SongDetail";
import ControlArea from "../player/ControlArea";
import Features from "../player/Features";

import "../../css/footer/Footer.css";

const Footer = ({ playerState, playerControls, playerFeatures }) => {
  return (
    <footer className="footer-root footer-glow">
      <SongDetail currentSong={playerState.currentSong} />{" "}
      {/*song area is the left bottom image + song name, */}
      <ControlArea playerState={playerState} playerControls={playerControls} />
      {/*control area is the bottom middle, where duration, play pause anol present */}
      <Features playerState={playerState} playerFeatures={playerFeatures} />{" "}
      {/*mute, shuffle etc etc  */}
    </footer>
  );
};

export default Footer;
