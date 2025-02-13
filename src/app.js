const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const auth = require("./routes/Auth");
const profile = require("./routes/Profile");
const request = require("./routes/Request")

app.use("/", auth);
app.use("/", profile);
app.use("/", request);

connectDB()
  .then(() => {
    console.log("database connection is established");
    app.listen(3000, () => {
      console.log("sever is listening on port 3000");
    });
  })
  .catch((error) => {
    console.error("database cannot be connceted");
  });



  
