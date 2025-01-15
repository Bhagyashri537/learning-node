const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://shreee:dbUser@cluster0.ibqmk.mongodb.net/myapp"
    )
}

module.exports = connectDB;