import express from 'express';
import Group from '../models/Group.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      description: req.body.description,
      activityType: req.body.activityType,
      members: req.body.members
    });

    await group.save();
    res.status(201).send('Group created');
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).send(error.message);
  }
});

// Fetch groups with optional filters: name, activityType, or description
router.get('/', async (req, res) => {
    const { name, activityType, description } = req.query;
    
    // Build the query object
    const query = {};
    if (name) query.name = name;
    if (activityType) query.activityType = activityType;
    if (description) query.description = description;
  
    try {
      const groups = await Group.find(query);
      res.status(200).json(groups);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
export default router;
