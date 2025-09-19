const axios = require('axios');

const validatePincode = async (req, res) => {
    try {
        const { pincode } = req.params;
        
        // Validate pincode format
        if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 6-digit pincode'
            });
        }

        // Call the postal pincode API
        const response = await axios.get(`http://www.postalpincode.in/api/pincode/${pincode}`);
        const data = response.data;

        if (data.Status === 'Success' && data.PostOffice && data.PostOffice.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Pincode validated successfully',
                data: data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode. Please check and try again.',
                data: null
            });
        }
    } catch (error) {
        console.error('Pincode validation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to validate pincode. Please try again.',
            error: error.message
        });
    }
};

module.exports = {
    validatePincode
};
