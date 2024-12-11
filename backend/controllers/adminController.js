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
        console.log("techzone: ",technician.zone)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

export const getAllTechnicianZones = async (req, res) => {
    try {
      const technicians = await Technician.find(); // Assuming you have a Technician model
      if (!technicians || technicians.length === 0) {
        return res.status(404).json({ message: 'No technician zones found' });
      }
  
      res.status(200).json({ zones: technicians.zone });
      console.log(technicians)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

export const assignTechnicianZone = async (req, res, next ) => {
    const { technicianId, coordinates } = req.body; // Extract data from the request
    console.log("coord: " + coordinates)

    // Ensure the first and last points are the same : mongodB requires that the loop closes (1 position should be the same as the last)
    const firstPoint = coordinates[0][0];
    const lastPoint = coordinates[0][coordinates[0].length - 1];

    // If they are not the same, make them the same
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    coordinates[0].push(firstPoint);  // Close the polygon
    }

    try {
        // Find the technician by ID and update their zone
        const technician = await Technician.findByIdAndUpdate(
            technicianId,  // The technician's id (to identify which technician to update)
            {
              $set: {
                zone: {  // Setting the zone field with valid data
                  type: 'Polygon',
                  coordinates: coordinates,
                }
              }
            },
            { new: true }  // Option to return the updated document
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