import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
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
            default: "admin"
            // required: [true, "Role is required !"]
        },
        profilePicture: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }
    },
    {
        timestamps: true
    }

);
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;