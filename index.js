require("dotenv").config();
const express = require("express");
const app = express();

const userRoute = require("./routes/users");

let port = process.env.PORT || 3000;

//routes
app.use("/user", userRoute);

app.listen(port, () => {
  console.log("Server is listening on port : " + port);
});
