import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Groups', () => {
  let userId;

  before(async () => {
    // Add a user to the database and get its ObjectId
    const user = await mongoose.connection.collection('users').insertOne({ username: `testuser-${Date.now()}`, password: 'password123' });
    userId = user.insertedId;
  });

  after(async () => {
    // Clean up the database
    await mongoose.connection.collection('groups').deleteMany({});
    await mongoose.connection.collection('users').deleteMany({});
  });

  it('should create a new group', async () => {
    const res = await request(app)
      .post('/api/groups')
      .send({
        name: 'Test Group',
        description: 'Test Description',
        activityType: 'hiking',
        members: [userId.toString()]
      });

    expect(res.status).to.equal(201);
    expect(res.text).to.equal('Group created');
  });
});
