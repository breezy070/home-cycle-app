import Intervention from "../models/interventionModel.js";

export const test = (req, res) => {
    res.json({
       message: 'API is working' 
    });
}

// Fetch comments
export const fetchInterventionComments = async (req, res) => {
    try {
      const intervention = await Intervention.findById(req.params.id).populate('comments.user', 'first_name last_name');
      if (!intervention) {
        return res.status(404).json({ message: 'Intervention not found' });
      }
  
      res.status(200).json(intervention.comments);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
};

export const addInterventionComment = async (req, res) => {
    try {
      const { userId, text, userModel } = req.body;
      if (!['User', 'Technician'].includes(userModel)) {
        return res.status(400).json({ error: 'Invalid user model' });
      }
      const intervention = await Intervention.findById(req.params.id);
      if (!intervention) {
        return res.status(404).json({ message: 'Intervention not found' });
      }
  
      intervention.comments.push({ user: userId, text, userModel: userModel, });
      await intervention.save();
  
      res.status(201).json(intervention.comments);
    } catch (err) {
      res.status(500).json({ message: 'Error adding comment', error: err.message });
    }
};