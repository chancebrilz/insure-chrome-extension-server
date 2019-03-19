const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./db");

const Blacklist = db.Blacklist;

app.get("/", (req, res) => {
  if ("ip" in req.query) {
    return res.json({
      ip: req.query.ip,
      status: "unknown"
    });
  } else {
    return res.json({
      error: "No IP address supplied"
    });
  }
});

app.get("/blacklist", (req, res) => {
  const query = Blacklist.find({}).limit(100);

  query.exec((err, results) => {
    return res.json(results);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
