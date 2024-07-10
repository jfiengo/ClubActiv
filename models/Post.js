const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    activityType: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

PostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);
