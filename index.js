require("dotenv").config();
const express = require("express");
const app = express();

const birthday_timer = require("./timer/timer_main.js");
// if you want to add anniversary notification, just create js file under timer folder
// and call the file like birthday_timer.js (above)

const userRoute = require("./routes/users");

let port = process.env.PORT || 3000;

//routes
app.use("/user", userRoute);

app.listen(port, () => {
  console.log("Server is listening on port : " + port);
});
