const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const cors = require("cors");

const corsOption = {
  origin: ['https://syaddad.domcloud.io/'],
};

router.use(cors());
router.use(express.json()); // req.body
router.use(express.urlencoded({ extended: true }));

//get all
router.get("/", async (req, res) => {
  try {
    let query =
      "SELECT js.id, js.sector_name, st.id type1_id , st.type_name type1, st2.id type2_id, st2.type2_name type2, st3.id type3_id, st3.type_name type3 FROM job_sector js";
    query =
      query +
      " LEFT JOIN sector_type1 st ON js.id = st.job_sector_id LEFT JOIN sector_type2 st2 ON st.id = st2.type1_id";
    query =
      query +
      " LEFT JOIN sector_type3 st3 ON st2.id = st3.type2_id ORDER BY js.sector_name,type1, type2, type3";

    const allJobs = await pool.query(query);
    res.json(allJobs.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get result
router.get("/result", async (req, res) => {
  try {
    const name = req.query.name;
    let query =
      "select uj.sectortype_id, st.type_name from user_job uj, sector_type1 st where uj.sectortype_id = st.id and uj.name=$1 UNION";
    query =
      query +
      " select uj.sectortype_id, st2.type2_name from user_job uj, sector_type2 st2 where uj.sectortype_id = st2.id and uj.name=$1 UNION";
    query =
      query +
      " select uj.sectortype_id, st3.type_name from user_job uj, sector_type3 st3 where uj.sectortype_id = st3.id and uj.name=$1";

    const allJobs = await pool.query(query, [name]);
    res.json(allJobs.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// insert
router.post("/", (req, res) => {
  try {
    //await
    const { name, selected } = req.body;

    selected.map((item, index) => {
      const newUser = pool.query(
        "insert into public.user_job (name, sectortype_id, term_agree) values ($1,$2,$3) returning *",
        [name, item, "1"]
      );
    });

    res.json({ response: "success" });
  } catch (err) {
    console.error(err.message);
  }
});

//delete
router.delete("/result", (req, res) => {
  try {
    const { name, items } = req.body;

    items.map((item, index) => {
      const deleteItems = pool.query(
        "delete from public.user_job where name=$1 and sectortype_id=$2",
        [name, item]
      );
    });
    res.json({ response: "User items was successfully deleted" });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
