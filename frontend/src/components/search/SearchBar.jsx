import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";
import axios from "axios";
//whenver we encounter input tag or controlled element we need to do these 3 steps
const SearchBar = ({ setSearchSongs }) => {
  //jamendo api doesnt return individual songs, so we need to search via playlists only, like whether the search entered song exists in that playlist or not
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || !query.trim()) {
      setSearchSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag?tag=${encodeURIComponent(query)}`,
        ); //encodeuricomponent converts whatever string that we have written inside the search bar into actionable api component

        setSearchSongs(res.data.results || []);
      } catch (error) {
        console.error("Jamendo search failed.", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    };

    {
      /*debouncing and throttling concept to limit api calls*/
    }
    const debounce = setTimeout(() => {
      fetchSongs();
    }, 1000); // wait 1 second after user stops typing

    return () => clearTimeout(debounce); // cancel previous timer if query changes, see if you dont write this line, it will load, give an answer, again starts loading, again gives an answer, again starts loading, so to stop the loading once it has given an answer, we do this
    fetchSongs();
  }, [query, setSearchSongs]); //we make use of useEffect whenever we want to call an api
  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {/*a magnifying glass symbol is provided by lucid React*/}
        <CiSearch className="searchbar-icon" size={20} />
      </div>
      {!query &&
        !loading && ( // !query means if there is nothing that has been entered in the search bar or if its not loading then
          <p className="search-empty">
            {/*Search
            songs to display*/}
          </p>
        )}
      {/*else*/}
      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;
