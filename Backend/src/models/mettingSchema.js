<<<<<<< HEAD
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
=======
import mongoose, {Schema} from "mongoose";
const meetingSchema = new Schema(
    {

        username: {
            type: String,
            required: true,
        },
        meetingCode: {
            type: String,
            required: true,
        },
        joinDate: {
            type: Date,
            default: Date.now
        }
    }
)

 const meeting=  mongoose.model("metting",meetingSchema);
 export {meeting};
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
