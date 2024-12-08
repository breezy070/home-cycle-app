import mongoose from "mongoose";

const technicianSchema = mongoose.Schema(
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
        phoneNumber: {
            type: String,
            unique: false,
            required: [false, "Phone number is required !"]
        },
        availableStatus: {
            type: Boolean,
            default: true,
        },
        // zone: {
        //     type: { type: String, default: 'Polygon' },
        //     coordinates: [[[Number]]], // GeoJSON Polygon: [[[lng, lat], ...]]
        //   },
        zone: {
            type: {
              type: String,
              default: 'Polygon',
              enum: ['Polygon'], // Ensure only 'Polygon' is accepted
            },
            coordinates: {
              type: [[[Number]]], // GeoJSON Polygon requires an array of arrays
            //   validate: {
            //     validator: function (value) {
            //       // Optional validation for a valid GeoJSON polygon structure
            //       return (
            //         Array.isArray(value) &&
            //         value.length > 0 &&
            //         value[0].length >= 4 && // Polygon requires at least 4 points (closing loop)
            //         value[0][0].length === 2 // Each point must have [lng, lat]
            //       );
            //     },
            //     message: "Invalid GeoJSON Polygon coordinates!",
            //   },
            },
            // required: [true, "Zone is required !"]
          },
        password: {
            type: String,
            required: [true, "Password is required !"]
        },
        role: {
            type: String,
            default: "technician"
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

technicianSchema.index({ zone: "2dsphere" });
//this creates the collection on the mongoDB, the name of the database was created on the .env file by specifying it.
const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;