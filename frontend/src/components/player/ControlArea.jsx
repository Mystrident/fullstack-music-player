import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateFavourites } from "../../redux/slices/authSlice";
import { formatTime } from "../utils/helper";

const ControlArea = ({ playerState, playerControls }) => {
  const dispatch = useDispatch(); //we need to get the data from the api to update the data, so dispatch
  const { user, token, isAuthenticated } = useSelector((state) => state.auth); //we need to get authentication because, favorite button appears only when we are authenticated

  const { isPlaying, currentTime, duration, currentSong, isLoading } =
    playerState; //the thing about destructuring is, we take only some parts of them from the whole object

  const { handleTogglePlay, handleNext, handlePrev, handleSeek } =
    playerControls;

  const currentSongId = currentSong?.id;
  const favourites = Array.isArray(user?.favourites) ? user.favourites : [];

  const isLiked =
    currentSongId &&
    favourites.some((fav) => String(fav.id) === String(currentSongId));

  const handleLike = async () => {
    //if the like button is pressed, we will be doing an api call

    if (!isAuthenticated || !currentSong) return;

    try {
      const songData = {
        id: currentSong.id,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      }; //this song data we have to send to favourites api

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(updateFavourites(res.data.favourites));
    } catch (error) {
      // handle error here
      console.error("Like failed", error);
    }
  };
  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={handlePrev}
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>

        <button
          type="button"
          aria-label="play"
          className="control-play-btn"
          onClick={handleTogglePlay}
        >
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="a855f7" size={36} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>

        {isAuthenticated && (
          <button
            type="button"
            aria-label="like"
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          className="control-progress"
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right,#a855f7 ${duration ? (currentTime / duration) * 100 : 0}%,#333 ${duration ? (currentTime / duration) * 100 : 0}%)`,
          }}
        />

        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
