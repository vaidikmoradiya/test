const Privacy = require("../Model/privacyModel");

const createPrivacyPolicy = async (req, res) => {
  try {
    const { title, description, listItems } = req.body;
    const privacy = new Privacy({ title, description, listItems });
    await privacy.save();
    res.status(201).json({
      success: true,
      message: "Privacy Policy Created Successfully",
      data: privacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Creating Privacy Policy",
    });
  }
};
const getAllPrivacyPolicy = async (req, res) => {
  try {
    const privacy = await Privacy.find().sort({ createdAt: -1 });
    res.status(200).json(privacy);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Fetching Privacy Policy",
    });
  }
};

const getPrivacyPolicyById = async (req, res) => {
  try {
    const id = req.params.id;
    const privacy = await Privacy.findById(id);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy Not Found",
      });
    }
    res.status(200).json({
      success: true,
      data: privacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Fetching Privacy Policy",
    });
  }
};

const updatePrivacyPolicy = async (req, res) => {
  try {
    const id = req.params.id;
    const privacy = await Privacy.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Privacy Policy Updated Successfully",
      data: privacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Updating Privacy Policy",
    });
  }
};

const deletePrivacyPolicy = async (req, res) => {
  try {
    const id = req.params.id;
    const privacy = await Privacy.findByIdAndDelete(id);
    if (!privacy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Privacy Policy Deleted Successfully",
      data: privacy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Deleting Privacy Policy",
    });
  }
};

module.exports = {
  createPrivacyPolicy,
  getAllPrivacyPolicy,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
