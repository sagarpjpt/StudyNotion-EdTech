const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    gender: {
        type:String
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type:Number,
        trim: true
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    phoneVerifiedAt: {
        type: Date
    },
})

module.exports = mongoose.model("Profile", profileSchema)