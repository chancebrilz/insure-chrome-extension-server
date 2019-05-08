const axios = require("axios");

exports.lookup = url => {
  const path = "http://cosc490.chance.sh:5000/predict";
  const payload = JSON.stringify([{ url: url }]);

  return axios
    .post(`${path}`, payload, {
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      const data = response.data.split(":");

      let [rating, confidence] = data;
      confidence = JSON.parse(confidence)[0];

      const good = rating == "good";

      return [good, confidence];
    })
    .catch(err => console.error(err.message));
};
