var express = require("express");
var app = express();

var axios = require("axios").default;
var externalApiBaseUrl = "http://localhost:8082";
axios.defaults.baseURL = externalApiBaseUrl;
axios.defaults.timeout = 1000;

app.get("/api/call", async function (req, res) {
  var traceId = getTraceId(req);

  await axios
    .post(
      "/externalapi/square",
      { value: 4 },
      { headers: { "x-trace-id": traceId } }
    )
    .then((v) => {
      var square = v.data.result;
      res.send(`Succesfully! Result is ${square}`);
    })
    .catch((r) => {
      res.statusCode = 500;
      res.send(`Failed! cause: "${r}"`);
    });
});

function getTraceId(req) {
  return req.headers["x-trace-id"] ? req.headers["x-trace-id"] : "default";
}
app.listen(8080);
