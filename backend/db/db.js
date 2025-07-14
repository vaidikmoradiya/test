const mongoose = require('mongoose');


exports.connectDb = async () => {
    try {
        await mongoose
            .connect(process.env.MONGO_URL)
            .then(() => console.log("DB Is Connected"))
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message })
    }
}
