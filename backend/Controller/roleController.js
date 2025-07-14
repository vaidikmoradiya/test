const role = require('../Model/roleModel');
const userModel = require('../Model/userModel');

exports.createRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        let roleData = await role.findOne({ roleName });
        if (roleData) {
            return res.status(400).json({ status: false, message: 'Role Already Exists....' });
        }

        roleData = await role.create({
            roleName
        });

        return res.status(201).json({ status: true, message: 'Role Create Successfully...', data: roleData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updateRole = async (req, res) => {
    try {
        const id = req.params.id;

        let roleData = await role.findById(id);

        if (!roleData) {
            return res.status(404).json({ status: false, message: 'Role Not Found...' });
        }

        roleData = await role.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(200).json({ status: true, message: 'Role Updated Successfully....', data: roleData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getRoleById = async (req, res) => {
    try {
        const id = req.params.id;

        let roleData = await role.findById(id);

        if (!roleData) {
            return res.status(404).json({ status: false, message: 'Role Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Role Found Successfully....',data:roleData });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.deleteRoleById = async (req, res) => {
    try {
        const id = req.params.id;

        const roleData = await role.findByIdAndDelete(id);

        if (!roleData) {
            return res.status(404).json({ status: false, message: 'Role Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Role Delete Successfully....' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.getAllRole = async (req, res) => {
    try {
        const roleData = await role.find();

        if (!roleData.length > 0) {
            return res.status(404).json({ status: false, message: 'Role Not Found' });
        }

        return res.status(200).json({ status: true, message: 'Role Found successfully...', data: roleData });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}