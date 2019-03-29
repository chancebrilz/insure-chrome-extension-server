const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./db");

const Blacklist = db.Blacklist;

app.get("/", (req, res) => {
  if ("url" in req.query) {
    Blacklist.find({
      url: req.query.url
    })
      .then(item => {
        if (item.length > 0) {
          return res.json(item[0]);
        } else {
          return res.json(
            new Blacklist({
              url: req.query.url,
              malicious: false
            })
          );
        }
      })
      .catch(err => res.json(err));
  } else {
    return res.json({
      error: "No URL supplied"
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
