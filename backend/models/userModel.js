import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], default: undefined },
  addressString: { type: String, required: [true, "Address is required !"] },
}, { _id: false });

AddressSchema.index({ coordinates: "2dsphere" });

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: [true, "First name is required !"] },
  last_name:  { type: String, required: [true, "Last name is required !"] },
  email:      { type: String, unique: true, required: [true, "E-mail is required !"] },
  address:    { type: AddressSchema, default: undefined },
  password:   { type: String, required: [true, "Password is required !"] },
  role:       { type: String, default: "user" },
  profilePicture: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  }
}, { timestamps: true });

userSchema.index({ "address.coordinates": '2dsphere' });

export default mongoose.model("User", userSchema);