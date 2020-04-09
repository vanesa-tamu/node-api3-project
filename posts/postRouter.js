const express = require('express');

const router = express.Router();

P = require('./postDb.js')


router.get('/', async (req, res) => {
    try{
        const posts = await P.get()
        if(posts){
            res.status(200).json(posts)
        }
    }
    catch(error) {
        res.status(500).json({message: 'error getting all posts'})
    }
});

router.get('/:id', validatePostId, async (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, async (req, res) => {
    const { id } = req.params;
    try{
        const post = await P.getById(id)
        if(post){
            const deleted = await P.remove(id)
            if(deleted){
                res.status(200).json(post)
            }
        }
        else {
            res.status(404).jsaon({message: `Invalid Post ID`})
        }
    }
    catch(error) {
        res.status(500).json({ message: "There was an error removing the post." });
    }
});

router.put('/:id', validatePostId, async (req, res) => {
    const { id } = req.params;
    try{
        const changePost = await P.update(id)
        if(changePost) {
            const newPost = await P.getById(id)
            res.status(200).json(newPost);
        }
        else{
            res.status(401).json({message: `invalide post ID`})
        }
    }
    catch(error){
        res.status(500).json({ message: "There was an error updating the post." });
    }
});

// custom middleware
async function validatePostId (req, res, next) {
    const { id } = req.params
    try {
        const post = await P.getById(id);
        if(post) {
            req.post = post;
            next();
        } 
        else {
            res.status(401).json({message: `Invalide Post ID!`})
        }
    }
    catch (error){
        res.status(500).json({message: `error validating post`})
    }
};

module.exports = router;