const pool = require("../db/db");
const https = require("https");

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

function calcTime(city, offset) {
  var b = new Date();
  var utc = b.getTime() + b.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * offset);
  return nd;
}

//get data from user table (interval = everyday), but in this scenario i use interval every 3 second
const test = setInterval(() => {
  pool.query(
    "Select to_char(birthday, 'mm-dd') as month, id, f_name,l_name, location, gmt_offset from public.user",
    (err, res) => {
      if (!err) {
        //set time to deliver
        let h_time = 9;
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
            console.log("not birthday date");
          }
        }

        // with next user
        // return console.log(res.rows);
        // //checking every hour, if mo
        // const test = setInterval(() => {}, 2000);
      } else {
        console.info(err.message);
      }
      pool.end;
    }
  );
}, 3000);

module.exports = test;
