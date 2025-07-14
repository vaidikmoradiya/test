const mongoose  = require('mongoose');
const category = require('../Model/categoryModel');


exports.createCategory = async (req, res) => {
    try {
        const { mainCategoryId, categoryName } = req.body;

        let categoryData = await category.findOne({ mainCategoryId, categoryName });

        if (categoryData) {
            return res.status(400).json({ status: false, message: 'Category Already Exist....' })
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
        categoryData = await category.create({
            mainCategoryId,
            categoryName,
            image
        });

        return res.status(201).json({ status: true, message: 'Category Create successfully....', data: categoryData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}

exports.updateCategory = async (req, res) => {
    try {

        const id = req.params.id;

        let categoryData = await category.findById(id);

        if (!categoryData) {
            return res.status(404).json({ status: false, message: "Category Not Found." });
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') : categoryData.image;
        categoryData = await category.findByIdAndUpdate(id, { ...req.body,image }, { new: true });

        return res.status(200).json({ status: true, message: 'Category Updated Successfully......', data: categoryData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const categoryData = await category.aggregate([
            {
              $lookup: {
                from: 'maincategories',
                localField: 'mainCategoryId',
                foreignField: '_id',
                as: 'mainCategoryData'
              }
            }]);
        if (!categoryData.length > 0) {
            return res.status(404).json({ status: false, message: 'Category Not Found' })
        }

        return res.status(200).json({ status: true, message: 'All Category Found Successfully......', data: categoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const categoryData = await category.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
              $lookup: {
                from: 'maincategories',
                localField: 'mainCategoryId',
                foreignField: '_id',
                as: 'mainCategoryData'
              }
            }]);;

        if (!categoryData) {
            return res.status(404).json({ status: false, message: 'Category Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Category Found Successfully....', data: categoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }

}

exports.deleteCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const categoryData = await category.findByIdAndDelete(id);
        if (!categoryData) {
            return res.status(404).json({ status: false, message: 'Category Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Category Delete Sucessfully......' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}