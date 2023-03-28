const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log(`MongoDB Connected: ' + ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Erroe: ${error.message}`.red.bold);
        process.exit();
    }
}

module.exports = connectdb;
