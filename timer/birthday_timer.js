const { threadId, parentPort } = require("worker_threads");
const pool = require("../db/db");
const https = require("https");

let daily_interval = 3000;
let hourly_interval = 1000;
//set time to deliver, 9am
let h_time = 5;

parentPort.addListener("interval", (interval) => {
  daily_interval = interval;
  parentPort.close();
});

const data = {
  message: "",
};

let matchUser = [];

const options = {
  hostname: "hookb.in",
  port: 443,
  path: "/LgzyVyqjLQf18VqqgBO9",
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

//get data from user table (interval = everyday) = 1000 * 60 * 60 * 24,
//but in this scenario i use interval every 3 second for simple debuggging

const daily = setInterval(() => {
  //is there any unsent data ? if yes, try to send again
  console.log("Matchuser : " + matchUser.length);

  if (matchUser.length > 0) {
    matchUser.map(myFunction);
    function myFunction(value, index, array) {
      console.log("User location : " + value.location);
      console.log(`Hey, ${value.f_name} it's your birthday`);
      data.message = `Hey, ${value.f_name} it's your birthday`;
      //send message to hookbin
      const req = https.request(options, (res) => {
        console.log(`status: ${res.statusCode}`);
        const statusCode = res.statusCode;
      });
      if ((statusCode = 200)) {
        req.write(JSON.stringify(data));
        req.end();
        //remove, already sent
        matchUser.filter((user) => user.id !== value.id);
      }
    }
  }

  pool.query(
    "Select to_char(birthday, 'mm-dd') as month, id, f_name,l_name, location, gmt_offset from public.user",
    (err, res) => {
      if (!err) {
        //checking current month, if match with birthday month then checking day, if not continue
        let y_m_d = "";
        for (let i = 0; i < res.rows.length; i++) {
          //get birthday month and day
          let month = res.rows[i].month.slice(0, 2);
          let day = res.rows[i].month.slice(3, 5);

          //get current date based on user location
          y_m_d = calcTime(res.rows[i].location, res.rows[i].gmt_offset);
          console.log("local time :" + y_m_d);
          let c_month = y_m_d.getMonth() + 1;
          let c_date = y_m_d.getDate();
          // console.info(month + " " + day);
          // console.info(c_month + " " + c_date);
          //if month and day match with local date
          if (month == c_month && day == c_date) {
            filteredUser = {
              id: res.rows[i].id,
              f_name: res.rows[i].f_name,
              l_name: res.rows[i].l_name,
              location: res.rows[i].location,
              gmt_offset: res.rows[i].gmt_offset,
            };
            matchUser.push(filteredUser);
          }
        }

        const hourly = setInterval(() => {
          matchUser.map(myFunction);
          function myFunction(value, index, array) {
            let c_hour = y_m_d.getHours();
            // if hour match with c_hour

            if (h_time === c_hour) {
              // console.log("User location : " + value.id);
              // console.log(`Hey, ${value.f_name} it's your birthday`);
              console.log(h_time + " local " + c_hour);
              data.message = `Hey, ${value.f_name} it's your birthday`;
              //send message to hookbin
              const req = https.request(options, (res) => {
                console.log(`status: ${res.statusCode}`);
                const statusCode = res.statusCode;
              });
              if ((statusCode = 200)) {
                req.write(JSON.stringify(data));
                req.end();
                //remove from list, already sent
                matchUser = matchUser.filter((user) => user.id !== value.id);
              }
            }
          }
        }, hourly_interval);
      } else {
        console.info(err.message);
      }

      pool.end;
    }
  );
}, daily_interval);

module.exports = daily;
