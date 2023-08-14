const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.use(express.json()); // req.body

//get all
router.get("/", async (req, res) => {
  try {
    let query ="SELECT js.sector_name, st.id type1_id , st.type_name type1, st2.id type2_id, st2.type2_name type2, st3.id type3_id, st3.type_name type3 FROM job_sector js"
    query = query + " LEFT JOIN sector_type1 st ON js.id = st.job_sector_id LEFT JOIN sector_type2 st2 ON st.id = st2.type1_id"
    query = query + " LEFT JOIN sector_type3 st3 ON st2.id = st3.type2_id ORDER BY js.sector_name"
     
    const allJobs = await pool.query(query);
    res.json(allJobs.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get one
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await pool.query("Select * from public.user where id=$1", [
//       id,
//     ]);
//     res.json(user.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//insert
// router.post("/", async (req, res) => {
//   try {
//     //await
//     const { f_name, l_name, birthday, location, gmt_offset } = req.body;
//     const newUser = await pool.query(
//       "insert into public.user (f_name, l_name, birthday, location, gmt_offset) values ($1,$2,$3,$4,$5) returning *",
//       [f_name, l_name, birthday, location, gmt_offset]
//     );
//     res.json(newUser.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//can update location and gmt_offset
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { location, gmt_offset } = req.body;
//     const updateUser = await pool.query(
//       "Update public.user set location=$1, gmt_offset=$2 where id=$3",
//       [location, gmt_offset, id]
//     );
//     res.json("User was updated");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//delete
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteUser = await pool.query("delete from public.user where id=$1", [
//       id,
//     ]);
//     res.json("User was successfully deleted");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

module.exports = router;
