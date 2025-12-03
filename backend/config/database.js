const mongoose = require('mongoose')
require('dotenv').config()

exports.connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('DB Connected Successfully'))
    .catch((e) => {
        console.log('DB Connected failed-->',e)
        process.exit(1)
    })
}