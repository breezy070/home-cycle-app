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
        address: {
            type: { type: String, enum: ['Point'], required: true, default: 'Point' },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
            addressString: {type: String, required: [true, "Address is required !"]}
        },
        password: {
            type: String,
            required: [true, "Password is required !"]
        },
        role: {
            type: String,
            default: "user"
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
userSchema.index({ address: '2dsphere' }); // Geospatial index
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const User = mongoose.model("User", userSchema);

export default User;