const express = require('express');
const routes = express.Router();

const db = require('./data/db');

routes.post('/api/posts', async (req,res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    try {
        const newId = await db.insert(req.body);
        const newPost = await db.findById(newId.id);
        res.status(201).json(newPost);
    } catch (e) {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
});

routes.get('/api/posts', async (req,res) => {
    try {
        const posts = await db.find();
        res.status(200).json(posts);
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

routes.get('/api/posts/:id', async (req,res) => {
    try {
        const post = await db.findById(req.params.id);
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        res.status(200).json(post);
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

routes.delete('/api/posts/:id', async (req,res) => {
    try {
        const post = await db.findById(req.params.id);
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        try {
            await db.remove(req.params.id);
            res.status(200).json(post);
        } catch (e) {
            res.status(500).json({ error: "The post could not be removed" });
        }
        
        
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

routes.put('/api/posts/:id', async (req,res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }

    try {
        const post = await db.findById(req.params.id);
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }

        try {
            const updatedPostId = await db.update(req.params.id, req.body);
            const updatedPost = await db.findById(updatedPostId);
            res.status(200).json(updatedPost);
        } catch (e) {
            res.status(500).json({ error: "The post information could not be modified." });
        }
        
        
    } catch (e) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
});

module.exports = routes;
