import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Users', () => {
  let username;
  const password = 'password123';

  before(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI);
    username = `testuser-${Date.now()}`;
});

  after(async () => {
    // Clean up the database
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username,
        password: 'password123',
        email: 'test@example.com'
      });

    if (res.status !== 201) {
      console.error('Response:', res.body);
    }

    expect(res.status).to.equal(201);
    expect(res.text).to.equal('User registered');
  });

  it('should not register a duplicate user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username,
        password: 'password123',
        email: 'test@example.com'
      });

    if (res.status !== 409) {
      console.error('Response:', res.body);
    }

    expect(res.status).to.equal(409);
    expect(res.text).to.equal('Username already exists');
  });

  it('should fetch a user profile by username', async () => {
    const res = await request(app).get(`/api/users/profile/${username}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('username');
    expect(res.body).to.have.property('email');
  });

  it('should update a user profile by username', async () => {
    const newEmail = 'updated@example.com';
    const res = await request(app)
      .put(`/api/users/profile/${username}`)
      .send({ email: newEmail });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('email', newEmail);
  });

  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username, password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful');
  });

  it('should not login a user with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username, password: 'wrongpassword' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid credentials');
  });

  it('should not login a non-existent user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'nonexistentuser', password: 'password123' });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', 'User not found');
  });
});
