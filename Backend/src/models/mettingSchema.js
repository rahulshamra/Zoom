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
