const config = require("../config.js");
const mongoose = require("mongoose");

const connectionUrl = config.db.connection;

mongoose.connect(connectionUrl, { useNewUrlParser: true });

const BlacklistSchema = new mongoose.Schema({
  url: String,
  malicious: Boolean
});

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = {
  connection: mongoose,
  Blacklist: Blacklist
};
