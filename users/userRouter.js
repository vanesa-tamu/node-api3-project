const express = require("express");

const router = express.Router();

const User = require("./userDb.js");
const Posts = require("../posts/postDb.js");

router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await User.insert(req.body);
    if (newUser) {
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error creating that user" });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  try {
    const post = await Posts.insert(req.body);
    if (post) {
      res.status(201).json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error creating that post." });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.get();
    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error finding that user" });
  }
});

router.get("/:id", validateUserId, async (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await User.getUserPosts(id);
    if (userPosts) {
      res.status(200).json(userPosts);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error finding that user's posts" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      const deleted = await User.remove(id);
      if (deleted) {
        res.status(200).json(user);
      }
    } else {
      res.status(404).json({ message: "Invalid user ID" });
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error removing the user." });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  const user = req.body;
  try {
    const updated = await User.update(id, user);
    if (updated) {
      const newUser = await User.getById(id);
      res.status(200).json(newUser);
    } else {
      res.status(404).json({ message: "Invalid user ID" });
    }
  } catch (error) {
    res.status(500).json({ message: "There was an error updating the user." });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "Invalid user ID." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error validating that user." });
  }
}

function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing user data." });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name data." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing post data." });
  } else if (!req.body.text) {
    res.status(400).json({ message: "Missing required text data." });
  } else {
    next();
  }
}

module.exports = router;
