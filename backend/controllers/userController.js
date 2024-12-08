import User from "../models/userModel.js";
import Technician from "../models/technicianModel.js";
import Intervention from "../models/interventionModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
};

//update user
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update YOUR account !'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },
            //show updated
            {new: true}
        );
        const {password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your account'));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const scheduleAppointment = async (req, res, next ) => {
    try {
        const { userId, date,  location } = req.body;

        console.log("location: "+location)


        if (!userId || !date || !location) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!Array.isArray(location) || location.length !== 2) {
            return res.status(400).json({ message: 'Invalid location format. Must be [longitude, latitude]' });
        }

        // Find a technician available in the user's zone
        const technician = await Technician.findOne({
            availability: true,
            zone: {
            $geoIntersects: {
                $geometry: {
                type: 'Point',
                coordinates: location,
                },
            },
            },
        });

        if (!technician) {
            return res.status(404).json({ message: 'No technician available in your zone' });
        }

        // Create an appointment
        const intervention = new Intervention({
            userId,
            technicianId: technician._id,
            date,
     
        });

        await intervention.save();

        res.status(200).json({ message: 'Appointment scheduled', intervention });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
        }
}