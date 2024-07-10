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

  it('should fetch all groups', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should fetch groups with specified name', async () => {
    const res = await request(app)
      .get('/api/groups')
      .query({ name: 'Test Group' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length.above(0);

    // Verify the created group is in the fetched list
    const fetchedGroup = res.body.find(group => group.name === 'Test Group');
    expect(fetchedGroup).to.exist;
    expect(fetchedGroup.name).to.equal('Test Group');
  });

  it('should fetch groups with specified activity type', async () => {
    const res = await request(app)
      .get('/api/groups')
      .query({ activityType: 'hiking' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length.above(0);

    // Verify the created group is in the fetched list
    const fetchedGroup = res.body.find(group => group.activityType === 'hiking');
    expect(fetchedGroup).to.exist;
    expect(fetchedGroup.activityType).to.equal('hiking');
  });

  it('should fetch groups with specified description', async () => {
    const res = await request(app)
      .get('/api/groups')
      .query({ description: 'Test Description' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.length.above(0);

    // Verify the created group is in the fetched list
    const fetchedGroup = res.body.find(group => group.description === 'Test Description');
    expect(fetchedGroup).to.exist;
    expect(fetchedGroup.description).to.equal('Test Description');
  });
});
