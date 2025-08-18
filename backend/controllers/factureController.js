import Facture from "../models/factureModel.js";

//test on http://localhost:3000/api/factures
export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
}

export const fetchAllFactures = async (req, res, next ) => {
    try {
    const { userId } = req.params;
    console.log(userId)

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const factures = await Facture.find({ userId })
      .populate('technicianId', 'first_name last_name profilePicture') // Populate technician details
      .populate('userId', 'first_name last_name email') // Populate user details
      .exec();

    // if (!factures || factures.length === 0) {
    //   return res.status(404).json({ message: 'No factures found' });
    // }

    res.status(200).json({ factures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}