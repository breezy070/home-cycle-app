import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, "First name is required !"]
        },
        last_name: {
            type: String,
            required: [true, "Last name is required !"]
        },
        email: {
            type: String,
            unique: true,
            required: [true, "E-mail is required !"]
        },
        password: {
            type: String,
            required: [true, "Password is required !"]
        },
        role: {
            type: String,
            required: [true, "Role is required !"]
        }
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const User = mongoose.model("User", userSchema);

export default User;