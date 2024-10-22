import express from "express";
import  protectRoute  from "../middleware/protectRoute.js";
const router = express.Router();
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPost, getLikedPost, getFollowingPosts, getUserPosts } from "../controllers/post.controller.js"

router.get("/all", protectRoute, getAllPost);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPost);
router.get("/user/:username", protectRoute, getUserPosts)
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

export default router;