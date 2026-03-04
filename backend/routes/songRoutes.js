import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPlaylistByTag,
  getSongs,
  toggleFavourites,
} from "../controllers/songController.js";

const songRouter = express.Router();

songRouter.get("/", getSongs);
songRouter.get("/playlistByTag", getPlaylistByTag);
songRouter.post("/favourite", protect, toggleFavourites);
songRouter.get("/favourites", protect, (req, res) => {
  res.json(req.user.favourites);
});

export default songRouter;
