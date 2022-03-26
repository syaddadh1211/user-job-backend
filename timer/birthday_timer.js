const { threadId, parentPort } = require("worker_threads");
const pool = require("../db/db");
const https = require("https");

let daily_interval = 3;
//set time to deliver, 9am
let h_time = 10;

parentPort.addListener("interval", (interval) => {
  daily_interval = interval;
  parentPort.close();
});

const data = {
  message: "",
};

const options = {
  hostname: "hookb.in",
  port: 443,
  path: "/QJ9Epkj3BEi8mNzzl7wJ",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

//get local date
function calcTime(city, offset) {
  var b = new Date();
  var utc = b.getTime() + b.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * offset);
  return nd;
}

//get data from user table (interval = everyday) = 1000 * 60 * 24,
//but in this scenario i use interval every 3 second for simple debuggging

const test = setInterval(() => {
  pool.query(
    "Select to_char(birthday, 'mm-dd') as month, id, f_name,l_name, location, gmt_offset from public.user",
    (err, res) => {
      if (!err) {
        //checking current month, if match with birthday month then checking day, if not continue
        for (let i = 0; i < res.rows.length; i++) {
          //get birthday month and day
          let month = res.rows[i].month.slice(0, 2);
          let day = res.rows[i].month.slice(3, 5);

          //get current date based on user location
          let y_m_d = calcTime(res.rows[i].location, res.rows[i].gmt_offset);
          let c_month = y_m_d.getMonth() + 1;
          let c_date = y_m_d.getDate();

          //if month and day match with local date
          if (month == c_month && day == c_date) {
            let c_hour = y_m_d.getHours();
            //if hour match with c_hour
            if (h_time == c_hour) {
              // console.info("User hour : " + c_hour);
              console.log("User location : " + res.rows[i].location);
              console.log(`Hey, ${res.rows[i].f_name} it's your birthday`);
              data.message = `Hey, ${res.rows[i].f_name} it's your birthday`;
              //send message to hookbin
              const req = https.request(options, (res) => {
                console.log(`status: ${res.statusCode}`);
              });

              req.write(JSON.stringify(data));
              req.end();
            }
          } else {
            //next user
            // console.log("User location : " + res.rows[i].location);
            // console.log("User time : " + res.rows[i].location);
            console.log("not birthday date");
          }
        }
      } else {
        console.info(err.message);
      }
      pool.end;
    }
  );
}, daily_interval);

module.exports = test;
