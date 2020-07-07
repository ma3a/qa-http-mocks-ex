var express = require("express");
const bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

var memo = {};

app.post("/externalapi/square", function (req, res) {
  remember(req);
  //res.send({ result: req.body.value * req.body.value });
  res.send(
    `{
      "result": 16
     }`
  );
});

app.get("/mock/requests/", function (req, res) {
  var body = retrieveRemembered(req);
  res.send(body);
});

function remember(req) {
  var header = req.headers["x-trace-id"];
  if (header) {
    memo[header] = req.body;
  }
}

function retrieveRemembered(req) {
  var header = req.headers["x-trace-id"];
  return memo[header];
}

app.listen(8082);
