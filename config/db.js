const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const connectDB = async () => {
      try {
            await mongoose.connect(process.env.DB_URL, {
                  // userNewUrlParser: true,
                  // useCreateIndex: true,
                  useUnifiedTopology: true,
                  // useFindAndModify: true
            });
            console.log("MongoDB Connect")
      }
      catch (err) {
            console.log(err.message)
      }
};
module.exports = connectDB;