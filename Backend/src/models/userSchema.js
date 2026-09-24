<<<<<<< HEAD
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
=======
import mongoose, {Schema} from "mongoose";
const userSchema = new Schema(
    {

        name: {
            type: String,
            required: true,
        }
        ,
        username: {
            type: String,
            required: true,
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
        },
        password: {
            type: String,
            required: true,
        },
<<<<<<< HEAD
        meetings: [{
            type: Schema.Types.ObjectId,
            ref: "Meeting",
        }],
    }
)

const User = mongoose.model("User", userSchema);
export { User };
=======
        token: {
            type: String
        }
    }
)

 const User=  mongoose.model("User",userSchema);
 export {User};
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
