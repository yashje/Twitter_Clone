import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { Notification } from "../models/notification.model.js"
import { v2 as cloudinary } from "cloudinary"

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        };

        if (!text && !img) {
            return res.status(401).json({ error: "Post must have text or image" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        return res.status(401).json({ newPost });

    } catch (error) {
        console.log("Error in the post.controller", error.message);
        res.status(401).json({ error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(401).json({ error: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.stauts(401).json({ error: "You are not authorized to delete the post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "post deleted successfully" })
    } catch (error) {
        console.log("Error occured in delete post", error.message);
        res.status(401).json({ error: error.message })
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(401).json({ error: "Text field is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(401).json({ error: "Post not found" });
        }

        post.comments.push({ user: userId, text })
        await post.save();

        res.status(200).json({ post })
    } catch (error) {
        console.log("Error occured in comment on post", error.message);
        res.status(401).json({ error: "Inteernal server error" })
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return req.status(401).json({ error: "Post not found" })
        }

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ message: "Post unliked successfully" })
        } else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            });
            await notification.save();

            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.log("Error occured in likeUnlikePost", error.message);
        res.status(401).json({ error: "Internal server error" })
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
                path: "comments.user",
                select: "-password",
            })

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getAllPosts controller", error.message);
        res.status(401).json({ error: "Internal server error" });
    }
}

export const getLikedPost = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json({ likedPosts });
    } catch (error) {
        console.log("Error in getLikedPasts controller:", error.message);
        res.status(401).json({ error: "Internal server error" });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.body._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts)
    } catch (error) {
        console.log("Error in the get following post", error.message);
        res.status(402).json({ error: "Internal server error" })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({ error: "User not found" })
        }

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })

        res.status(200).json({ posts })
    } catch (error) {
        console.log("Error in get users posts", error.message);
        res.status(401).json({ error: "Internal server error" })
    }
}