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

// Fetch posts with location-based filtering
router.get('/', async (req, res) => {
    const { lat, lng, radius } = req.query;
  
    if (lat && lng && radius) {
      const radiusInMiles = radius;
      try {
        const posts = await Post.find({
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusInMiles / 3963.2]
            }
          }
        });
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      try {
        const posts = await Post.find();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  });

export default router;
