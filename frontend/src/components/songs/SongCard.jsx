import React from "react";
import "../../css/songs/SongCard.css";

const SongCard = ({ song, onSelectFavourite }) => {
  if (!song) return null;

  const image = song.image || song.img;
  const artist = song.artist_name || song.artist?.name || "Unknown Artist";

  return (
    <div className="song-card" onClick={onSelectFavourite}>
      <div className="song-card-image">
        <img src={image} alt={song.name} loading="lazy" />
      </div>

      <div className="song-card-info">
        <h4 className="song-title">{song.name}</h4>
        <p className="song-artist">{artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
