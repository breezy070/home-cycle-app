import User from "../models/userModel.js";
import Technician from "../models/technicianModel.js";
import Intervention from "../models/interventionModel.js";
import Facture from '../models/factureModel.js'; // adjust if needed
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
};

//update user
export const updateUser = async (req, res, next) => {
    // if (req.user.id !== req.params.id) {
    //     return next(errorHandler(401, 'You can only update YOUR account !'));
    // }

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

    // if (req.user.id !== req.params.id) {
    //     return next(errorHandler(401, 'You can only delete your account'));
    // }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
}

export const scheduleAppointment = async (req, res, next ) => {
    try {
        const { userId, date, services,  location } = req.body;

        const [lng, lat] = location; // Ensure this is an array [lng, lat]

        console.log("location: ", location)


        if (!userId || !date || !location) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!Array.isArray(location) || location.length !== 2) {
            return res.status(400).json({ message: 'Invalid location format. Must be [longitude, latitude]' });
        }

        // Find a technician available in the user's zone
        //findOne and update
        const technician = await Technician.findOneAndUpdate(
            {
                availableStatus: true,
                zone: {
                    $geoIntersects: {
                        $geometry: {
                        type: 'Point',
                        coordinates: location,
                        // coordinates: [lng, lat],
                        },
                    },
                },
            },
            { $set: { availableStatus: false } },
            { new: true } // Return the updated technician
        );


        if (!technician) {
            return res.status(404).json({ message: 'No technician available in your zone' });
        }

        // Create an appointment
        const intervention = new Intervention({
            userId,
            technicianId: technician._id,
            date,
            services
     
        });

        await intervention.save();

        res.status(200).json({ message: 'Appointment scheduled', intervention });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
        }
}

export const getAppointments = async (req, res, next ) => {
    try {
    const { userId } = req.params;
    console.log(userId)

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const appointments = await Intervention.find({ userId })
      .populate('technicianId', 'first_name last_name profilePicture') // Populate technician details
      .populate('userId', 'first_name last_name email') // Populate user details
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

// export const updateAppointmentStatus = async (req, res, next ) => {
//     // if (req.user.id !== req.params.id) {
//     //     return next(errorHandler(401, 'You can only delete your appointments'));
//     // }

//     // try {
//     //     await Intervention.findByIdAndUpdate(req.params.id);
//     //     res.status(200).json('Appointent has been cancelled !');
//     // } catch (error) {
//     //     next(error);
//     // }

//     // if (req.technician.id !== req.params.id) {
//     //     return next(errorHandler(401, 'You can only update YOUR account !'));
//     // }

//     // try {
//     //     if (req.body.password) {
//     //         req.body.password = bcryptjs.hashSync(req.body.password, 10)
//     //     }

//     const { appointmentId } = req.params;
//     const { status } = req.body;
  
//     try {
//       const updatedAppointment = await Intervention.findByIdAndUpdate(
//         appointmentId,
//         { status },
//         { new: true }
//       );
  
//       if (!updatedAppointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//       }

//     // ✅ Create receipt if accepted
//     if (status === 'Accepted') {
//     await Receipt.create({
//         appointmentId: updatedAppointment._id,
//         userId: updatedAppointment.userId,
//         technicianId: updatedAppointment.technicianId,
//         services: updatedAppointment.services,
//         price: 40, // or derive from services
//         date: updatedAppointment.date,
//         createdAt: new Date()
//     });
//     }
  
//       res.status(200).json({ success: true, data: updatedAppointment });
//     } catch (error) {
//       console.error('Error updating appointment:', error);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
// }

        // const updatedTechnician = await Technician.findByIdAndUpdate(
        //     req.params.id,
        //     {
        //         $set: {
        //             first_name: req.body.first_name,
        //             last_name: req.body.last_name,
        //             email: req.body.email,
        //             password: req.body.password,
        //             profilePicture: req.body.profilePicture,
        //         }
        //     },
        //     //show updated
        //     {new: true}
        // );
        // const {password, ...rest } = updatedTechnician._doc;
        // res.status(200).json(rest);
//     } catch (error) {
//         next(error)
//     }
// }

export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const updatedAppointment = await Intervention.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate('technicianId', 'first_name last_name profilePicture').populate('userId', 'first_name last_name profilePicture'); // populate for facture

    if (!updatedAppointment) {
      return res.status(200).json({ message: 'Appointment not found' });
    }

    // ✅ Create facture when appointment is accepted by the technician
    if (status === 'Accepted') {
      const technician = updatedAppointment.technicianId;
      const user = updatedAppointment.userId;

      await Facture.create({
        userId : user._id,
        technicianId : technician._id,
        technicianName: `${technician.first_name} ${technician.last_name}`,
        userName: `${user.first_name} ${user.last_name}`,
        date: updatedAppointment.date,
        description: `Services: ${updatedAppointment.services.join(', ')}`,
        status: status, //fix this, i think in the model is set as a number
        technicianImage: technician.profilePicture || "src/assets/technician1.jpg"
      });
    }

    res.status(200).json({ message: 'Appointment updated', appointment: updatedAppointment });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


