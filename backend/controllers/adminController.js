import axios from 'axios';
import bcryptjs from 'bcryptjs';
import Admin from "../models/adminModel.js";
import Technician from "../models/technicianModel.js";
import User from "../models/userModel.js";
import Intervention from "../models/interventionModel.js";
import { errorHandler } from "../utils/error.js";


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

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find(); // Fetch all admins
    res.status(200).json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getAllClients = async (req, res, next) => {
  try {
    const clients = await User.find(); // Fetch all clients
    res.status(200).json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// export const addUsers = async (req,res,next) => {
//   const { role, first_name, last_name, email, address, password } = req.body;

//   try {
//     // Validate required fields
//     if (!role || !first_name || !last_name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'All fields are required.' });
//     }

//     // Check if the user already exists
//     const existingUser =
//       (await User.findOne({ email })) ||
//       (await Technician.findOne({ email })) ||
//       (await Admin.findOne({ email }));

//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email already in use.' });
//     }

//     // Select the model dynamically based on the role
//     let Model;
//     switch (role.toLowerCase()) {
//       case 'user':
//         Model = User;
//         break;
//       case 'technician':
//         Model = Technician;
//         break;
//       case 'admin':
//         Model = Admin;
//         break;
//       default:
//         return res.status(400).json({ success: false, message: 'Invalid role.' });
//     }

//     // const saltRounds = 10;
//     // newUser.password = await bcrypt.hash(password, saltRounds);

//     // Create a new user in the appropriate collection
//     const newUser = new Model({
//       first_name,
//       last_name,
//       email,
//       address,
//       password, // You should hash passwords before saving them
//     });

//     await newUser.save();

//     res.status(201).json({
//       success: true,
//       message: `${role} created successfully.`,
//       user: newUser,
//     });
//   } catch (error) {
//     console.error('Error adding user:', error);
//     res.status(500).json({ success: false, message: 'Server error.' });
//   }
// }




export const addUsers = async (req, res, next) => {
  const { role, first_name, last_name, email, address, password } = req.body;

  try {
    // Validate required fields
    if (!role || !first_name || !last_name || !email || !password || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the user already exists
    const existingUser =
      (await User.findOne({ email })) ||
      (await Technician.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Select the model dynamically
    let Model;
    switch (role.toLowerCase()) {
      case 'user':
        Model = User;
        break;
      case 'technician':
        Model = Technician;
        break;
      case 'admin':
        Model = Admin;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Geocode the address
    const geocodeAddress = async (address) => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

      try {
        const response = await axios.get(url);
        const results = response.data;
        if (results.length > 0) {
          const { lat, lon } = results[0];
          return [parseFloat(lon), parseFloat(lat)];
        } else {
          console.log('Geocoding failed: No results found.');
          return [null, null];
        }
      } catch (error) {
        console.log(`Geocoding error: ${error.message}`);
        return [null, null];
      }
    };

    const [longitude, latitude] = await geocodeAddress(address);

    // Create user with structured address
    const newUser = new Model({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      address: {
        type: 'Point',
        addressString: address,
        coordinates: [longitude, latitude],
      },
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `${role} created successfully.`,
      user: newUser,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


export const getAllInterventions = async (req, res, next) => {
  try {
    const interventions = await Intervention.find(); // Fetch all interventions
    res.status(200).json({ interventions });
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteIntervention = async (req, res, next) => {
  try {
    // Find the intervention to retrieve the associated technician ID
    const intervention = await Intervention.findById(req.params.id);

    if (!intervention) {
      return res.status(404).json({ success: false, message: 'Intervention not found' });
    }

    const technicianId = intervention.technicianId; // Assuming `technician` field stores the Technician ID

    await Intervention.findByIdAndDelete(req.params.id);

    // Update the technician's availability
    if (technicianId) {
      await Technician.findByIdAndUpdate(technicianId, { availableStatus: true });
    }
    res.status(200).json('Intervention has been deleted and technician is again available');
  } catch (error) {
    next(error);
  }
}

export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract client ID from route parameters
    console.log(req.cookies.access_token);
    const client = await User.findById(id); // Fetch client by ID

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
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
        // Find the technician by ID and update their zone1
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
    // if (req.admin.id !== req.params.id) {
    //     return next(errorHandler(401, 'You can only update YOUR account !'));
    // }

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
    // if (req.admin.id !== req.params.id) {
    //     return next(errorHandler(401, 'You can only delete your account'));
    // }

    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json('Admin has been deleted');
    } catch (error) {
        next(error);
    }
}