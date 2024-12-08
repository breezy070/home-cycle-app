import Admin from "../models/adminModel.js";
import Technician from "../models/technicianModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const getAllTechnicians = async (req, res, next ) => {
    // res.json({
    //    message: 'API is working' 
    // });
    try {
        const technicians = await Technician.find(); // Fetch all technicians
        res.status(200).json({ technicians });
      } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ message: 'Server error' });
      }
}

export const getTechnicianZone = async (req, res, next ) => {
    try {
        const technician = await Technician.findById(req.params.technicianId);
        
        if (!technician || !technician.zone) {
          return res.status(404).json({ message: 'Zone not found for this technician' });
        }
    
        // Send the zone as GeoJSON
        res.json({ zone: technician.zone });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

export const assignTechnicianZone = async (req, res, next ) => {
    const { technicianId, coordinates } = req.body; // Extract data from the request

    try {
        // Find the technician by ID and update their zone
        const technician = await Technician.findByIdAndUpdate(
        technicianId,
        {
            $set: {
            zone: {
                type: 'Polygon',
                coordinates: coordinates, // The GeoJSON Polygon coordinates
            },
            },
        },
        { new: true } // Return the updated technician object
        );

        if (!technician) {
        return res.status(404).json({ message: 'Technician not found' });
        }

        // Return the updated technician data
        res.status(200).json({ message: 'Zone assigned successfully', technician });
    } catch (error) {
        console.error('Error assigning zone to technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//update admin
export const updateAdmin = async (req, res, next) => {
    if (req.admin.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update YOUR account !'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
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
        const {password, ...rest } = updatedAdmin._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteAdmin = async (req, res, next) => {
    if (req.admin.id !== req.params.id) {
        return next(errorHandler(401, 'You can only delete your account'));
    }

    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json('Admin has been deleted');
    } catch (error) {
        next(error);
    }
}