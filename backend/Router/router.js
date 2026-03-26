const express = require("express");

const router = express.Router();

// signup
const {signUp} = require("../Controller/UserController/signUp");

// login
const{logIn} = require("../Controller/UserController/logIn");

// auth
const {auth} = require("../Middleware/auth");

// post create ---->
const {postCreate} = require("../Controller/PostController/postCreate");

// get-> user posts ,all posts ,single post
const {getUserPosts,getAllPosts,getSinglePost} = require("../Controller/PostController/getPost");

// get -> user 
const {getUser} = require("../Controller/UserController/getUser");

// unlike
const {unlikePost} = require("../Controller/PostLikeAndUnlike/unlikePost");

// like
const {likePost } = require("../Controller/PostLikeAndUnlike/likePost");

// follower
const {followUser} = require("../Controller/FollowingController/following");
// following
const{unfollowUser} = require("../Controller/FollowingController/unfollow");
// get all -> follower and following
const {followingAndfollower} = require("../Controller/FollowingController/getFollowerAndFollowing");

// forget password ------->

const {forgetPassword,tempAuthVerify,verifyOtp,setNewPassword } = require("../Controller/forgetPassword/forgetPassword")

router.post("/sign",signUp);

router.post("/login",logIn);

router.post("/create",auth,postCreate);

router.get("/post",auth,getSinglePost);

router.get("/myPost",auth,getUserPosts);

router.get("/posts",auth,getAllPosts);

router.post("/profile",auth,getUser);

router.post("/like",auth,likePost);

router.post("/unlike",auth,unlikePost);

router.post("/follow",auth,followUser);

router.post("/unfollow",auth,unfollowUser);

router.post("/followerlist",auth,followingAndfollower);

 router.post("/forgetPassword",forgetPassword);
 router.post("/verifyOtp",tempAuthVerify,verifyOtp);
 router.post("/setPassword",tempAuthVerify,setNewPassword);

module.exports = router;