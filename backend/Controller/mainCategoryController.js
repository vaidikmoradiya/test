const mainCategory = require('../Model/mainCategoryModal');

exports.createMainCategory = async (req, res) => {
    try {
        const { mainCategoryName } = req.body;

        const existsMainCategory = await mainCategory.findOne({ mainCategoryName });

        if (existsMainCategory) {
            return res.status(400).json({ status: false, message: 'Main Category Name Already Exist' })
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const mainCategoryData = await mainCategory.create({
            mainCategoryName,
            image
        });
        return res.status(201).json({ status: true, message: 'Main Category Create Successfully.....', data: mainCategoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

exports.upadteMainCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        let mainCategoryData = await mainCategory.findById(id);

        if (!mainCategoryData) {
            return res.status(404).json({ status: false, message: "Main Category Not Found" });
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') : mainCategoryData.image;
        mainCategoryData = await mainCategory.findByIdAndUpdate(id, { ...req.body,image }, { new: true });

        return res.status(200).json({ status: true, message: 'Main Category Updated Successfully.....', data: mainCategoryData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllMainCategory = async (req, res) => {
    try {
        const mainCategoryData = await mainCategory.find();

        if (!mainCategoryData.length >0 ) {
            return res.status(404).json({ status: false, message: 'Main Category Not Found' })
        }

        return res.status(200).json({ status: true, message: 'Main Category Found Successfully.....', data: mainCategoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getMainCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const mainCategoryData = await mainCategory.findById(id);

        if (!mainCategoryData) {
            return res.status(404).json({ status: false, message: 'Main Category Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Main Category Found Successfully....', data: mainCategoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.deleteMainCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const mainCategoryData = await mainCategory.findByIdAndDelete(id);

        if (!mainCategoryData) {
            return res.status(404).json({ status: false, message: 'Main Category Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Main Category Delete Successfully.......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}