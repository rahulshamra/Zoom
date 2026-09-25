import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        meetings: [{
            type: Schema.Types.ObjectId,
            ref: "Meeting",
        }],
    }
)

const User = mongoose.model("User", userSchema);
export { User };
