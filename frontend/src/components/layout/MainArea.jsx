import React, { useState } from "react";

import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";
import SongGrid from "../songs/SongGrid";

import "../../css/mainArea/MainArea.css";
import { useSelector } from "react-redux";

const MainArea = ({
  view,
  currentIndex,
  onSelectSong,
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSongs,
}) => {
  const auth = useSelector((state) => state.auth); //we do this to show favourites and stuff
  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist onSelectTag={onSelectTag} />}
        {view === "search" && <SearchBar setSearchSongs={setSearchSongs} />}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList
            songs={songsToDisplay}
            onSelectSong={onSelectSong}
            currentIndex={currentIndex}
          />
        )}

        {view === "favourite" && (
          <SongGrid
            songs={auth.user?.favourites || []}
            onSelectFavourite={onSelectFavourite}
          /> //we are sending both to the child component song grid, so that we can access them in that component
        )}
      </div>
    </div>
  );
};

export default MainArea;
