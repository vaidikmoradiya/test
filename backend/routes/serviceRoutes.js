const express = require('express');
const router = express.Router();
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../Controller/serviceController');

router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router; 