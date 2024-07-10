import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const post = new Post({
      user: req.body.user,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      activityType: req.body.activityType,
      location: req.body.location
    });

    await post.save();
    res.status(201).send('Post created');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send(error.message);
  }
});

export default router;
