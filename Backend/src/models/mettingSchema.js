import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  meetingName: {
    type: String,
    required: true,
    trim: true,
  },
  meetingStartDate: {
    type: Date,
    default: Date.now,
  },
  chatHistory: [{
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  }],
});

meetingSchema.index({ meetingName: 1 }, { unique: true });

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };
