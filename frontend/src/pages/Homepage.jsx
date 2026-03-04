import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import axios from "axios";
import "../css/pages/HomePage.css";
/*
if we are doing a default export then we must NOT import this way 
  import { useAudioPlayer } from "../hooks/useAudioPlayer";

this is the correct way 
  import useAudioPlayer from "../hooks/useAudioPlayer";
*/

import useAudioPlayer from "../hooks/useAudioPlayer";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";
const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const auth = useSelector((state) => state.auth); //since we are trying to access through protected route, we need auth

  const songsToDisplay = view === "search" ? searchSongs : songs;

  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  } = useAudioPlayer(songsToDisplay);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`,
        );
        setSongs(res.data.results || []);
      } catch (error) {
        console.error("Error while fetching the songs", error);
        setSongs([]);
      }
    };

    fetchInitialSongs();
  }, []);

  const loadPlaylist = async (tag) => {
    if (!tag) {
      console.warn("No tag is provided");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag?tag=${tag}`,
      );

      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Failed to load playlist", error);
      setSongs([]);
    }
  };

  const handleSelectSong = (index) => {
    playSongAtIndex(index); //when user clicks on a song in a table, we play the song using the index
  };

  const handlePlayFavourite = (song) => {
    //a function that takes in a "song" that you wanna play from favourites
    const favourites = auth.user?.favourites || []; //if auth.user exists try to get favourites, else return undefined || if the result is undefined or null return empty array instead, so favuorites becomes an array either filled with favourite songs or an empty array

    if (!favourites.length) return; //no favourites to play

    const index = auth.user.favourites.findIndex((fav) => fav.id === song.id);
    //this searches through the entire favourites array to find the position of the song we have clicked, findIndex goes through the array one by one, for each "fav" it checks fav.id === song.id, ie the song that we have clicked matches with the song id in favourites, if it finds, then it returns index like 0,1,2 else returns -1, so basically, index is where in the favourites list is this song

    setSongs(auth.user.favourites);
    //This updates your React state so that the current playlist becomes the favourites list.
    //In other words: “From now on, the player should treat favourites as the active song list.”

    setView("home"); //switches ui back to home page if we were probably in some other page, so now onwards, playlist is "favourites" and ui is set to "home"

    //running this settimeout right after react finishes updating the state, we do this because setSongs and setView are async updates and you want to wait a tiny moment so the state is updated before trying to play a song from the list
    setTimeout(() => {
      if (index !== -1) {
        playSongAtIndex(index);
        //if index is not -1 then play the song at that index
      }
    }, 0); //The setTimeout(..., 0) is a tiny scheduling trick to make sure React finishes updating state before the player tries to use that new state. Without it, you can end up playing the wrong list or the wrong index.
  };

  return (
    <div className="homepage-root">
      <audio //<audio> renders a html audio element in browser
        ref={audioRef} //connects the dom <audio> element to react code via useRef, after this audioRef.current is the actual audio element in browser, now this hook can do things like audioRef.current.pause(), etc, without ref, REACT WONT BE ABLE TO USE THE AUDIO ELEMENT
        onTimeUpdate={handleTimeUpdate} //browser fires timeupdate event many times per second while the audio is playing,each time it fires, react calls handleTimeUpdate, this is how the ui knows where the song currently is, like progress bar
        onLoadedMetadata={handleLoadedMetadata} //event fires when browser has loaded audio's metadata
        onEnded={handleEnded} //this event fires when song finishes playing, handleEnded function decides what happens when song finishes, like if loop is on, or go to the next
      >
        {currentSong && <source src={currentSong.audio} type="audio/mpeg" />}
      </audio>
      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu
            setView={setView}
            view={view}
            openEditProfile={() => setOpenEditProfile(true)}
          />
        </div>
        {/* Main Content */}
        <div className="homepage-content">
          <MainArea
            view={view}
            currentIndex={currentIndex}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlaylist}
            songsToDisplay={songsToDisplay}
            setSearchSongs={setSearchSongs}
          />
        </div>
      </div>
      {/* Footer Player */}
      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />
      {/* we will be making changes to playerstate, playercontrols and playerfeatures objects so we pass them to the child component footer*/}

      {openEditProfile && (
        <Modal onClose={() => setOpenEditProfile(false)}>
          <EditProfile onClose={() => setOpenEditProfile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;
