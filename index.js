const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  if ("ip" in req.query) {
    return res.json({
      ip: req.query.ip,
      status: "unknonw"
    });
  } else {
    return res.json({
      error: "No IP address supplied"
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
