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

export default router;
