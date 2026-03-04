import axios from "axios";

const getSongs = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.jamendo.com/v3.0/tracks/?client_id=3aa2905a&format=jsonpretty&limit=15`,
      /*
      tracks → endpoint returning song
Parameters:
client_id=3aa2905a
API authenication key
format=jsonpretty
Return JSON format
limit=15
Return only 15 songs
So the backend is saying:
"Jamendo, give me 15 tracks."*/
    );
    const data = response.data;
    /*const data = response.data;
Axios returns a large object.
Example structure:
response
 ├── data
 ├── status
 ├── headers
You only care about the actual songs, which are inside:
response.data*/
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag || "").toString().trim();
    /*
    Possible inputs:
/playlist/rock
→ req.params.tag
or
/playlist?tag=rock
→ req.query.tag*/
    if (!tag) {
      return res.status(400).json({ message: "Missing tag parameters" });
    }

    const limit = parseInt(req.query.limit ?? "10") || 10; //if no.of songs provided, get those many, else default 10
    const clientId = "3aa2905a";
    const params = {
      clientId: clientId,
      format: "jsonpretty",
      tags: tag,
      limit,

      /*
      Example if tag = rock
{
 clientId: "3aa2905a",
 format: "jsonpretty",
 tags: "rock",
 limit: 10
}*/
    };
    const response = await axios.get(
      "https://api.jamendo.com/v3.0/tracks/?client_id=3aa2905a&format=jsonpretty&limit=15",
      { params },

      /*Axios allows query parameters like this:
axios.get(url, { params })
Axios converts it into:
https://api.jamendo.com/v3.0/tracks?tags=rock&limit=10*/
    );

    return res.status(200).json(response.data); //Returns the playlist to the frontend.
  } catch (error) {
    console.error(
      "getplaylist tag error ",
      error?.response?.data ?? error.response ?? error,
    );
    return res.status(500).json({ message: "failed to fetch" });
  }
};

const toggleFavourites = async (req, res) => {
  try {
    const user = req.user; /*
    req.user usually comes from authentication middleware.
Example middleware:
verifyToken → decode JWT → attach user
So now:
user = logged-in user*/
    const song = req.body.song;

    /*Ensures favourites exists.
Sometimes MongoDB documents might have:
favourites = undefined
So this ensures it's an array.*/
    if (!Array.isArray(user.favourites)) {
      user.favourites = [];
    }

    // check existence safely (handle string/number id mismatch)
    const exists = user.favourites.some(
      //.some() returns true if any element matches.
      (fav) => String(fav.id) === String(song.id),
    );

    if (exists) {
      /*
      if the song is already a favorite
      Remove it.
.filter() creates a new array excluding that song.
So this is unfavourite.*/
      user.favourites = user.favourites.filter(
        (fav) => String(fav.id) !== String(song.id),

        /* how filter works
        101 !== 202 → true so keep
202 !== 202 → false so remove
303 !== 202 → true so keep
Result:
[101, 303]
.some() would only detect presence, but for transformation purposes, we use .filter()
*/
      );
    } else {
      user.favourites.push(song);
    }

    await user.save();

    return res.status(200).json({
      favourites: user.favourites, // Returns the updated favourites list.
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      message: "favourite was not added, something went wrong",
    });
  }
};

export { getSongs, getPlaylistByTag, toggleFavourites }; //Exports the controllers so they can be used in routes
