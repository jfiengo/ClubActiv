import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Posts', () => {
  let userId;

  before(async () => {
    const user = await mongoose.connection.collection('users').insertOne({ username: `testuser-${Date.now()}`, password: 'password123' });
    userId = user.insertedId;

    await mongoose.connection.collection('posts').createIndex({ "location": "2dsphere" });
  });

  after(async () => {
    await mongoose.connection.collection('posts').deleteMany({});
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.disconnect();
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        user: userId.toString(),
        location: {
          type: 'Point',
          coordinates: [-73.935242, 40.73061]
        },
        imageUrl: 'http://example.com/image.jpg',
        activityType: 'hiking'
      });

    expect(res.status).to.equal(201);
    expect(res.text).to.equal('Post created');
  });

  it('should fetch posts by location', async () => {
    const res = await request(app)
      .get('/api/posts')
      .query({
        lat: 40.73061,
        lng: -73.935242,
        radius: 1 // radius in miles
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.above(0);

    const fetchedPost = res.body.find(post => 
      post.location.coordinates[0] === -73.935242 && 
      post.location.coordinates[1] === 40.73061
    );
    expect(fetchedPost).to.exist;
  });
});
