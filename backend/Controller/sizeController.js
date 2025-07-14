const sizeModel = require('../Model/sizeModel');

exports.createSize = async (req, res) => {
    try {
        const { mainCategoryId, categoryId, subCategoryId, sizeName, size, unitId } = req.body;

        const sizeData = await sizeModel.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            sizeName,
            size,
            unitId
        });

        return res.status(200).json({ status: true, message: 'Size Create Successfully....', data: sizeData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updateSizeById = async (req, res) => {
    try {
        const id = req.params.id;

        let sizeData = await sizeModel.findById(id);
        if (!sizeData) {
            return res.status(404).json({ status: false, message: 'Size Not Found' });
        }

        sizeData = await sizeModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: true, message: 'Size Updated Successfully...', data: sizeData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getSizeById = async (req, res) => {
    try {
        const id = req.params.id;

        let sizeData = await sizeModel.findById(id);

        if (!sizeData) {
            return res.status(404).json({ status: false, message: 'Size Found Successfully...' });
        }

        return res.status(200).json({ status: true, message: 'Size Found Successfully...', data: sizeData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.deleteSizeById = async (req, res) => {
    try {
        const id = req.params.id;

        let sizeData = await sizeModel.findByIdAndDelete(id).populate('categoryId').populate('mainCategoryId').populate('subCategoryId').populate('unitId');

        if (!sizeData) {
            return res.status(404).json({ status: false, message: 'Size Not Found', data: sizeData });
        }

        return res.status(200).json({ status: true, message: 'Size Delete Successfully....' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllSize = async (req, res) => {
    try {
        const sizeData = await sizeModel.find().populate('categoryId').populate('mainCategoryId').populate('subCategoryId').populate('unitId');
        if (sizeData.length < 0) {
            return res.status(404).json({ status: false, message: 'Size Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Size Found Successfully...', data: sizeData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}