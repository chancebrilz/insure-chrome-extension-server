const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./db");
const cors = require("cors");
const nn = require("./nn.js");

//= Used to track time for logs
const { performance } = require("perf_hooks");

//= Mongoose models
const { Blacklist, Log } = db;

app.use(cors());

app.get("/", (req, res) => {
  if ("url" in req.query) {
    const url = req.query.url || "";
    const startTime = performance.now();

    Blacklist.find({
      url: url
    })
      .then(async item => {
        const saveLog = () => {
          const endTime = performance.now();

          // Create log
          const log = new Log({
            url: url,
            length: endTime - startTime
          });

          log.save().catch(err => console.log("Log Error:", err));
        };

        // Return response
        if (item.length > 0) {
          const b = item[0];

          saveLog();

          return res.json({
            url: b.url,
            malicious: b.malicious
          });
        } else {
          const [good, confidence] = await nn.lookup(url);

          saveLog();

          return res.json({
            url: url,
            malicious: !good,
            confidence: confidence
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.json({
          error: err.message
        });
      });
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

app.listen(port, () =>
  console.log(`ThirdEye API Server listening on port ${port}!`)
);
