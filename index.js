require("dotenv").config();
const express = require("express");
const app = express();
const userRoute = require("./routes/users");

let PORT = process.env.PORT || 3000;

//routes
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log("Server is listening on port : " + PORT);
});
