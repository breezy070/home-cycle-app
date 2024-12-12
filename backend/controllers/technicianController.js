import Technician from "../models/technicianModel.js";
import Intervention from "../models/interventionModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';


export const getTechnicianAppointments = async (req, res, next ) => {
    try {
    const { technicianId } = req.params;
    console.log(technicianId)

    if (!technicianId) {
      return res.status(400).json({ message: 'Technician ID is required' });
    }

    const appointments = await Intervention.find({ technicianId })
      .populate('userId', 'first_name last_name profilePicture') // Populate technician details
    //   .populate('userId', 'first_name last_name email') // Populate user details
      .exec();

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

//update technician
export const updateTechnician = async (req, res, next) => {
    if (req.technician.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update YOUR account !'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedTechnician = await Technician.findByIdAndUpdate(
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
        const {password, ...rest } = updatedTechnician._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteTechnician = async (req, res, next) => {
    if (req.technician.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your account'));
    }

    try {
        await Technician.findByIdAndDelete(req.params.id);
        res.status(200).json('Technician has been deleted');
    } catch (error) {
        next(error);
    }
}