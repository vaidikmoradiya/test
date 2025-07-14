const unit = require('../Model/unitModel');

exports.createUnit = async (req, res) => {
    try {
        const { unitName, shortName } = req.body;

        let unitData = await unit.findOne({ unitName: unitName });

        if (unitData) {
            return res.status(400).json({ status: false, message: 'Unit Name Already Exist' });
        }

        unitData = await unit.create({
            unitName,
            shortName
        });
        return res.status(201).json({ status: true, message: 'Unit Create Successfully....', data: unitData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updateUnit = async (req, res) => {
    try {
        const id = req.params.id;

        let unitData = await unit.findById(id);

        if (!unitData) {
            return res.status(404).json({ status: false, message: 'Unit Not Found' });
        }

        unitData = await unit.findByIdAndUpdate(id, { ...req.body }, { new: true });

        return res.status(200).json({ status: true, message: 'Unit Updated Successfully....', data: unitData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getUnitById = async (req, res) => {
    try {
        const id = req.params.id;

        let unitData = await unit.findById(id);

        if (!unitData) {
            return res.status(404).json({ status: false, message: 'Unit Not Found' });
        }
        return res.status(200).json({ status: true, message: 'Unit Found Successfully...', data: unitData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.deleteUnitById = async (req, res) => {
    try {
        const id = req.params.id;

        const unitData = await unit.findByIdAndDelete(id);

        if (!unitData) {
            return res.status(404).json({ status: false, message: 'Unit Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Unit Delete Successfully....' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllUnit = async (req, res) => {
    try {
        const unitData = await unit.find();

        if (unitData.length < 0) {
            return res.status(404).json({ status: false, message: 'Unit Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Unit Found Successfully...', data: unitData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}