const product = require('../Model/productModel');
const mongoose = require('mongoose');
exports.createProduct = async (req, res) => {
    try {
        const {
            mainCategoryId,
            categoryId,
            subCategoryId,
            productName,
            sizeNameId,
            size,
            unit,
            price,
            discount,
            shortDescription,
            description,
            stockStatus,
            data
        } = req.body;

        if (!mainCategoryId) {
            return res.status(400).json({ status: false, message: "mainCategoryId is required" });
        }

        let productData = await product.findOne({ mainCategoryId, categoryId, subCategoryId, productName });
        if (productData) {
            return res.status(400).json({ status: false, message: "Product already exists" });
        }

        const files = req.files && req.files['productImage'] ? req.files['productImage'] : [];
        
        // Properly handle the data field
        let parsedData = [];
        
        if (data) {
            // If data is already an array of objects
            if (Array.isArray(data) && typeof data[0] === 'object') {
                parsedData = data;
            } 
            // If data is an array of strings that need parsing
            else if (Array.isArray(data)) {
                parsedData = data.map(item => {
                    if (typeof item === 'string') {
                        try {
                            return JSON.parse(item);
                        } catch (err) {
                            // Try to fix malformed JSON strings
                            try {
                                const fixedItem = item
                                    .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // wrap keys in quotes
                                    .replace(/:\s*(\w+)\s*([,}])/g, ': "$1"$2'); // wrap values in quotes
                                return JSON.parse(fixedItem);
                            } catch (innerErr) {
                                console.error('Failed to parse data item:', item);
                                return null;
                            }
                        }
                    }
                    return item;
                }).filter(Boolean); // Remove nulls
            } 
            // If data is a single string
            else if (typeof data === 'string') {
                try {
                    // Try parsing as JSON array first
                    parsedData = JSON.parse(data);
                    if (!Array.isArray(parsedData)) {
                        parsedData = [parsedData]; // Ensure it's an array
                    }
                } catch (err) {
                    console.error('Failed to parse data as JSON array, trying individual objects');
                    // Try parsing as individual objects
                    try {
                        // Split by comma if it might be a comma-separated list
                        const items = data.includes(',') ? data.split(',') : [data];
                        parsedData = items.map(item => {
                            try {
                                const fixedItem = item
                                    .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // wrap keys in quotes
                                    .replace(/:\s*(\w+)\s*([,}])/g, ': "$1"$2'); // wrap values in quotes
                                return JSON.parse(fixedItem);
                            } catch (parseErr) {
                                console.error('Failed to parse item:', item);
                                return null;
                            }
                        }).filter(Boolean);
                    } catch (innerErr) {
                        console.error('Failed to process data string:', data);
                    }
                }
            }
        }
        console.log('Parsed data:', parsedData);

        const discountedPrice = price - (price * discount / 100);

        const newProduct = await product.create({
            mainCategoryId,
            categoryId,
            subCategoryId,
            productName,
            sizeNameId,
            size,
            unit,
            price,
            discount,
            stockStatus,
            discountedPrice,
            productImage: files.map(file => file.path),
            shortDescription,
            description,
            data: parsedData // Use the properly parsed data
        });

        return res.status(201).json({ status: true, message: "Product created", product: newProduct });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.getAllProduct = async (req, res) => {
    try {
        // const productData = await product.find();

        let productdata = await product.aggregate([
            {
                $lookup: {
                    from: 'maincategories',
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            }
            ,{
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },{
                $lookup: {
                    from: 'sizes',
                    localField: "sizeNameId",
                    foreignField: "_id",
                    as: "sizeData"
                }
            }
        ])
        
        if (!productdata.length > 0) {
            return res.status(404).json({ status: false, message: 'Main Category Not Found' })
        }

        return res.status(200).json({ status: true, message: 'Main Category Found Successfully.....', data: productdata });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const productData = await product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'maincategories',
                    localField: "mainCategoryId",
                    foreignField: "_id",
                    as: "mainCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategoryData"
                }
            },
            {
                $lookup: {
                    from: 'sizes',
                    localField: "sizeNameId",
                    foreignField: "_id",
                    as: "sizeData"
                }
            }
        ]);
        
        if (!productData) {
            return res.status(404).json({ status: false, message: 'Product Not Found' });
        }
        
        return res.status(200).json({ status: true, message: 'Product Found Successfully', data: productData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            mainCategoryId,
            categoryId,
            subCategoryId,
            productName,
            sizeNameId,
            size,
            unit,
            price,
            discount,
            stockStatus,
            shortDescription,
            description,
            data,
            status
        } = req.body;
        
        // Check if product exists
        const productExists = await product.findById(id);
        if (!productExists) {
            return res.status(404).json({ status: false, message: 'Product Not Found' });
        }
        
        // Handle data parsing similar to createProduct
        let parsedData = [];
        
        if (data) {
            // If data is already an array of objects
            if (Array.isArray(data) && typeof data[0] === 'object') {
                parsedData = data;
            } 
            // If data is an array of strings that need parsing
            else if (Array.isArray(data)) {
                parsedData = data.map(item => {
                    if (typeof item === 'string') {
                        try {
                            return JSON.parse(item);
                        } catch (err) {
                            // Try to fix malformed JSON strings
                            try {
                                const fixedItem = item
                                    .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // wrap keys in quotes
                                    .replace(/:\s*(\w+)\s*([,}])/g, ': "$1"$2'); // wrap values in quotes
                                return JSON.parse(fixedItem);
                            } catch (innerErr) {
                                console.error('Failed to parse data item:', item);
                                return null;
                            }
                        }
                    }
                    return item;
                }).filter(Boolean); // Remove nulls
            } 
            // If data is a single string
            else if (typeof data === 'string') {
                try {
                    // Try parsing as JSON array first
                    parsedData = JSON.parse(data);
                    if (!Array.isArray(parsedData)) {
                        parsedData = [parsedData]; // Ensure it's an array
                    }
                } catch (err) {
                    console.error('Failed to parse data as JSON array, trying individual objects');
                    // Try parsing as individual objects
                    try {
                        // Split by comma if it might be a comma-separated list
                        const items = data.includes(',') ? data.split(',') : [data];
                        parsedData = items.map(item => {
                            try {
                                const fixedItem = item
                                    .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // wrap keys in quotes
                                    .replace(/:\s*(\w+)\s*([,}])/g, ': "$1"$2'); // wrap values in quotes
                                return JSON.parse(fixedItem);
                            } catch (parseErr) {
                                console.error('Failed to parse item:', item);
                                return null;
                            }
                        }).filter(Boolean);
                    } catch (innerErr) {
                        console.error('Failed to process data string:', data);
                    }
                }
            }
        }
        
        // Handle file uploads if any
        const updateData = {
            mainCategoryId,
            categoryId,
            subCategoryId,
            productName,
            sizeNameId,
            size,
            unit,
            price,
            discount,
            shortDescription,
            description,
            data: parsedData,
            status,
            stockStatus
        };
        
        // Handle product image update if files are provided
        const files = req.files && req.files['productImage'] ? req.files['productImage'] : [];
        if (files.length > 0) {
            updateData.productImage = files.map(file => file.path);
        }
        
        // Update the product
        const updatedProduct = await product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        return res.status(200).json({ 
            status: true, 
            message: "Product updated successfully", 
            product: updatedProduct 
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Check if product exists
        const productExists = await product.findById(id);
        if (!productExists) {
            return res.status(404).json({ status: false, message: 'Product Not Found' });
        }
        
        // Update the product status
        const updatedProduct = await product.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );
        
        return res.status(200).json({ 
            status: true, 
            message: "Product status updated successfully", 
            product: updatedProduct 
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if product exists
        const productExists = await product.findById(id);
        if (!productExists) {
            return res.status(404).json({ status: false, message: 'Product Not Found' });
        }
        
        // Delete the product
        await product.findByIdAndDelete(id);
        
        return res.status(200).json({ 
            status: true, 
            message: "Product deleted successfully"
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};