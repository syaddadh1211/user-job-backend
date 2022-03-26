const pool = require("../db/db");

//get data from user table (interval = everyday)
const test = setInterval(() => {
  pool.query(
    "Select to_char(birthday, 'mm-dd') as month, id, f_name,l_name, location, gmt_offset from public.user",
    (err, res) => {
      if (!err) {
        //checking month, if match with birthday month then checking day, if not continue
        for (let i = 0; i < res.rows.length; i++) {
          let month = res.rows[i].month.slice(0, 2);
          let day = res.rows[i].month.slice(3, 5);
          console.info(month);
          console.info(`day : ${day}`);
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
