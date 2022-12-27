require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler=require("./middleware/error")
// connect  DB
connectDB();

const app = express();
app.use(express.json());

// route method process
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));


// errorhandle should be last error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3300;

const server = app.listen(PORT, () => console.log(`Server running port : ${PORT}`));
process.on("unhandledRejection", (err, promise) => {
      console.log(`Logged error ${err}`);
      server.close(() => process.exit(1));
})