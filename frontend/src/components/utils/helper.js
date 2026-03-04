//SongList.jsx contains a code which shows time in milliseconds, but we want to show in minutes and seconds so we make use of this

export const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "00:00";

  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0"); /*
    sec % 60
    The % operator gives the remainder after dividing by 60.
    For 125 % 60 = 5. That’s the leftover seconds after counting full minutes.
    Math.floor(...) Just in case sec was a float like 125.7, this makes it a clean integer: 5.
    .toString().padStart(2, "0")
    toString() turns 5 into "5".
    padStart(2, "0") makes sure the string has at least 2 characters.
    exmaple "5" becomes "05" "12" stays "12"
        seconds is always "00" to "59" as a two-digit string.
        
        */

  return `${minutes}:${seconds}`;

  //example : 2:05
};
