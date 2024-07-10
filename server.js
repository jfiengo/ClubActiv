import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

import usersRouter from './routes/users.js';
import groupsRouter from './routes/groups.js';
import postsRouter from './routes/posts.js';

app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/posts', postsRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

export default app;
