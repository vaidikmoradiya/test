const mongoose= require('mongoose');

const unitSchema =  mongoose.Schema({
    unitName: {
        type: String,
        require:true
    },
    shortName: {
        type: String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    }
}, {
    timesteps:true,
    versionKey:false
});

module.exports = mongoose.model('unit',unitSchema);