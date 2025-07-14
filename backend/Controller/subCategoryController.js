const subCategory = require('../Model/subCategoryModel');

exports.createSubCategory = async (req, res) => {
    try {
        const { mainCategoryId, categoryId, subCategoryName } = req.body;

        let subCategoryData = await subCategory.findOne({ mainCategoryId, categoryId, subCategoryName });

        if (subCategoryData) {
            return res.status(404).json({ status: false, message: 'Sub Category Already Exists...' })
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
        subCategoryData = await subCategory.create({
            mainCategoryId,
            categoryId,
            subCategoryName,
            image 
        });

        return res.status(201).json({ status: true, message: 'Sub Category Create Successfully....', data: subCategoryData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updateSubCategory = async (req, res) => {
    try {
        const id = req.params.id;

        let subCategoryData = await subCategory.findById(id);

        if (!subCategoryData) {
            return res.status(404).json({ status: false, message: "Sub Category Not Found." });
        }
        const image = req.file ? req.file.path.replace(/\\/g, '/') :subCategoryData.image;
        subCategoryData = await subCategory.findByIdAndUpdate(id, { ...req.body, image  }, { new: true });

        return res.status(200).json({ status: true, message: 'Sub Category Updated Successfully......', data: subCategoryData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getSubCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        let subCategoryData = await subCategory.aggregate([
            {
              $lookup: {
                from: 'maincategories',
                localField: 'mainCategoryId',
                foreignField: '_id',
                as: 'mainCategoryData'
              }
            },
            {
                $lookup: {
                  from: 'categories',
                  localField: 'categoryId',
                  foreignField: '_id',
                  as: 'categoryData'
                }
            }
        ]);;

        if (!subCategoryData) {
            return res.status(404).json({ status: false, message: "Sub Category Not Found." });
        }

        return res.status(200).json({ status: true, message: 'Sub Category Found Successfully....', data: subCategoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllSubCategory = async (req, res) => {
    try {
        const subCategoryData = await subCategory.aggregate([
            {
              $lookup: {
                from: 'maincategories',
                localField: 'mainCategoryId',
                foreignField: '_id',
                as: 'mainCategoryData'
              }
            },
            {
                $lookup: {
                  from: 'categories',
                  localField: 'categoryId',
                  foreignField: '_id',
                  as: 'categoryData'
                }
            }
        ]);
        if (!subCategoryData.length > 0) {
            return res.status(404).json({ status: false, message: "Sub Category Not Found." });
        }

        return res.status(200).json({ status: true, message: 'Sub Category Found Successfully....', data: subCategoryData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}
exports.deleteSubCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        let subCategoryData = await subCategory.findByIdAndDelete(id);

        if (!subCategoryData) {
            return res.status(404).json({ status: false, message: "Sub Category Not Found." });
        }

        return res.status(200).json({ status: true, message: 'Sub Category Delete Successfully....' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}