import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Posts', () => {
  let userId;

  before(async () => {
    // Add a user to the database and get its ObjectId
    const user = await mongoose.connection.collection('users').insertOne({ username: `testuser-${Date.now()}`, password: 'password123' });
    userId = user.insertedId;
  });

  after(async () => {
    // Clean up the database
    await mongoose.connection.collection('posts').deleteMany({});
    await mongoose.connection.collection('users').deleteMany({});
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        user: userId.toString(),
        imageUrl: 'http://example.com/image.jpg',
        description: 'Test Description',
        activityType: 'hiking',
        location: {
          type: 'Point',
          coordinates: [40.7128, -74.0060]
        }
      });

    expect(res.status).to.equal(201);
    expect(res.text).to.equal('Post created');
  });
});
