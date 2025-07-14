const AboutUs = require("../Model/aboutUsModel");

const createAboutUs = async (req, res) => {
    try {
        const { title, description } = req.body;
        const files = req.files['image'];
        if(files.length < 1 || files.length > 4 || (files.length > 1 && files.length < 4)){
            return res.status(400).json({
                success: false,
                message: "Image count must be either 1 or 4."
            })
        }
        
        var savedAboutUs = await AboutUs.create({
            title,
            description,
            image: files.map(file => file.path)
        })
        // const aboutUs = new AboutUs(
        //     title, description, image
        // )
        // const savedAboutUs = await aboutUs.save();
        res.status(200).json({
            success: true,
            message: "About Us created successfully",
            data: savedAboutUs
        })
    } catch {
        res.status(400).json({
            success: false,
            message: "Error Creating Aboutus"
        })
    }
}

const getAllAboutUS = async (req, res) => {
    try {
        const allAbout = await AboutUs.find();
        res.status(200).json(allAbout)
    } catch {
        res.status(400).json({
            success: false,
            message: "Error fetching Aboutus"
        })
    }
}

const getAboutUsById = async (req, res) => {
    try {
        const getAboutUs = await AboutUs.findById(req.params.id);
        if (!getAboutUs) {
            return res.status(404).json({
                success: false,
                message: "About Us not found"
            })
        }
        res.status(200).json({
            success: true,
            data: getAboutUs
        })
    } catch {
        res.status(400).json({
            success: false,
            message: "Error fetching About Us"
        })
    }
}

const updateAboutUs = async (req, res) => {
    try {
        const { title, description } = req.body;
        const updateData = { title, description };
        
        // Handle new images
        if (req.files && req.files['image']) {
            const files = req.files['image'];
            if(files.length > 4){
                return res.status(400).json({
                    success: false,
                    message: "Max limit of image is 4."
                });
            }
            updateData.image = files.map(file => file.path);
        }
        
        // Handle existing images if no new images are uploaded
        if (!req.files || !req.files['image']) {
            // Keep existing images if no new ones are provided
            const existingAbout = await AboutUs.findById(req.params.id);
            if (existingAbout) {
                updateData.image = existingAbout.image;
            }
        }
        
        const updateAbout = await AboutUs.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updateAbout) {
            return res.status(404).json({
                success: false,
                message: "About Us not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "About Us updated successfully",
            data: updateAbout
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating About Us",
            error: error.message
        });
    }
}

const deleteAboutUs = async (req,res) => {
    try {
        const deleteAboutUs = await AboutUs.findByIdAndDelete(req.params.id);
        if (!deleteAboutUs) {
            res.status(404).json({
                success: false,
                message: "About Us not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "About Us deleted successfully",
        })
    } catch {
        res.status(400).json({
            success: false,
            message: "Error deleting About Us"
        })
    }
}

module.exports = {
    createAboutUs,
    getAllAboutUS,
    getAboutUsById,
    updateAboutUs,
    deleteAboutUs
}
