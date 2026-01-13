const mongoose = require("mongoose");

const GigSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"], // Edge Case: Super long titles
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    min: [5, "Budget must be at least $5"], // Edge Case: $0 or negative budget
  },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'Completed'],
    default: 'Open',
  },
}, { timestamps: true });

module.exports = mongoose.models.Gig || mongoose.model("Gig", GigSchema);